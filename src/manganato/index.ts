import {
  ScrapedAuthor,
  ScrapedChapter,
  ScrapedDetailedChapter,
  ScrapedDetailedChapterFrame,
  ScrapedDetailedManga,
  ScrapedGenre,
  ScrapedListOfManga,
  ScrapedListOfMangaItem,
  ScrapedMangaStatus,
  Scraper,
} from "../types/index.js";
import {
  convertToNumber,
  extractChapterIndex,
  extractNumbersFromStrings,
  isOnlyNumbers,
  parseRelativeTime,
} from "../utils/index.js";
import { dayjs } from "../lib/index.js";
import * as cheerio from "cheerio";
import { axios } from "../lib/index.js";

interface ParsedTableRow {
  header: cheerio.Cheerio<cheerio.Element>;
  value: cheerio.Cheerio<cheerio.Element>;
}

export class ManganatoScraper implements Scraper {
  private readonly baseUrl = "https://manganato.com";

  public async search(query: string, page: number = 1): Promise<ScrapedListOfManga> {
    const items: ScrapedListOfMangaItem[] = [];
    const formattedQuery = query.replace(/ /g, "_");
    const url = this.getBaseUrl(`search/story/${formattedQuery}?${page ? page : ""}`);
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch manga list ${url}`);
    }

    const $ = cheerio.load(response.data);
    const panel = $(".panel-search-story");

    if (!panel) {
      throw new Error(`Failed to fetch manga list ${url}`);
    }

    const mangaCards = panel?.find(".search-story-item");

    for (let i = 0; i < mangaCards.length; i++) {
      const mangaCard = mangaCards[i];
      const title = $(mangaCard).find("h3")?.text()?.trim();
      const url = $(mangaCard).find(".item-img")?.attr("href") as string;
      const imageThumbnail = $(mangaCard).find(".img-loading")?.attr("src") as string;

      if (title && url && imageThumbnail) {
        items.push({ title, url, imageThumbnail });
      } else {
        throw new Error(`Failed to fetch manga list ${url}`);
      }
    }

    const totalData = (function () {
      const result = $(".group-qty")?.text().trim();

      if (!result) {
        return 0;
      }

      return extractNumbersFromStrings(result)[0];
    })();

    const totalPages = (function () {
      const result = $(".page-last")?.text();

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
    };
  }

  public async getLatestUpdates(page?: number): Promise<ScrapedListOfManga> {
    if (!page) {
      page = 1;
    }

    const path = `genre-all/${page}`;

    return this.parseDashboardPage(path, page);
  }

  public async getNewestMangaList(page: number = 1): Promise<ScrapedListOfManga> {
    if (!page) {
      page = 1;
    }

    const url = `genre-all/${page ? page : ""}?type=newest`;

    return this.parseDashboardPage(url, page);
  }

  public async geHotMangaList(page: number = 1): Promise<ScrapedListOfManga> {
    if (!page) {
      page = 1;
    }

    const url = `genre-all/${page ? page : ""}?type=topview`;

    return this.parseDashboardPage(url, page);
  }

  private async parseDashboardPage(path: string, page: number): Promise<ScrapedListOfManga> {
    const mangaList: ScrapedListOfMangaItem[] = [];
    const url = this.getBaseUrl(path);

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to get dashboard page ${url}`);
    }

    const $ = cheerio.load(response.data);
    const panel = $(".panel-content-genres");

    if (!panel) {
      throw new Error(`Failed to get panel content genres ${url}`);
    }

    const mangaCards = panel.find(".content-genres-item");

    for (let i = 0; i < mangaCards.length; i++) {
      const mangaCard = mangaCards[i];
      const title = $(mangaCard).find(".genres-item-info > h3")?.text()?.trim();
      const url = $(mangaCard).find(".genres-item-info .genres-item-name")?.attr("href") as string;
      const imageThumbnail = $(mangaCard).find(".img-loading")?.attr("src") as string;

      if (title && url && imageThumbnail) {
        mangaList.push({
          title,
          url,
          imageThumbnail,
        });
      } else {
        throw new Error(`Failed to parse manga card, for url ${url}`);
      }
    }

    const totalData = (function () {
      const result = $(".group-qty")?.text().trim();

      if (!result) {
        return 0;
      }

      return extractNumbersFromStrings(result)[0];
    })();

    const totalPages = (function () {
      const result = $(".page-last")?.text().trim();

      if (!result) {
        return 0;
      }

      return extractNumbersFromStrings(result)[0];
    })();

    return {
      totalPages,
      totalData,
      canNext: page < totalPages,
      canPrev: page > 1,
      currentPage: page,
      data: mangaList,
    };
  }

  private getBaseUrl(path: string = ""): string {
    return `${this.baseUrl}/${path}`;
  }

  private parseTable($: cheerio.CheerioAPI, tableNode: cheerio.Cheerio<cheerio.Element>): Array<ParsedTableRow> {
    let tableTrs = tableNode.find("tr");

    return Array.from(tableTrs)
      .map((item): ParsedTableRow | null => {
        const header = $(item).find("td:nth-child(1)");
        const value = $(item).find("td:nth-child(2)");

        if (!header || !value) {
          return null;
        }

        return { header, value };
      })
      .filter((value) => value) as ParsedTableRow[];
  }

  public async getDetailedManga(url: string): Promise<ScrapedDetailedManga> {
    let chapters: ScrapedChapter[] = [];

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to get detailed manga ${url}`);
    }

    const $ = cheerio.load(response.data);

    const storyRightInfo = $(".story-info-right");
    const chapterContainer = $(".row-content-chapter");
    const title = String(storyRightInfo?.find("h1")?.text().trim());
    const imageThumbnail = $(".info-image .img-loading")?.attr("src");

    if (!storyRightInfo) {
      throw new Error(`Failed to get detailed manga, url ${url}`);
    }

    if (chapterContainer) {
      chapters = $(chapterContainer)
        .find("li")
        .map((index, value): ScrapedChapter => {
          const lastUpdate = $(value).find(".chapter-time")?.text()?.trim();
          const views = $(value).find(".chapter-view")?.text()?.trim();
          const url = $(value).find("a")?.attr("href");

          const title = $(value)
            .find("a")
            ?.text()
            .replace(/Vol\.\d+\s+Chapter\s+\d+:"/i, "");

          if (!lastUpdate || !views || !title || !url) {
            throw Error(`Failed to parse chapter ${url}, index: ${index}`);
          }

          return {
            url,
            title,
            index: extractChapterIndex(title),
            views: isOnlyNumbers(views) ? Number(views) : convertToNumber(views),
            lastUpdate: dayjs(lastUpdate, "MMM D, YY").isValid()
              ? dayjs(lastUpdate, "MMM D, YY").toDate()
              : parseRelativeTime(lastUpdate).toDate(),
          };
        })
        .toArray();
    }

    const tableInfo = storyRightInfo.find(".variations-tableInfo");

    if (!tableInfo) {
      throw new Error(`Failed to get detailed manga ${url}`);
    }

    const parsedTableInfo = this.parseTable($, tableInfo);

    const altTitles: string[] =
      parsedTableInfo
        .find((value) => value.header.text().trim() === "Alternative :")
        ?.value.text()
        .split(",")
        .map((value) => value.trim()) ?? [];

    const status = parsedTableInfo
      .find((value) => value.header.text().trim() === "Status :")
      ?.value.text()
      .trim()
      .toLocaleLowerCase();

    const authors: ScrapedAuthor[] =
      parsedTableInfo
        .find((value) => value.header.text().trim() === "Author(s) :")
        ?.value.find("a")
        .map((_, value) => ({
          url: $(value).attr("href"),
          name: $(value).text().trim(),
        }))
        .toArray() || [];

    const alternativeTitles =
      parsedTableInfo
        .find((value) => value.header.text().trim() === "Alternative :")
        ?.value.find("h2")
        ?.text()
        .trim()
        .split(";")
        .map((value: string) => value.trim()) ?? [];

    const genres: ScrapedGenre[] =
      parsedTableInfo
        .find((value) => value.header.text().trim() === "Genres :")
        ?.value.find("a")
        .map((_, value) => ({
          url: $(value).attr("href")?.trim(),
          name: $(value).text().trim(),
        }))
        .toArray() ?? [];

    const description = $("#panel-story-info-description").clone().children().remove().end().text().trim();

    if (
      !altTitles ||
      !status ||
      !["ongoing", "completed"].includes(status) ||
      !authors ||
      !description ||
      !genres ||
      !imageThumbnail
    ) {
      throw new Error(`Failed to get detailed manga ${url}`);
    }

    return {
      url,
      title,
      alternativeTitles,
      imageThumbnail,
      status: status as ScrapedMangaStatus,
      description,
      genres,
      chapters,
      authors,
    };
  }

  public async getDetailedChapter(url: string): Promise<ScrapedDetailedChapter> {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const frames: ScrapedDetailedChapterFrame[] = [];

    $(".container-chapter-reader img").each((i, e) => {
      const originSrc = $(e).attr("src")?.trim();

      if (!originSrc) {
        throw new Error(`Failed to get detailed chapter ${url}`);
      }

      frames.push({
        index: i,
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
