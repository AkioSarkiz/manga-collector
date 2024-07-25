import { expectTypeOf, test } from "vitest";
import { MangaSource } from "../../src/index.js";
import { MangaScraperFactory } from "../../src/factory.js";
import { ScrapedDetailedChapter, ScrapedDetailedManga, ScrapedListOfManga } from "../../src/index.js";

test("search", async () => {
  const query = "test";
  const scraper = await MangaScraperFactory.make(MangaSource.MANGADEX);
  const result = await scraper.search(query);

  expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
});

test("detailed manga scrape", async () => {
  const link = "https://mangadex.org/title/a253e13a-2b41-4f7d-915e-1e31a3f5d31d/i-m-the-max-level-newbie";
  const scraper = await MangaScraperFactory.make(MangaSource.MANGADEX);
  const result = await scraper.getDetailedManga(link);

  expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();
});

test("detailed chapter scrape", async () => {
  const link = "https://mangadex.org/chapter/0f7f932b-c426-46c6-9d36-2923ae3f7e13";
  const scraper = await MangaScraperFactory.make(MangaSource.MANGADEX);
  const result = await scraper.getDetailedChapter(link);

  expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
});
