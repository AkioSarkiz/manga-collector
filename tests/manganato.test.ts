import { MangaScraperFactory } from "../src/index.js";
import { describe, test, expect, expectTypeOf, assert } from "vitest";
import { ScrapedDetailedManga, ScrapedListOfManga } from "../src/types/index.js";
import { MangaSource } from "../src/index.js";
import { ManganatoScraper } from "../src/manganato/index.js";

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  { link: "https://manganato.com/manga-pn992596" },
  { link: "https://chapmanganato.to/manga-dr980474" },
  { link: "https://chapmanganato.to/manga-bf979214" },
  { link: "https://chapmanganato.to/manga-fy982633" },
  { link: "https://manganato.com/manga-kh987642" },
  { link: "https://manganato.com/manga-js987275" },
  { link: "https://chapmanganato.to/manga-dg980989" },
  { link: "https://chapmanganato.to/manga-zq1002451" },
];

describe("should load latest manga", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

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

describe("should load newest manga", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

  test("without any props", async () => {
    const result = await scraper.getNewestMangaList();
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });

  test("a second page", async () => {
    const result = await scraper.getNewestMangaList(2);
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });
});

describe("should load hot manga", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

  test("without any props", async () => {
    const result = await scraper.geHotMangaList();
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });

  test("a second page", async () => {
    const result = await scraper.geHotMangaList(2);
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
  });
});

describe("should find manga", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

  test("try to find attack on titan", async () => {
    const result = await scraper.search("attack on titan");
    expectTypeOf(result).toEqualTypeOf<ScrapedListOfManga>();
    expect(result.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe.each(MANGA_DATA_TO_DETAILED_SCRAPE)("scrape of $url", async ({ link }) => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

  test("detailed manga scrape", async () => {
    const result = await scraper.getDetailedManga(link);

    if (!result) {
      assert.fail("parse failed");
    }

    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();
  });
});
