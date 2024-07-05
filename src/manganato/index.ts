import parse, { HTMLElement } from "node-html-parser";
import { axios } from "../axios.js";
import { DashboardManga, ParseDashboardPageProps } from "../types/list.js";
import {
  Author,
  Genre,
  ScrapedAuthor,
  ScrapedChapter,
  ScrapedDetailedChapter,
  ScrapedDetailedChapterFrame,
  ScrapedDetailedManga,
  ScrapedGenre,
  ScrapedListOfManga,
  ScrapedListOfMangaItem,
  Scraper,
} from "../types/index.js";
import { decode } from "html-entities";
import { convertToNumber, extractChapterIndex, extractNumbersFromStrings } from "../utils/index.js";
import dayjs from "dayjs";
import * as cheerio from "cheerio";

export const BASE_URL = "https://manganato.com";

const parseDashboardPage = async (props: ParseDashboardPageProps): Promise<DashboardManga[]> => {
  const mangaList: DashboardManga[] = [];
  const url = getBaseUrl(props.url);

  const response = await axios.get(url);

  if (response.status !== 200) {
    return [];
  }

  const document = parse(response.data);
  const panel = document.querySelector(".panel-content-genres");

  if (!panel) {
    return [];
  }

  const mangaCards = panel.querySelectorAll(".content-genres-item");

  for (let i = 0; i < mangaCards.length; i++) {
    const mangaCard = mangaCards[i];
    const title = mangaCard.querySelector(".genres-item-info > h3")?.innerText;
    const link = mangaCard.querySelector(".genres-item-info > a")?.getAttribute("href") as string;
    const cover = mangaCard.querySelector(".img-loading")?.getAttribute("src") as string;
    const rating = mangaCard.querySelector(".genres-item-rate")?.innerText;
    const views = mangaCard.querySelector(".genres-item-view")?.innerText;
    let description = mangaCard.querySelector(".genres-item-description")?.innerText || null;

    if (description) {
      description = decode(description.replace(/\n/g, ""));
    }

    if (title && link && cover && rating && views) {
      mangaList.push({
        title: title.trim(),
        link,
        cover,
        rating,
        views,
        description,
      });
    }
  }

  return mangaList;
};

const getBaseUrl = (path: string = ""): string => {
  return `${BASE_URL}/${path}`;
};

export class ManganatoScraper implements Scraper {
  public async search(query: string, page: number = 1): Promise<ScrapedListOfManga> {
    const items: ScrapedListOfMangaItem[] = [];
    const formattedQuery = query.replaceAll(" ", "_");
    const url = getBaseUrl(`search/story/${formattedQuery}?${page ? page : ""}`);
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error("Failed to fetch manga list");
    }

    const document = parse(response.data);
    const panel = document.querySelector(".panel-search-story");

    if (!panel) {
      throw new Error("Failed to fetch manga list");
    }

    const mangaCards = panel?.querySelectorAll(".search-story-item");

    for (let i = 0; i < mangaCards.length; i++) {
      const mangaCard = mangaCards[i];
      const title = mangaCard.querySelector("h3")?.innerText?.trim();
      const url = mangaCard.querySelector(".item-img")?.getAttribute("href") as string;
      const imageThumbnail = mangaCard.querySelector(".img-loading")?.getAttribute("src") as string;

      if (title && url && imageThumbnail) {
        items.push({ _id: i, title, url, imageThumbnail });
      } else {
        throw new Error("Failed to fetch manga list");
      }
    }

    const totalData = (function () {
      const result = document?.querySelector(".group-qty")?.innerText;

      if (!result) {
        return 0;
      }

      return extractNumbersFromStrings(result)[0];
    })();

    const totalPages = (function () {
      const result = document.querySelector(".page-last")?.innerText;

      if (!result) {
        return 0;
      }

      return extractNumbersFromStrings(result)[0];
    })();

