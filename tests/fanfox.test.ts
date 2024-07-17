import { describe, expect, expectTypeOf, test } from "vitest";
import {
  MangaScraperFactory,
  MangaSource,
  ScrapedDetailedChapter,
  ScrapedDetailedManga,
  ScrapedListOfManga,
} from "../src/index.js";

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  { link: "https://fanfox.net/manga/the_savior_s_bucket_list" },
  { link: "https://fanfox.net/manga/off_the_plate/" },
  { link: "https://fanfox.net/manga/the_office_of_doctor_evercross/" },
  { link: "https://fanfox.net/manga/jujutsu_kaisen/" },
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

  test("get data chapter of Solo Leveling manga", async () => {
    const result = await scraper.getDetailedChapter("https://fanfox.net/manga/solo_leveling/c001/1.html");
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
  });

  describe.each(MANGA_DATA_TO_DETAILED_SCRAPE)("get detailed manga of $link", async ({ link }) => {
    test(async () => {
      const result = await scraper.getDetailedManga(link);
      expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();
    });
  });
});
