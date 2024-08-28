import { describe, test, expect } from "vitest";
import { MangaSource, MangaScraperFactory } from "../../src/index.js";
import path from "node:path";

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  {
    link: "https://mangafire.to/manga/mushibamihime.qn0q5",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-mushibamihime.json"),
  },
];

const CHAPTER_DATA_TO_DETAILED_SCRAPE = [
  {
    link: "https://mangafire.to/read/mushibamihime.qn0q5/en/chapter-6",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-mushibamihime-6.json"),
  },
];

describe("should load latest manga", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);

  test("without any props", async () => {
    const result = await scraper.getLatestUpdates();

    expect(result.data.length).toBeGreaterThanOrEqual(1);
  });

  test("a second page", async () => {
    const result = await scraper.getLatestUpdates(2);

    expect(result.data.length).toBeGreaterThanOrEqual(1);
  });
});

test('should search "san"', async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
  const result = await scraper.search("san");

  expect(result.data.length).toBeGreaterThanOrEqual(1);
});

test.each(MANGA_DATA_TO_DETAILED_SCRAPE)(
  "should get detailed manga information of $link",
  async ({ link, expectedDataPath }) => {
    const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
    const result = await scraper.getDetailedManga(link);
    const expectedData = { ...(await import(expectedDataPath)) };

    expect(result.title).toEqual(expectedData.title);
    expect(result.description).toEqual(expectedData.description);
    expect(result.imageThumbnail).toEqual(expectedData.imageThumbnail);
    expect(result.status).toEqual(expectedData.status);
    expect(result.url).toEqual(expectedData.url);
    expect(result.type).toEqual(expectedData.type);
    expect(result.releaseYear).toEqual(expectedData.releaseYear);

    expect(new Set(result.alternativeTitles)).toEqual(new Set(expectedData.alternativeTitles));
    expect(new Set(result.authors)).toEqual(new Set(expectedData.authors));
    expect(new Set(result.genres)).toEqual(new Set(expectedData.genres));
  }
);

test.each(CHAPTER_DATA_TO_DETAILED_SCRAPE)(
  "should get detailed chapter information",
  async ({ link, expectedDataPath }) => {
    const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
    const result = await scraper.getDetailedChapter(link);
    const expectedData = { ...(await import(expectedDataPath)) };

    expect(result.title).toEqual(expectedData.title);
    expect(result.url).toEqual(expectedData.url);
    expect(new Set(result.frames)).toEqual(new Set(expectedData.frames));
  }
);
