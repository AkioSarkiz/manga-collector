import { describe, expect, expectTypeOf, test } from "vitest";
import { MangaScraperFactory, MangaSource, ScrapedDetailedChapter, ScrapedListOfManga } from "../src/index.js";

describe("test fanfox", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.FANFOX);

  test("should load latest manga", async () => {
    const result = await scraper.getLatestUpdates();
    expect(result.data.length).greaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });

  test("search Solo Leveling manga", async () => {
    const result = await scraper.search("Solo Leveling");
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
    expect(result.data.length).greaterThanOrEqual(1);
  });

  test("get data chapter of Solo Leveling manga", async () => {
    const result = await scraper.getDetailedChapter("https://fanfox.net/manga/solo_leveling/c001/1.html");
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
  });
});
