import { describe, expect, expectTypeOf, test } from "vitest";
import {
  MangaScraperFactory,
  MangaSource,
  ScrapedDetailedChapter,
  ScrapedDetailedManga,
  ScrapedListOfManga,
} from "../../src/index.js";

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  { link: "https://fanfox.net/manga/the_savior_s_bucket_list" },
  { link: "https://fanfox.net/manga/off_the_plate/" },
  { link: "https://fanfox.net/manga/the_office_of_doctor_evercross/" },
  { link: "https://fanfox.net/manga/jujutsu_kaisen/" },
];

const MANGA_DATA_TO_DETAILED_CHAPTER_SCRAPE = [
  {
    link: "https://fanfox.net/manga/wo_he_wo_de_ai_ni_ya/v01/c001/1.html",
    expected: "./data/chapter_wo_he_wo_de_ai_ni_ya.json",
  },
];

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

  describe.each(MANGA_DATA_TO_DETAILED_CHAPTER_SCRAPE)("get detailed chapter of $link", async ({ link, expected }) => {
    test('', async () => {
      const expectedData = await import(expected);
      console.log({ expectedData });
      const result = await scraper.getDetailedChapter(link);
      console.log({ result });
      expect(result).be(expectedData);
      expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
    });
  });

  describe.each(MANGA_DATA_TO_DETAILED_SCRAPE)("get detailed manga of $link", async ({ link }) => {
    test('', async () => {
      const result = await scraper.getDetailedManga(link);
      expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();
    });
  });
});
