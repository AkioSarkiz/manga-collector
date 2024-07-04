import puppeteer, { Browser } from "puppeteer";
import { chapter, genre, ResponseChapter, ResponseDetailManga, ResponseListManga } from "./types/type";
import { not_null } from "./utils/validate";
import { useGetDataItemsManga } from "./hooks/getListLatest.js";
import { useGetDataChapter } from "./hooks/getDataChapter.js";

function extractBeforeTag(str: string) {
  // Regular expression to match any HTML tag
  let regex = /<[^>]*>/;

  // Find the first tag in the string
  let match = str.match(regex);

  if (match) {
    // Get the index of the start of the first tag
    let tagIndex = match.index;

    // Extract the substring before the first tag
    return str.substring(0, tagIndex).trim();
  } else {
    // If no tag is found, return the original string
    return str.trim();
  }
}

export class AsuraComicScraper {
  private readonly baseUrl: string = "https://asuracomic.net/";
  private browser: Promise<Browser>;

  public constructor() {
    this.browser = puppeteer.launch({
      headless: true,
    });
  }

  public async search(query: string, page = 1): Promise<ResponseListManga> {
    const _page = await (await this.browser).newPage();
    _page.setDefaultNavigationTimeout(0);
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(`${this.baseUrl}${page > 1 ? `/page/${page}` : ``}/?s=${query}`);

    const paramsSelector = {
      puppeteer: _page,
      wrapSelector: "div.listupd > div.bs > div.bsx",
      titleSelector: "a > div.bigor > div.tt",
      thumbnailSelector: "a > div.limit > img",
      thumbnailAttr: "src",
      hrefSelector: "a",
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const canNext = await _page.$eval("div.pagination > a.next.page-numbers", () => true).catch(() => false);

    const canPrev = await _page.$eval("div.pagination > a.prev.page-numbers", () => true).catch(() => false);

    const totalPages = await _page.$$("div.pagination > a.page-numbers:not(.prev):not(.next)");

    const totalPage =
      (totalPages !== undefined
        ? Number(await totalPages[totalPages.length - 1]?.evaluate((el) => el.textContent!))
        : 0) || 0;

    return {
      totalData: data.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext,
      canPrev,
      data,
    };
  }

  public async getDataChapter(
    url_chapter: string,
    url?: string,
    path?: string,
    prev_chapter?: chapter,
    next_chapter?: chapter
  ): Promise<ResponseChapter> {
    const _page = await (await this.browser).newPage();
    _page.setDefaultNavigationTimeout(0);
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(url_chapter);

    const paramsSelector = {
      puppeteer: _page,
      mainContentSelector: "div.chapterbody > div.postarea > article",
      titleSelector: "div.headpost > h1",
      imageSelectorAll: "div#readerarea > p > img",
      originImageAttr: "src",
      prevChapterSelector: ".navlef > .npv.r > div.nextprev > a.ch-prev-btn",
      nextChapterSelector: ".navlef > .npv.r > div.nextprev > a.ch-next-btn",
      baseUrl: this.baseUrl,
      url: url_chapter,
    };

    const data = await useGetDataChapter(paramsSelector);

    const scripts = await _page.$$("script");
    // TODO: remove magic 25
    const script = await scripts[25].evaluate((e) => {
      return JSON.parse(e.textContent!.split("ts_reader.run(")[1].split(");")[0]);
    });

    return {
      ...(url !== undefined ? { url } : {}),
      ...(path !== undefined ? { path } : {}),
      ...data,
      next_chapter:
        script.nextUrl !== ""
          ? {
              url: script.nextUrl,
              parent_href: url !== undefined ? url : "",
              path: script.nextUrl.substring(`${this.baseUrl}`.length),
            }
          : null,
      prev_chapter:
        script.prevUrl !== ""
          ? {
              url: script.prevUrl,
              parent_href: url !== undefined ? url : "",
              path: script.prevUrl.substring(`${this.baseUrl}`.length),
            }
          : null,
    };
  }

  public async getDetailManga(url: string): Promise<ResponseDetailManga> {
    const _page = await (await this.browser).newPage();
    _page.setDefaultNavigationTimeout(0);
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(url);
    const content = await _page.$("body");
    const title = extractBeforeTag(await content!.$eval(".post-title > h1:nth-child(1)", (el) => el.innerHTML));
    const path = url.substring(`${this.baseUrl}`.length);
    const author = (await content!.$eval(".author-content", (el) => el.textContent))?.trim();

    const status = await content!.$eval(".post-status > div:nth-child(2) > div:nth-child(2)", (el) => el.textContent);

    const genres: genre[] = await Promise.all(
      (
        await content!.$$(".genres-content > a")
      ).map(async (e) => {
        const data = await e.evaluate((el) => {
          return {
            url: el.getAttribute("href"),
            path: el.getAttribute("href"),
            name: el.textContent,
          };
        });
        return {
          url: not_null(data.url),
          path: not_null(data.path).substring(`${this.baseUrl}`.length),
          name: not_null(data.name),
        };
      })
    );

    const chapters: chapter[] = await Promise.all(
      (
        await content!.$$(".listing-chapters_wrap > ul > li")
      ).map(async (e) => {
        const chapter_anchor = await e.$eval("a", (el) => {
          const data = {
            title: el.children[0].textContent,
            url: el.getAttribute("href"),
          };
          return {
            title: data.title,
            url: data.url,
          };
        });

        const last_update = await e.$eval("a > span.chapterdate", (el) => el.textContent);

        return {
          title: not_null(chapter_anchor.title),
          url: not_null(chapter_anchor.url),
          path: not_null(chapter_anchor.url).substring(`${this.baseUrl}`.length),
          parent_href: url,
          last_update: not_null(last_update),
        };
      })
    );

    const rate = not_null(await content!.$eval("#averagerate", (el) => el.textContent));

    const follows = not_null(await content!.$eval(".add-bookmark > div:nth-child(2)", (el) => el.textContent));

    return {
      title: not_null(title),
      path,
      author: not_null(author).replace(/\n/g, ""),
      url,
      status: not_null(status),
      genres,
      rate,
      follows: follows.replace(/\D/g, ""),
      chapters,
    };
  }

  public async getListLatestUpdate(page = 1): Promise<ResponseListManga> {
    const _page = await (await this.browser).newPage();
    _page.setDefaultNavigationTimeout(0);
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(`${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`);
    const paramsSelector = {
      puppeteer: _page,
      wrapSelector: "div.listupd > div.utao.styletwo",
      titleSelector: "div.uta > div.luf > a > h4",
      thumbnailSelector: "div.uta > div.imgu > a > img",
      thumbnailAttr: "src",
      hrefSelector: "div.uta > div.luf > a",
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const canNext = await _page.$eval("div.hpage > a.r", () => true).catch(() => false);

    const canPrev = await _page.$eval("div.hpage > a.l", () => true).catch(() => false);

    return {
      data,
      totalData: data.length,
      currentPage: page,
      canNext,
      canPrev,
    };
  }

  public async init() {
    // there are notion we need to do
    // todo: move here promise of browser
  }

  public async shutdown() {
    await (await this.browser).close();
  }
}
