import path from "node:path";
import { assert, describe, expect, test } from "vitest";
import { MangaScraperFactory, MangaSource } from "../../src/index";

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  {
    link: "https://manganato.com/manga-pn992596",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-pn992596.json"),
  },
  {
    link: "https://chapmanganato.to/manga-dr980474",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-dr980474.json"),
  },
  {
    link: "https://chapmanganato.to/manga-bf979214",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-bf979214.json"),
  },
  {
    link: "https://chapmanganato.to/manga-fy982633",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-fy982633.json"),
  },
  {
    link: "https://manganato.com/manga-kh987642",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-kh987642.json"),
  },
  {
    link: "https://manganato.com/manga-js987275",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-js987275.json"),
  },
  {
    link: "https://chapmanganato.to/manga-dg980989",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-dg980989.json"),
  },
  {
    link: "https://chapmanganato.to/manga-zq1002451",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-zq1002451.json"),
  },
  {
    link: "https://manganato.com/manga-vz956108",

    // The chapters were removed from the expected data file because manganto is a little bit dump 😅
    // He creates a new chapters for that one manga even that manga was completed a long time ago.
    // I don't want to have to update the expected data files for every new fake chapter will be released.
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-vz956108.json"),
  },
  {
    link: "https://chapmanganato.to/manga-rt969028",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-rt969028.json"),
  },
  {
    link: "https://manganato.com/manga-yl958968",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-yl958968.json"),
  },
];

const MANGA_SEARCH_QUERIES = ["attack on titan", "one piece", "san"];

const MANGA_DATA_CHAPTERS = [
  {
    link: "https://chapmanganato.to/manga-vz956108/chapter-1",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-vz956108-chapter-1.json"),
  },
  {
    link: "https://chapmanganato.to/manga-vz956108/chapter-8",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-vz956108-chapter-8.json"),
  },
  {
    link: "https://chapmanganato.to/manga-ec954411/chapter-1",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-ec954411-chapter-1.json"),
  },
  {
    link: "https://chapmanganato.to/manga-gb984258/chapter-1",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-gb984258-chapter-1.json"),
  },
  {
    link: "https://chapmanganato.to/manga-zp977298/chapter-1",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-zp977298-chapter-1.json"),
  },
];

describe("should load latest manga", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);

  test("without any props", async () => {
    const result = await scraper.getLatestUpdates();
    expect(result.data.length).toBeGreaterThanOrEqual(1);
  });

  test("a second page", async () => {
    const result = await scraper.getLatestUpdates(2);
    expect(result.data.length).toBeGreaterThanOrEqual(1);
  });
});

test.each(MANGA_SEARCH_QUERIES)("search %s", async (query) => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.search(query);

  expect(result.data.length).toBeGreaterThanOrEqual(1);
});

test.each(MANGA_DATA_TO_DETAILED_SCRAPE)("scrape of $link", async ({ link, expectedDataPath }) => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.getDetailedManga(link);

  if (!result) {
    assert.fail("parse failed");
  }

  if (expectedDataPath) {
    const expectedData = { ...(await import(expectedDataPath)) };

    expect(result.url).toEqual(expectedData.url);
    expect(result.title).toEqual(expectedData.title);
    expect(result.status).toEqual(expectedData.status);
    expect(result.description).toEqual(expectedData.description);
    expect(new Set(result.alternativeTitles)).toEqual(new Set(expectedData.alternativeTitles));
    expect(result.imageThumbnail).toEqual(expectedData.imageThumbnail);
    expect(new Set(result.genres)).toEqual(new Set(expectedData.genres));

    if (expectedData.authors) {
      expect(new Set(result.authors)).toEqual(new Set(expectedData.authors));
    }

    if (expectedData.chapters) {
      expectedData.chapters = expectedData.chapters.map((chapter: any) => {
        return {
          ...chapter,
          // views & lastUpdate are dynamic properties so we should not compare them
          // because it will fail in CI from time to time and make fake status of the scaping
          views: undefined,
          lastUpdate: undefined,
        };
      });

      const formattedChapters = result.chapters.map((chapter: any) => {
        return {
          ...chapter,
          // views & lastUpdate are dynamic properties so we should not compare them
          // because it will fail in CI from time to time and make fake status of the scaping
          views: undefined,
          lastUpdate: undefined,
        };
      });

      expect(new Set(formattedChapters)).toEqual(new Set(expectedData.chapters));
    }

    if (expectedData.artists) {
      expect(new Set(result.artists)).toEqual(new Set(expectedData.artists));
    }
  }
});

test.each(MANGA_DATA_CHAPTERS)("get detailed chapter of $link", async ({ link, expectedDataPath }) => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.getDetailedChapter(link);
  const expectedData = await import(expectedDataPath);

  if (!result) {
    assert.fail("parse failed");
  }

  expect(result.title).toEqual(expectedData.title);
  expect(result.url).toEqual(expectedData.url);
  expect(new Set(result.frames)).toEqual(new Set(expectedData.frames));
});
