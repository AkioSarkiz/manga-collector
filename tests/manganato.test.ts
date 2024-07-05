import { MangaScraperFactory } from "../src";
import { describe, test, expect, expectTypeOf, assert } from "vitest";
import { DashboardManga, ScrapedDetailedManga, ScrapedListOfManga, SearchManga } from "../src/types";
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
];

describe("should load latest manga", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

  test("without any props", async () => {
    const result = await scraper.getLatestMangaList();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<DashboardManga[]>();
  });

  test("a second page", async () => {
    const result = await scraper.getLatestMangaList(2);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<DashboardManga[]>();
  });
});

describe("should load newest manga", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

  test("without any props", async () => {
    const result = await scraper.getNewestMangaList();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<DashboardManga[]>();
  });

  test("a second page", async () => {
    const result = await scraper.getNewestMangaList(2);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<DashboardManga[]>();
  });
});

describe("should load hot manga", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

  test("without any props", async () => {
    const result = await scraper.geHotMangaList();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<DashboardManga[]>();
  });

  test("a second page", async () => {
    const result = await scraper.geHotMangaList(2);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<DashboardManga[]>();
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
