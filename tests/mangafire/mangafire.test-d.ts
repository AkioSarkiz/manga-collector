import { describe, test, expect, expectTypeOf } from "vitest";
import {
  MangaSource,
  MangaScraperFactory,
  ScrapedDetailedManga,
  ScrapedListOfManga,
  ScrapedDetailedChapter,
} from "../../src/index.js";

describe("should load latest manga", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);

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

test('should search "san"', async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
  const result = await scraper.search("san");
  
  expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
});

test('should get detailed manga information',async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
  const result = await scraper.getDetailedManga("https://mangafire.to/manga/mushibamihime.qn0q5");

  expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();
});

test('should get detailed chapter information', async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
  const result = await scraper.getDetailedChapter("https://mangafire.to/read/mushibamihime.qn0q5/en/chapter-6");

  expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
});
