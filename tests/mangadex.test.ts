import { describe, expect, expectTypeOf, test } from "vitest";
import { MangaSource } from "../src/constants.js";
import { MangaScraperFactory } from "../src/factory.js";
import { ResponseChapter, ResponseDetailManga, ResponseListManga } from "../src/asuracomic/types/type.js";
import { MangadexScraper } from "../src/mangadex/index.js";

describe("test asuracomic", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGADEX)) as MangadexScraper;

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
    const result = await scraper.getDetailManga(
      "https://mangadex.org/title/a253e13a-2b41-4f7d-915e-1e31a3f5d31d/i-m-the-max-level-newbie"
    );
    expectTypeOf(result).toEqualTypeOf<ResponseDetailManga>();
  });

  test("get data chapter of Solo Max-Level Newbie manga", async () => {
    const result = await scraper.getDataChapter("https://mangadex.org/chapter/30ffeb52-fc49-46e1-8c28-da6f0b289639");
    expectTypeOf(result).toEqualTypeOf<ResponseChapter>();
    expect(result.chapter_data.length).equal(16);
  });
});
