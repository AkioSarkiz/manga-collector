import { describe, expect, expectTypeOf, test } from "vitest";
import { MangaSource } from "../src/index.js";
import { MangaScraperFactory } from "../src/factory.js";
import { ToonilyScraper } from "../src/toonily/index.js";
import { ScrapedDetailedChapter, ScrapedDetailedManga, ScrapedListOfManga } from "../src/index.js";

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  {
    url: "https://toonily.com/webtoon/mookhyang-the-origin/",
    expected: {
      type: "manhwa",

      authors: [
        {
          name: "Jeon Dong-Jo",
          url: "https://toonily.com/authors/jeon-dong-jo/",
        },
      ],
      genres: [
        {
          url: "https://toonily.com/webtoon-genre/action/",
          name: "Action",
        },
        {
          url: "https://toonily.com/webtoon-genre/shounen/",
          name: "Shounen",
        },
      ],
      title: "Mookhyang The Origin",
      status: "completed",
    },
  },
  {
    url: "https://toonily.com/webtoon/reverse-villain/",
  },
  {
    url: "https://toonily.com/webtoon/solo-leveling-005/",
  },
  {
    url: "https://toonily.com/webtoon/her-summon-001/",
  },
  {
    url: "https://toonily.com/webtoon/not-a-lady-anymore/",
  },
  {
    url: "https://toonily.com/webtoon/love-rebooted/",
  },
];

describe("test toonily", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.TOONILY)) as ToonilyScraper;

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
    const result = await scraper.getDetailedChapter("https://toonily.com/webtoon/solo-leveling-005/chapter-0/");
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedChapter>();
    expect(result.frames.length).equal(18);
  });
});

describe.each(MANGA_DATA_TO_DETAILED_SCRAPE)("scrape $url", async ({ url, expected }) => {
  const scraper = (await MangaScraperFactory.make(MangaSource.TOONILY)) as ToonilyScraper;

  test("scrape", async () => {
    const result = await scraper.getDetailedManga(url);
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();

    if (expected) {
      expect(result.genres).toEqual(expected.genres);
      expect(result.title).toEqual(expected.title);
      expect(result.type).toEqual(expected.type);
      expect(result.authors).toEqual(expected.authors);
      expect(result.status).toEqual(expected.status);
    }
  });
});
