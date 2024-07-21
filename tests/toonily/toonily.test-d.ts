import { describe, expectTypeOf, test } from "vitest";
import { MangaSource } from "../../src/index.js";
import { MangaScraperFactory } from "../../src/factory.js";
import { ScrapedDetailedChapter, ScrapedDetailedManga, ScrapedListOfManga } from "../../src/index.js";

describe("check toonily types", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.TOONILY);

  test("check load latests", async () => {
    const result = await scraper.getLatestUpdates();
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });

  test("check search", async () => {
    const result = await scraper.search("Solo Leveling");
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });

  test("check detailed chapter", async () => {
    const result = await scraper.getDetailedChapter("https://toonily.com/webtoon/solo-leveling-005/chapter-0/");
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
  });

  test("check detailed manga", async () => {
    const result = await scraper.getDetailedManga("https://toonily.com/webtoon/mookhyang-the-origin");
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();
  });
});
