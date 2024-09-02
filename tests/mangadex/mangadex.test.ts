import { expect, test } from "vitest";
import { MangaSource } from "../../src/index.js";
import { MangaScraperFactory } from "../../src/factory.js";
import path from "path";

const MANGA_DATA_TO_SEARCH_SCRAPE = [{ query: "san" }, { query: "attack on titan" }, { query: "one piece" }];

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  {
    link: "https://mangadex.org/title/a253e13a-2b41-4f7d-915e-1e31a3f5d31d/i-m-the-max-level-newbie",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-i-m-the-max-level-newbie.json"),
  },
  {
    link: "https://mangadex.org/title/58bb34a5-452a-49a3-bd08-e167d654dbe4",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-3.json"),
  },
  {
    link: "https://mangadex.org/title/7bf163e3-123a-41c1-b2bc-8254dbe5a09b/2-5-dimensional-seduction",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-2-5-dimensional-seduction.json"),
  },
];

const MANGA_DATA_TO_DETAILED_CHAPTER_SCRAPE = [
  {
    link: "https://mangadex.org/chapter/0f7f932b-c426-46c6-9d36-2923ae3f7e13",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-0f7f932b-c426-46c6-9d36-2923ae3f7e13.json"),
  },
  {
    link: "https://mangadex.org/chapter/0f7f932b-c426-46c6-9d36-2923ae3f7e13/2",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-0f7f932b-c426-46c6-9d36-2923ae3f7e13-2.json"),
  },
  {
    link: "https://mangadex.org/chapter/735e6c58-a8a3-433f-a885-a7e1193f16f5",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-735e6c58-a8a3-433f-a885-a7e1193f16f5.json"),
  },
  {
    link: "https://mangadex.org/chapter/060c6c67-a705-4eb0-8a05-1ab4f9b67568",
    expectedDataPath: path.join(__dirname, "/data/detailed-chapter-060c6c67-a705-4eb0-8a05-1ab4f9b67568.json"),
  },
];

test.each(MANGA_DATA_TO_SEARCH_SCRAPE)("search $query", async ({ query }) => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGADEX);
  const result = await scraper.search(query);

  expect(result.data.length).greaterThanOrEqual(1);
});

test.each(MANGA_DATA_TO_DETAILED_SCRAPE)("get detailed manga of $link", async ({ link, expectedDataPath }) => {
  const expectedData = { ...(await import(expectedDataPath)) };
  const scraper = await MangaScraperFactory.make(MangaSource.MANGADEX);
  const result = await scraper.getDetailedManga(link);

  expect(result.title).toEqual(expectedData.title);
  expect(result.status).toEqual(expectedData.status);

  if (expectedData.description) {
    expect(result.description).toEqual(expectedData.description);
  }

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
});

test.each(MANGA_DATA_TO_DETAILED_CHAPTER_SCRAPE)("get detailed chapter of $link", async ({ link, expectedDataPath }) => {
  const expectedData = { ...(await import(expectedDataPath)) };
  const scraper = await MangaScraperFactory.make(MangaSource.MANGADEX);
  const result = await scraper.getDetailedChapter(link);

  expect(result.title).toEqual(expectedData.title);
  expect(result.url).toEqual(expectedData.url);
  expect(new Set(result.frames)).toEqual(new Set(expectedData.frames));
});
