import * as cheerio from "cheerio";
import { useGetDataItemsManga } from "./hooks/getListLatest";
import {
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
import dayjs from "dayjs";
import { convertToNumber, extractChapterIndex } from "../utils/index.js";
import { axios } from "../lib/index.js";

export class ToonilyScraper implements Scraper {
  private readonly baseUrl: string = "https://toonily.com/";

  async getListLatestUpdate(page?: number | undefined): Promise<ScrapedListOfManga> {
    const response = await axios.get(`${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`);
    const $ = cheerio.load(response.data);

    const paramsSelector = {
      cheerioApi: $,
      wrapSelector: "#loop-content > div > div > div",
      titleSelector: "div.item-summary > div.post-title.font-title > h3 > a",
      thumbnailSelector: "div.item-thumb.c-image-hover > a > img",
      thumbnailAttr: "data-src",
      hrefSelector: "div.item-summary > div.post-title.font-title > h3 > a",
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const lastPage = $("div.wp-pagenavi").find("a.last").attr("href")!;

    const totalPage = Number(
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
      data,
      totalData: data.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext: page !== undefined ? page < totalPage : 1 < totalPage,
      canPrev: page !== undefined ? page > 1 : false,
    };
  }

  public async getDetailedManga(url: string): Promise<ScrapedDetailedManga> {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const genres: ScrapedGenre[] = [];
    const chapters: ScrapedChapter[] = [];
    const siteContent = $("div.site-content");
    const author = {
      name: siteContent.find("div.summary-content > div.author-content > a").text()?.trim(),
      url: siteContent.find("div.summary-content > div.author-content > a").attr("href")?.trim(),
    };
    const status = this.formatStatus($(".post-status .post-content_item:nth-child(2) .summary-content").text().trim());
    const description = $(".summary__content").text().trim();
    const views: number = convertToNumber($(".manga-rate-view-comment .item:nth-child(2)").text().trim());
    const rate = Number($(".manga-rate-view-comment .item:nth-child(1) #averagerate").text().trim());
    const rateNumber = Number(siteContent.find("#countrate").text().trim());

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
        _id: i,
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

    return {
      url,

      // this site hosts only manhwa
      type: "manhwa",

      description,

      authors: [author],

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
        _id: i,
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
        _id: i,
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
