import axios from "axios";
import * as cheerio from "cheerio";
import {
  AbstractMangaFactory,
  chapter,
  genre,
  image_chapter,
  ResponseChapter,
  ResponseDetailManga,
  ResponseListManga,
} from "./types/type";
import { useGetDataItemsManga } from "./hooks/getListLatest";
import { Browser } from "puppeteer";
import { ScrapedChapter, ScrapedDetailedManga, ScrapedGenre, ScrapedMangaStatus, Scraper } from "../types/index.js";

export class ToonilyScraper implements Scraper {
  private readonly baseUrl: string = "https://toonily.com/";

  private convertToNumber(numberString: string): number {
    const suffixes: { [key: string]: number } = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
      T: 1000000000000,
    };

    const suffix = numberString.slice(-1).toUpperCase();
    const number = parseFloat(numberString.slice(0, -1));

    if (suffixes[suffix] !== undefined) {
      return number * suffixes[suffix];
    } else {
      return parseFloat(numberString);
    }
  }

  async getListLatestUpdate(page?: number | undefined): Promise<ResponseListManga> {
    const axios_get = await axios.get(`${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`);
    const $ = cheerio.load(axios_get.data);

    const paramsSelector = {
      cheerioApi: $,
      wrapSelector: "#loop-content > div > div > div",
      titleSelector: "div.item-summary > div.post-title.font-title > h3 > a",
      thumbnailSelector: "div.item-thumb.c-image-hover > a > img",
      thumbnailAttr: "data-src",
      hrefSelector: "div.item-summary > div.post-title.font-title > h3 > a",
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const last_page = $("div.wp-pagenavi").find("a.last").attr("href")!;

    const totalPage = Number(
      last_page !== undefined
        ? last_page
            .substring(0, last_page.length - 1)
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
    const author = siteContent.find("div.summary-content > div.author-content > a").text();
    const title = siteContent.find("div.post-content > div.post-title > h1").text().trim();
    const status = this.formatStatus($(".post-status .post-content_item:nth-child(2) .summary-content").text().trim());
    const description = $(".summary__content").text().trim();
    const views: number = this.convertToNumber($(".manga-rate-view-comment .item:nth-child(2)").text().trim());
    const rate = Number($(".manga-rate-view-comment .item:nth-child(1) #averagerate").text());
    const rateNumber = Number(siteContent.find("#countrate").text());

    let followsUsers = undefined;
    let followsUsersUnformatted = $(".add-bookmark .action_detail").text();

    if (followsUsersUnformatted) {
      followsUsers = followsUsersUnformatted.match(/\d+/g)?.map(Number)[0];
    }

    siteContent.find("ul.main.version-chap.no-volumn > li.wp-manga-chapter").each((i, e) => {
      chapters.push({
        url: $(e).find("a").attr("href")!,
        parent_href: url,
        title: $(e).find("a").text().trim(),
      });
    });

    $("div.genres-content > a").each((_i, e) => {
      genres.push({
        url: $(e).attr("href")!,
        name: $(e).text(),
      });
    });

    return {
      url,

      // this site hosts only manhwa
      type: "manhwa",

      description,

      author: {
        name: author,
      },

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

  async getDataChapter(
    url_chapter: string,
    url?: string | undefined,
    path?: string | undefined,
    prev_chapter?: chapter | undefined,
    next_chapter?: chapter | undefined
  ): Promise<ResponseChapter> {
    const $ = cheerio.load((await axios.get(url_chapter)).data);

    const site_content = $("div.main-col-inner");
    const title = site_content.find("ol.breadcrumb > li:nth-child(3)").text().trim();

    const chapter_data: image_chapter[] = [] as image_chapter[];
    site_content.find("div.entry-content div.reading-content > div.page-break > img").each((i, e) => {
      chapter_data.push({
        _id: i,
        src_origin: $(e).attr("data-src")!.trim(),
        alt: $(e).attr("alt")!,
      });
    });

    const parent_href = site_content.find("ol.breadcrumb > li:nth-child(3) > a").attr("href")!;

    const next_chapter_data: chapter | null = site_content.find("div.nav-links > div.nav-next > a").length
      ? {
          url: site_content.find("div.nav-links > div.nav-next > a").attr("href")!,
          path: site_content.find("div.nav-links > div.nav-next > a").attr("href")!.substring(this.baseUrl.length),
          parent_href: parent_href,
          title,
        }
      : null;

    const prev_chapter_data: chapter | null = site_content.find("div.nav-links > div.nav-previous > a").length
      ? {
          url: site_content.find("div.nav-links > div.nav-previous > a").attr("href")!,
          path: site_content.find("div.nav-links > div.nav-previous > a").attr("href")!.substring(this.baseUrl.length),
          parent_href: parent_href,
          title,
        }
      : null;

    return {
      url: url_chapter,
      path: url_chapter.substring(this.baseUrl.length),
      title,
      chapter_data,
      prev_chapter: prev_chapter !== undefined ? null : prev_chapter_data,
      next_chapter: next_chapter !== undefined ? null : next_chapter_data,
    };
  }

  async search(keyword: string, page?: number | undefined): Promise<ResponseListManga> {
    keyword = keyword.replace(/\s/g, "-");
    const axios_get = await axios.get(
      `${this.baseUrl}/search/${keyword}${page !== undefined && page > 1 ? `/page/${page}` : ``}`
    );
    const $ = cheerio.load(axios_get.data);
    const wrap_items = $("div.page-listing-item > div.row.row-eq-height > div > div");

    const data: {
      _id: number;
      title: string;
      image_thumbnail: string;
      href: string;
    }[] = [];
    wrap_items.each((i, e) => {
      data.push({
        _id: i,
        title: $(e).find("div.item-summary > div.post-title.font-title > h3 > a").text(),
        image_thumbnail: $(e).find("div.item-thumb.c-image-hover > a > img").attr("data-src")!,
        href: $(e).find("div.item-summary > div.post-title.font-title > h3 > a").attr("href")!,
      });
    });

    const last_page = $("div.wp-pagenavi").find("a.last").attr("href")!;

    const totalPage = Number(
      last_page !== undefined
        ? last_page
            .substring(0, last_page.length - 1)
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

  public async init() {
    // there is nothing we need to do
  }

  public async shutdown() {
    // there is nothing we need to do
  }
}
