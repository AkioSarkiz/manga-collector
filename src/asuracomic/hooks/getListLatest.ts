// Experimental scraper
// @ts-nocheck
import { CheerioAPI } from "cheerio";
import { not_null } from "../utils/validate.js";
import { Page } from "puppeteer";
import { ScrapedListOfMangaItem } from "../../types/scraper.js";

interface MangaDataParams {
  cheerioApi?: CheerioAPI;
  puppeteer?: Page;
  wrapSelector: string;
  titleSelector: string;
  thumbnailSelector: string;
  thumbnailAttr: string;
  hrefSelector: string;
}

export const useGetDataItemsManga = async (params: MangaDataParams): Promise<ScrapedListOfMangaItem[]> => {
  const { cheerioApi, puppeteer, wrapSelector, titleSelector, thumbnailSelector, thumbnailAttr, hrefSelector } = params;

  let data: ScrapedListOfMangaItem[] = [];

  if (cheerioApi !== undefined) {
    const wrapItems = cheerioApi(wrapSelector);
    wrapItems.each((_, e) => {
      data.push({
        title: cheerioApi(e).find(titleSelector).text(),
        imageThumbnail: not_null(cheerioApi(e).find(thumbnailSelector).attr(thumbnailAttr)),
        url: not_null(cheerioApi(e).find(hrefSelector).attr("href")),
      });
    });
  } else {
    const wrapItems = await puppeteer!.$$(wrapSelector);

    data = await Promise.all(
      wrapItems.map(async (e) => {
        const imageThumbnail: string = await (await e.$(thumbnailSelector))!.evaluate((el, thumbnailAttr) => {
          return el.getAttribute(thumbnailAttr)!;
        }, thumbnailAttr);

        const { href } = await e.$eval(hrefSelector, (el) => ({ href: el.getAttribute("href") }));
        const { title } = await e.$eval(titleSelector, (el) => ({ title: el.textContent }));

        return {
          title: not_null(title).trim().replace(/\n/, ""),
          url: not_null(href),
          imageThumbnail: imageThumbnail.startsWith("//") ? `https:${imageThumbnail}` : imageThumbnail,
        };
      })
    );
  }

  return data;
};
