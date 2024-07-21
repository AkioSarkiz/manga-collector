import * as cheerio from "cheerio";
import {
  ScrapedArtist,
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
import { dayjs } from "../lib/index.js";
import { convertToNumber, extractChapterIndex } from "../utils/index.js";
import { axios } from "../lib/index.js";
import urlJoin from "url-join";

export class ToonilyScraper implements Scraper {
  private readonly baseUrl: string = "https://toonily.com/";

  private getUrl(path: string = ""): string {
    return urlJoin(this.baseUrl, path);
  }

  public async getLatestUpdates(page: number = 1): Promise<ScrapedListOfManga> {
    const items: ScrapedListOfMangaItem[] = [];
    const url = this.getUrl(`${page !== undefined && page > 1 ? `/page/${page}` : ``}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    $("#loop-content > div > div > div").each((i, e) => {
      items.push({
        title: $(e).find("div.item-summary > div.post-title.font-title > h3 > a").text(),
        imageThumbnail: $(e).find("div.item-thumb.c-image-hover > a > img").attr("data-src")!,
        url: $(e).find("div.item-summary > div.post-title.font-title > h3 > a").attr("href")!,
      });
    });

    const lastPage = $("div.wp-pagenavi").find("a.last").attr("href")!;

    const totalPages = Number(
      lastPage !== undefined
        ? lastPage
            .substring(0, lastPage.length - 1)
            .split("/")
            .at(-1)
        : page !== undefined
        ? page
        : 1
    );

    return {
      data: items,
      // there are not way to get total data from website. Sure, we can make something like this:
      // totalPages * max data per page, but it's not true, because the last page can contains less then 20 items
      totalData: undefined,
      totalPages,
      currentPage: page !== undefined ? page : 1,
      canNext: page !== undefined ? page < totalPages : 1 < totalPages,
      canPrev: page !== undefined ? page > 1 : false,
    };
  }

  public async getDetailedManga(url: string): Promise<ScrapedDetailedManga> {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const genres: ScrapedGenre[] = [];
    const chapters: ScrapedChapter[] = [];
    const siteContent = $("div.site-content");

    const authors = $(".author-content")
      .find("a")
      .map((_, e): ScrapedAuthor => {
        return {
          name: $(e).text().trim(),
          url: $(e).attr("href")?.trim(),
        };
      })
      .toArray();

    const artists = $(".artist-content")
      .find("a")
      .map((_, e): ScrapedArtist => {
        return {
          name: $(e).text().trim(),
          url: $(e).attr("href")?.trim(),
        };
      })
      .toArray();

    const status = this.formatStatus($(".post-status .post-content_item:nth-child(2) .summary-content").text().trim());
    const description = $(".summary__content").text().trim();
    const views: number = convertToNumber($(".manga-rate-view-comment .item:nth-child(2)").text().trim());
    const rate = Number($(".manga-rate-view-comment .item:nth-child(1) #averagerate").text().trim());
    const rateNumber = Number(siteContent.find("#countrate").text().trim());
    const imageThumbnail = $(".summary_image img").data("src");

    const alternativeTitles = $(".manga-info-row > div:nth-child(2) > div:nth-child(2)")
      .text()
      .trim()
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.toLowerCase() !== "updating");

    const title = siteContent
      .find("div.post-content > div.post-title > h1")
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim();

    let followsUsers = undefined;
    let followsUsersUnformatted = $(".add-bookmark .action_detail").text().trim();

    if (followsUsersUnformatted) {
      followsUsers = followsUsersUnformatted.match(/\d+/g)?.map(Number)[0];
    }

    siteContent.find("ul.main.version-chap.no-volumn > li.wp-manga-chapter").each((i, e) => {
      chapters.push({
        url: $(e).find("a").attr("href")!,
        title: $(e).find("a").text().trim(),
        lastUpdate: dayjs($(e).find(".chapter-release-date").text().trim(), "MMM D, YY").toDate(),
        index: extractChapterIndex($(e).find("a").text().trim()),
      });
    });

    $("div.genres-content > a").each((_, e) => {
      genres.push({
        url: $(e).attr("href")!,
        name: $(e).text().trim(),
      });
    });

    if (!imageThumbnail || typeof imageThumbnail !== "string") {
      throw new Error("Failed to get image thumbnail");
    }

    return {
      url,

      // this site hosts only manhwa
      type: "manhwa",

      description,
      alternativeTitles,

      imageThumbnail,

      authors,
      artists,

      genres,
      rate,
      rateVoters: rateNumber ? Number(rateNumber) : undefined,
      followsUsers,
      views,
      title,
      status: status.toLowerCase() as ScrapedMangaStatus,
      chapters,
    };
  }

  private formatStatus(status: string): string {
    status = status.toLowerCase();

    switch (status) {
      case "canceled":
        return "cancelled";

      default:
        return status;
    }
  }

  public async getDetailedChapter(chapterUrl: string): Promise<ScrapedDetailedChapter> {
    const response = await axios.get(chapterUrl);
    const $ = cheerio.load(response.data);
    const siteContent = $("div.main-col-inner");
    const title = siteContent.find("ol.breadcrumb > li:nth-child(3)").text().trim();

    const frames: ScrapedDetailedChapterFrame[] = [];

    siteContent.find("div.entry-content div.reading-content > div.page-break > img").each((i, e) => {
      frames.push({
        index: i,
        originSrc: $(e).attr("data-src")!.trim(),
        alt: $(e).attr("alt")?.trim(),
      });
    });

    return {
      url: chapterUrl,
      title,
      frames,
    };
  }

  async search(query: string, page?: number | undefined): Promise<ScrapedListOfManga> {
    const formattedQuery = query.replace(/\s/g, "-");
    const url = `${this.baseUrl}/search/${formattedQuery}${page !== undefined && page > 1 ? `/page/${page}` : ``}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const wrapItems = $("div.page-listing-item > div.row.row-eq-height > div > div");

    const data: ScrapedListOfMangaItem[] = [];

    wrapItems.each((i, e) => {
      data.push({
        title: $(e).find("div.item-summary > div.post-title.font-title > h3 > a").text(),
        imageThumbnail: $(e).find("div.item-thumb.c-image-hover > a > img").attr("data-src")!,
        url: $(e).find("div.item-summary > div.post-title.font-title > h3 > a").attr("href")!,
      });
    });

    const latPage = $("div.wp-pagenavi").find("a.last").attr("href")!;

    const totalPages = Number(
      latPage !== undefined
        ? latPage
            .substring(0, latPage.length - 1)
            .split("/")
            .at(-1)
        : page !== undefined
        ? page
        : 1
    );

    return {
      data,
      totalData: data.length,
      totalPages,
      currentPage: page !== undefined ? page : 1,
      canNext: page !== undefined ? page < totalPages : 1 < totalPages,
      canPrev: page !== undefined ? page > 1 : false,
    };
  }

  public async init() {
    // there is nothing we need to do
  }

  public async shutdown() {
    // there is nothing we need to do
  }
}
