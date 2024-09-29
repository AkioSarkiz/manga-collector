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
} from "../../index.js";
import * as cheerio from "cheerio";
import { axios } from "../../lib/axios.js";
import { urlJoin } from "../../functions.js";

export class MangafireScraper implements Scraper {
  private readonly baseUrl = "https://mangafire.to";

  public async init(): Promise<void> {
    // There is not anything to do here.
  }

  public async shutdown(): Promise<void> {
    // There is not anything to do here.
  }

  private formatStatus(status: string): ScrapedMangaStatus {
    const formattedStatus = status.toLowerCase();

    switch (formattedStatus) {
      case "releasing":
        return "ongoing";

      case "discontinued":
        return "cancelled";

      case "info":
        return "ongoing";

      case "on_hiatus":
        return "hiatus";

      case "completed":
        return formattedStatus;

      default:
        throw new Error(`Unknown status: ${status}`);
    }
  }

  public async getDetailedManga(url: string): Promise<ScrapedDetailedManga> {
    const response = await axios.get(url);

    if (!response) {
      throw new Error(`Failed to get detailed manga ${url}`);
    }

    const $ = cheerio.load(response.data);

    const genresBox = $(".meta > div:nth-child(3) > span:nth-child(2) a");
    const chaptersBox = $(".list-body ul li");

    const status = this.formatStatus($(".info p").text()?.trim());
    const genres: ScrapedGenre[] = [];
    const chapters: ScrapedChapter[] = [];
    const title = $('[itemprop="name"]')?.text()?.trim();
    const description = $(".info h6")?.text()?.trim();
    const imageThumbnail = $('[itemprop="image"]')?.attr("src");
    const authors: ScrapedAuthor[] = [
      {
        name: $('[itemprop="author"]')?.text()?.trim(),
        url: $('[itemprop="author"]')?.attr("href")?.trim(),
      },
    ];

    genresBox.each((i, e) => {
      genres.push({
        name: $(e).text().trim(),
        url: $(e).attr("href")?.trim(),
      });
    });

    chaptersBox.each((i, e) => {
      const index = $(e).data("number");
      const url = $(e).find("a").attr("href")?.trim();
      const title = `Chapter ${index}`;

      if (!index || !url) {
        throw new Error(`Failed to get detailed manga ${url}`);
      }

      chapters.push({
        title,
        index: Number(index),
        url: urlJoin(this.baseUrl, url),
      });
    });

    if (!title || !description || !authors[0].name || !imageThumbnail || !genresBox.length || !chaptersBox.length) {
      throw new Error(`Failed to get detailed manga ${url}`);
    }

    return {
      status,
      url,
      title,
      description,
      authors,
      genres,
      imageThumbnail,
      chapters,
    };
  }

  public async getDetailedChapter(url: string): Promise<ScrapedDetailedChapter> {
    const frames: ScrapedDetailedChapterFrame[] = [];

    const urlObj = new URL(url);
    const chapterId = urlObj.pathname.split("/")[2].split(".").pop();
    const response = await axios.get(urlJoin(this.baseUrl, `ajax/read/${chapterId}/chapter/en`));
    const $ = cheerio.load(response.data.result.html);
    const realChapterId = Number($("[data-id]").data("id"));

    if (Number.isNaN(realChapterId)) {
      throw Error("Failed to get real chapter id");
    }

    const { data }: { data: { result: { images: Array<string[]> } } } = await axios.get(
      urlJoin(this.baseUrl, `ajax/read/chapter/${realChapterId}`),
    );

    data.result.images.forEach((image, i) => {
      frames.push({
        originSrc: image[0],
        index: i + 1,
      });
    });

    return {
      url,
      frames,
    };
  }

  private extractTotalDataNumber(input: string): number | null {
    const match = input.match(/(\d{1,3}(?:,\d{3})*)/);

    if (match) {
      return parseInt(match[0].replace(/,/g, ""), 10);
    } else {
      return null;
    }
  }

  private async parseDashboardPage(path: string, page: number): Promise<ScrapedListOfManga> {
    const itemsPerPage = 30;
    const items: ScrapedListOfMangaItem[] = [];

    const response = await axios.get(urlJoin(this.baseUrl, path), {});

    if (page < 0) {
      throw new Error(`Page cannot be less than 0`);
    }

    if (!response) {
      throw new Error(`Failed to get latest updates`);
    }

    const $ = cheerio.load(response.data);

    const totalData = this.extractTotalDataNumber($(".head > span").text().trim());

    if (totalData === null) {
      throw new Error(`Failed to get total data`);
    }

    $(".original .unit").each((_, e) => {
      const title = $(e).find(".info > a").text().trim();
      const imageThumbnail = $(e).find("img").attr("src");
      const url = $(e).find("a").attr("href")?.trim();

      if (!imageThumbnail || !title || !url) {
        throw new Error(`Failed to get items`);
      }

      items.push({
        title,
        imageThumbnail,
        url,
      });
    });

    return {
      currentPage: page,
      data: items,
      canPrev: page > 1,
      totalData,
      canNext: page * itemsPerPage < totalData,
      totalPages: Math.ceil(totalData / itemsPerPage),
    };
  }

  public async getLatestUpdates(_page?: number): Promise<ScrapedListOfManga> {
    const page = _page || 1;

    return await this.parseDashboardPage(`filter?keyword=&language[]=en&sort=release_date&page=${page}`, page);
  }

  public async search(query: string, _page?: number): Promise<ScrapedListOfManga> {
    const page = _page || 1;

    return await this.parseDashboardPage(
      `filter?keyword=${encodeURI(query)}&language[]=en&sort=release_date&page=${page}`,
      page,
    );
  }
}
