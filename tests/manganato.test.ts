import { MangaScraperFactory } from "../src";
import { describe, test, expect, expectTypeOf, assert } from "vitest";
import { DashboardManga, DetailedManga, SearchManga } from "../src/types";
import { MangaSource } from "../src/constants.js";
import { ManganatoScraper } from "../src/manganato/index.js";

const mangasUrls = [
  { label: "isekai walking", link: "https://manganato.com/manga-qi993717" },
  { label: "Class no Daikirai na Joshi to Kekkon suru Koto ni Natta", link: "https://manganato.com/manga-pn992596" },
  { label: "Solo Leveling", link: "https://chapmanganato.to/manga-dr980474" },
  { label: "Versatile Mage", link: "https://chapmanganato.to/manga-bf979214" },
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
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expectTypeOf(result).toEqualTypeOf<SearchManga[]>();
  });
});

describe.each(mangasUrls)("details of $label", async ({ label, link }) => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;

  test("response", async () => {
    const result = await scraper.getMangaDetails(link);

    if (!result) {
      assert.fail("parse failed");
    }

    expectTypeOf(result).toEqualTypeOf<DetailedManga>();
  });
});
