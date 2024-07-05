import { describe, expect, expectTypeOf, test } from "vitest";
import { MangaSource } from "../src/constants.js";
import { MangaScraperFactory } from "../src/factory.js";
import { MangadexScraper } from "../src/mangadex/index.js";
import { ScrapedDetailedManga, ScrapedListOfManga } from "../src/index.js";

const MANGA_DATA_TO_SEARCH_SCRAPE = [{ query: "san" }, { query: "attack on titan" }, { query: "one piece" }];
const MANGA_DATA_TO_DETAILED_SCRAPE = [
  { link: "https://mangadex.org/title/a253e13a-2b41-4f7d-915e-1e31a3f5d31d/i-m-the-max-level-newbie" },
  { link: "https://mangadex.org/title/58bb34a5-452a-49a3-bd08-e167d654dbe4" },
  { link: "https://mangadex.org/title/7bf163e3-123a-41c1-b2bc-8254dbe5a09b/2-5-dimensional-seduction" },
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

// describe("test asuracomic", async () => {
// const scraper = (await MangaScraperFactory.make(MangaSource.MANGADEX)) as MangadexScraper;

// test("should load latest manga", async () => {
//   const result = await scraper.getListLatestUpdate();
//   expectTypeOf(result).toEqualTypeOf<ResponseListManga>();
// });

// test("get detail of Solo Max-Level Newbie manga", async () => {
//   const result = await scraper.getDetailManga(
//     "https://mangadex.org/title/a253e13a-2b41-4f7d-915e-1e31a3f5d31d/i-m-the-max-level-newbie"
//   );
//   expectTypeOf(result).toEqualTypeOf<ResponseDetailManga>();
// });

// test("get data chapter of Solo Max-Level Newbie manga", async () => {
//   const result = await scraper.getDataChapter("https://mangadex.org/chapter/30ffeb52-fc49-46e1-8c28-da6f0b289639");
//   expectTypeOf(result).toEqualTypeOf<ResponseChapter>();
//   expect(result.chapter_data.length).equal(16);
// });
// });
