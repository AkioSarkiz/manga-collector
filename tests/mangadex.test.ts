import { describe, expect, expectTypeOf, test } from "vitest";
import { MangaSource } from "../src/index.js";
import { MangaScraperFactory } from "../src/factory.js";
import { MangadexScraper } from "../src/mangadex/index.js";
import { ScrapedDetailedChapter, ScrapedDetailedManga, ScrapedListOfManga } from "../src/index.js";

const MANGA_DATA_TO_SEARCH_SCRAPE = [{ query: "san" }, { query: "attack on titan" }, { query: "one piece" }];
const MANGA_DATA_TO_DETAILED_SCRAPE = [
  { link: "https://mangadex.org/title/a253e13a-2b41-4f7d-915e-1e31a3f5d31d/i-m-the-max-level-newbie" },
  { link: "https://mangadex.org/title/58bb34a5-452a-49a3-bd08-e167d654dbe4" },
  { link: "https://mangadex.org/title/7bf163e3-123a-41c1-b2bc-8254dbe5a09b/2-5-dimensional-seduction" },
];

const MANGA_DATA_TO_DETAILED_CHAPTER_SCRAPE = [
  { link: "https://mangadex.org/chapter/0f7f932b-c426-46c6-9d36-2923ae3f7e13" },
  { link: "https://mangadex.org/chapter/0f7f932b-c426-46c6-9d36-2923ae3f7e13/2" },
  { link: "https://mangadex.org/chapter/735e6c58-a8a3-433f-a885-a7e1193f16f5" },
  { link: "https://mangadex.org/chapter/060c6c67-a705-4eb0-8a05-1ab4f9b67568" },
];

describe.each(MANGA_DATA_TO_SEARCH_SCRAPE)("search $query", async ({ query }) => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGADEX)) as MangadexScraper;

  test("search", async () => {
    const result = await scraper.search(query);
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
    expect(result.data.length).greaterThanOrEqual(1);
  });
});

describe.each(MANGA_DATA_TO_DETAILED_SCRAPE)("scrape of $url", async ({ link }) => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGADEX)) as MangadexScraper;

  test("detailed manga scrape", async () => {
    const result = await scraper.getDetailedManga(link);
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();
  });
});

describe.each(MANGA_DATA_TO_DETAILED_CHAPTER_SCRAPE)("scrape of $url", async ({ link }) => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGADEX)) as MangadexScraper;

  test("detailed chapter scrape", async () => {
    const result = await scraper.getDetailedChapter(link);
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
  });
});