    return {
      currentPage: page,
      canNext: page < totalPages,
      canPrev: page > 1,
      totalPages,
      totalData,
      data: items,
    } as ScrapedListOfManga;
  }

  public async getLatestMangaList(page: number = 1): Promise<DashboardManga[]> {
    const url = `genre-all/${page ? page : ""}`;

    return parseDashboardPage({ url, page });
  }

  public async getNewestMangaList(page: number = 1): Promise<DashboardManga[]> {
    const url = `genre-all/${page ? page : ""}?type=newest`;

    return parseDashboardPage({ url, page });
  }

  public async geHotMangaList(page: number = 1): Promise<DashboardManga[]> {
    const url = `genre-all/${page ? page : ""}?type=topview`;

    return parseDashboardPage({ url, page });
  }

  public async getDetailedManga(url: string): Promise<ScrapedDetailedManga> {
    interface ParsedTableRow {
      header: HTMLElement;
      value: HTMLElement;
    }

    const parseTable = (tableNode: HTMLElement): Array<ParsedTableRow> => {
      let tableTrs = tableNode.querySelectorAll("tr");

      return Array.from(tableTrs)
        .map((item: HTMLElement): ParsedTableRow | null => {
          const header = item.querySelector("td:nth-child(1)");
          const value = item.querySelector("td:nth-child(2)");

          if (!header || !value) {
            return null;
          }

          return { header, value };
        })
        .filter((value) => value) as ParsedTableRow[];
    };

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error("Failed to get detailed manga");
    }

    const document = parse(response.data);
    const storyRightInfo = document.querySelector(".story-info-right");
    const chapterContainer = document.querySelector(".row-content-chapter");
    const title = String(storyRightInfo?.querySelector("h1")?.innerText);

    if (!storyRightInfo || !chapterContainer) {
      throw new Error(`Failed to get detailed manga, url ${url}`);
    }

    const chapterLis = Array.from(chapterContainer.querySelectorAll("li"));
    const tableInfo = storyRightInfo.querySelector(".variations-tableInfo");

    if (!tableInfo) {
      throw new Error("Failed to get detailed manga");
    }

    const parsedTableInfo = parseTable(tableInfo);

    const altTitles: string[] =
      parsedTableInfo
        .find((value) => value.header.innerText.trim() === "Alternative :")
        ?.value.innerText.split(",")
        .map((value) => value.trim()) ?? [];

    const status = parsedTableInfo
      .find((value) => value.header.innerText.trim() === "Status :")
      ?.value.innerText.trim()
      .toLocaleLowerCase();

    const authors: ScrapedAuthor[] =
      parsedTableInfo
        .find((value) => value.header.innerText.trim() === "Author(s) :")
        ?.value.querySelectorAll("a")
        .map(
          (value) =>
            ({
              link: value.getAttribute("href"),
              name: value.innerText.trim(),
            } as ScrapedAuthor)
        ) ?? [];

    const genres: ScrapedGenre[] =
      parsedTableInfo
        .find((value) => value.header.innerText.trim() === "Genres :")
        ?.value.querySelectorAll("a")
        .map(
          (value) =>
            ({
              url: value.getAttribute("href")?.trim(),
              name: value.innerText.trim(),
            } as ScrapedGenre)
        ) ?? [];

    const chapters: ScrapedChapter[] = chapterLis.map((value, index): ScrapedChapter => {
      const lastUpdate = value.querySelector(".chapter-time")?.innerText?.trim();
      const views = value.querySelector(".chapter-view")?.innerText?.trim();
      const title = value.querySelector("a")?.innerText.replace(/Vol\.\d+\s+Chapter\s+\d+:"/i, "");
      const url = value.querySelector("a")?.getAttribute("href");

      if (!lastUpdate || !views || !title || !url) {
        throw Error(`Failed to parse chapter ${url}, index: ${index}`);
      }

      return {
        _id: index,
        url,
        title,
        index: extractChapterIndex(title),
        views: convertToNumber(views),
        lastUpdate: dayjs(lastUpdate, "MMM D, YY").toDate(),
      } as ScrapedChapter;
    });

    const description = document.querySelector("#panel-story-info-description")?.childNodes[2].textContent.trim();

    if (
      !altTitles ||
      !status ||
      !["ongoing", "completed"].includes(status) ||
      !authors ||
      !description ||
      !genres ||
      !chapters
    ) {
      throw new Error("Failed to get detailed manga");
    }

    return {
      url,
      title,
      status,
      description,
      genres,
      chapters,
      authors,
    } as ScrapedDetailedManga;
  }

  public async getDetailedChapter(url: string): Promise<ScrapedDetailedChapter> {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const frames: ScrapedDetailedChapterFrame[] = [];

    $(".container-chapter-reader img").each((i, e) => {
      const originSrc = $(e).attr("src")?.trim();

      if (!originSrc) {
        throw new Error("Failed to get detailed chapter");
      }

      frames.push({
        _id: i,
        originSrc,
        alt: $(e).attr("alt")?.trim(),
      });
    });

    return {
      title: $(".panel-chapter-info-top h1").text().trim(),
      url,
      frames,
    } as ScrapedDetailedChapter;
  }

  public async init() {
    // there are notion we need to do
  }

  public async shutdown() {
    // there are notion we need to do
  }
}
