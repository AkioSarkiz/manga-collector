import { describe, expect, expectTypeOf, test } from "vitest";
import { MangaSource } from "../src/constants.js";
import { MangaScraperFactory } from "../src/factory.js";
import { ResponseChapter, ResponseDetailManga, ResponseListManga } from "../src/asuracomic/types/type.js";
import { ToonilyScraper } from "../src/toonily/index.js";

describe("test asuracomic", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.TOONILY)) as ToonilyScraper;

  test("should load latest manga", async () => {
    const result = await scraper.getListLatestUpdate();
    expectTypeOf(result).toEqualTypeOf<ResponseListManga>();
  });

  test("search Solo Max-Level Newbie manga", async () => {
    const result = await scraper.search("Solo Max-Level Newbie");
    expectTypeOf(result).toEqualTypeOf<ResponseListManga>();
    expect(result.data.length).greaterThanOrEqual(1);
  });

  test("get detail of Solo Max-Level Newbie manga", async () => {
    const result = await scraper.getDetailManga("https://toonily.com/webtoon/solo-leveling-005/");
    expectTypeOf(result).toEqualTypeOf<ResponseDetailManga>();
  });

  test("get data chapter of Solo Max-Level Newbie manga", async () => {
    const result = await scraper.getDataChapter("https://toonily.com/webtoon/solo-leveling-005/chapter-0/");
    expectTypeOf(result).toEqualTypeOf<ResponseChapter>();
    expect(result.chapter_data.length).equal(16);
  });
});
