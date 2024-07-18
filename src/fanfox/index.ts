import urlJoin from "url-join";
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
} from "../types/scraper.js";
import * as cheerio from "cheerio";
import { axios } from "../lib/axios.js";
import puppeteer, { Browser, GoToOptions } from "puppeteer";
import { injectJquery } from "../lib/puppeteer.js";
import pLimit, { LimitFunction } from "p-limit";

export class FanFoxScraper implements Scraper {
  private readonly baseUrl = "https://fanfox.net";

  private puppeteerInstance: Browser | null = null;
  private puppeteerGotoOptions: GoToOptions = {
    waitUntil: "networkidle0",
    timeout: 30_000,
  };

  private limit: LimitFunction = pLimit(4);

  private getUrl(path: string = ""): string {
    return urlJoin(this.baseUrl, path);
  }

  private formatStatus(status: string): ScrapedMangaStatus {
    const formattedStatus = status.toLowerCase();

    switch (formattedStatus) {
      case "ongoing":
      case "completed":
        return formattedStatus;

      default:
        throw new Error(`Unknown status: ${status}`);
    }
  }

  public async getDetailedManga(url: string): Promise<ScrapedDetailedManga> {
    const chapters: ScrapedChapter[] = [];
    const genres: ScrapedGenre[] = [];

    const response = await axios.get(url, {
      headers: {
        Cookie: "isAdult=1",
      },
    });
    const $ = cheerio.load(response.data);

    const title = $(".detail-info-right-title-font").text()?.trim();
    const imageThumbnail = $(".detail-info-cover-img").attr("src");
    const description = $(".detail-info-right-content").text()?.trim();
    const rawStatus = $(".detail-info-right-title-tip").text().trim();
    const authors = $(".detail-info-right-say a")
      .map((_, el): ScrapedAuthor => {
        const name = $(el).text().trim();
        const url = $(el).attr("href");

        if (!name || !url) {
          throw new Error("Failed to get detailed manga");
        }

        return { name, url: this.getUrl(url) };
      })
      .toArray();

    if (!title || !imageThumbnail || !description) {
      throw new Error("Failed to get detailed manga");
    }

    $($(".detail-main-list > li").get().reverse()).each((i, el) => {
      const url = $(el).find("a").attr("href");
      const title = $(el).find(".title3").text().trim();

      if (!url || !title) {
        throw new Error("Failed to get detailed manga");
      }

      chapters.push({
        index: i,
        title,
        url: this.getUrl(url),
      });
    });

    $(".detail-info-right-tag-list > a").each((_, el) => {
      const name = $(el).text().trim();
      const url = $(el).attr("href");

      if (!name || !url) {
        throw new Error("Failed to get detailed manga");
      }

      genres.push({
        name,
        url: this.getUrl(url),
      });
    });

    return {
      title,
      imageThumbnail,
      description,
      chapters,
      genres,
      status: this.formatStatus(rawStatus),
      url,
      authors,
    };
  }

