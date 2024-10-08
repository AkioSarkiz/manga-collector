import { describe, expect, expectTypeOf, test } from "vitest";
import {
  MangaScraperFactory,
  MangaSource,
  ScrapedDetailedChapter,
  ScrapedDetailedManga,
  ScrapedListOfManga,
} from "../../src/index";

describe("should load latest manga", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);

  test("without any props", async () => {
    const result = await scraper.getLatestUpdates();
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });

  test("a second page", async () => {
    const result = await scraper.getLatestUpdates(2);
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });
});

test(async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.search("san");
  expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
});

test(async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.getDetailedManga("https://manganato.com/manga-pn992596");

  expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();
});

test(async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.getDetailedChapter("https://chapmanganato.to/manga-vz956108/chapter-1");

  expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
});