  public async getDetailedChapter(url: string): Promise<ScrapedDetailedChapter> {
    const puppeteerInstanceLink = this.puppeteerInstance;
    const frames: ScrapedDetailedChapterFrame[] = [];
    const promises: Promise<any>[] = [];

    if (!this.puppeteerInstance || !puppeteerInstanceLink) {
      throw new Error("Puppeteer not initialized");
    }

    const page = await this.puppeteerInstance.newPage();

    await page.goto(url, this.puppeteerGotoOptions);

    await injectJquery(page);

    const title = await page.evaluate(() => {
      // @ts-ignore
      return $(".reader-header-title-1").text().trim();
    });

    const totalFrames = await page.evaluate(() => {
      let result = -1;

      $("[data-page]").each((_, el) => {
        const pageNumber = Number($(el).data("page"));

        if (pageNumber > result) {
          result = pageNumber;
        }
      });

      return result;
    });

    if (totalFrames === null || !title) {
      throw new Error(`Failed to get detailed chapter from ${url}`);
    }

    for (let i = 0; i < Number(totalFrames); i++) {
      const scrapeFrame = async () => {
        let frame: string | null = null;
        const chapterPageUrl = url.split("/").slice(0, -1).join("/") + `/${i + 1}.html`;

        const chapterPage = await puppeteerInstanceLink.newPage();

        await chapterPage.setRequestInterception(true);

        chapterPage.on("request", (request) => {
          if (request.resourceType() === "image") {
            request.abort();
          } else {
            request.continue();
          }
        });

        await chapterPage.goto(chapterPageUrl);

        for (let i = 0; i < 200 && frame === null; i++) {
          await injectJquery(chapterPage);

          frame =
            (await chapterPage.evaluate(() => {
              return $(".reader-main-img").attr("src");
            })) || null;

          if (frame === null) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          } else {
            break;
          }
        }

        if (!frame) {
          throw new Error(`Failed to get detailed chapter from ${url} on page ${chapterPageUrl}`);
        }

        frames.push({
          index: i,
          originSrc: `https:${frame}`,
        });

        await chapterPage.close();
      };

      promises.push(this.limit(scrapeFrame));
    }

    await Promise.all(promises);

    await page.close();

    return {
      title,
      frames,
      url,
    };
  }

  public async getLatestUpdates(page: number = 1): Promise<ScrapedListOfManga> {
    const items: ScrapedListOfMangaItem[] = [];
    const url = this.getUrl(`releases/${page}.html`);

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const rawTotalPages = $(".pager-list-left a")?.eq(-2)?.attr("href")?.trim()?.match(/\d+/) ?? [];
    const rawMangaItems = $(".manga-list-4-list > li");

    if (!rawTotalPages[0] || !rawMangaItems) {
      throw new Error("Failed to get latest updates");
    }

    const totalPages = Number(rawTotalPages[0]);

    rawMangaItems.each((_, el) => {
      const imageThumbnail = $(el).find("img").attr("src");
      const url = $(el).find("a").attr("href");
      const title = $(el).find(".manga-list-4-item-title").text().trim();

      if (!imageThumbnail || !url || !title) {
        throw new Error("Failed to get latest updates");
      }

      items.push({
        title,
        imageThumbnail,
        url: this.getUrl(url),
      });
    });

    return {
      canNext: page < totalPages,
      canPrev: page > 1,
      totalData: undefined,
      currentPage: page,
      totalPages,
      data: items,
    };
  }

  public async init(): Promise<void> {
    this.puppeteerInstance = await puppeteer.launch({
      headless: true,
    });
  }

  public async shutdown(): Promise<void> {
    if (this.puppeteerInstance) {
      await this.puppeteerInstance.close();
    }
  }

  public async search(query: string, page: number = 1): Promise<ScrapedListOfManga> {
    const formattedQuery = encodeURIComponent(query);
    const url = `https://fanfox.net/search?title=&genres=&nogenres=&sort=&stype=1&name=${formattedQuery}&type=0&author_method=cw&author=&artist_method=cw&artist=&rating_method=eq&rating=&released_method=eq&released=&st=0`;
    const items: ScrapedListOfMangaItem[] = [];

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const rawTotalPages = $(".pager-list-left a")?.eq(-2)?.attr("href")?.trim()?.match(/\d+/) || [];
    const rawMangaItems = $(".manga-list-4-list > li");

    if (!rawMangaItems) {
      throw new Error("Failed to get latest updates");
    }

    const totalPages = Number(rawTotalPages[0] || 0);

    rawMangaItems.each((_, el) => {
      const imageThumbnail = $(el).find("img").attr("src");
      const url = $(el).find("a").attr("href");
      const title = $(el).find(".manga-list-4-item-title").text().trim();

      if (!imageThumbnail || !url || !title) {
        throw new Error("Failed to get latest updates");
      }

      items.push({
        title,
        imageThumbnail,
        url: this.getUrl(url),
      });
    });

    return {
      canNext: page < totalPages,
      canPrev: page > 1,
      totalData: undefined,
      currentPage: page,
      totalPages,
      data: items,
    };
  }
}
