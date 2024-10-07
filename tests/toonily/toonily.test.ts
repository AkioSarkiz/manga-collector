import path from "node:path";
import { expect, test } from "vitest";
import { MangaScraperFactory, MangaSource } from "../../src/index";

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  {
    url: "https://toonily.com/webtoon/mookhyang-the-origin/",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-mookhyang-the-origin.json"),
  },
  {
    url: "https://toonily.com/webtoon/reverse-villain/",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-reverse-villain.json"),
  },
  {
    url: "https://toonily.com/webtoon/solo-leveling-005/",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-solo-leveling-005.json"),
  },
  {
    url: "https://toonily.com/webtoon/her-summon-001/",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-her-summon-001.json"),
  },
  {
    url: "https://toonily.com/webtoon/not-a-lady-anymore/",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-not-a-lady-anymore.json"),
  },
  {
    url: "https://toonily.com/webtoon/love-rebooted/",
    expectedDataPath: path.join(__dirname, "/data/detailed-manga-love-rebooted.json"),
  },
];

test("should load latest manga", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.TOONILY);
  const result = await scraper.getLatestUpdates();
  expect(result.data.length).greaterThanOrEqual(1);
});

test("search Solo Leveling manga", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.TOONILY);
  const result = await scraper.search("Solo Leveling");
  expect(result.data.length).greaterThanOrEqual(1);
});

test("get data chapter of Solo Leveling manga", async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.TOONILY);
  const result = await scraper.getDetailedChapter("https://toonily.com/webtoon/solo-leveling-005/chapter-0/");
  expect(result.frames.length).equal(18);
});

test.each(MANGA_DATA_TO_DETAILED_SCRAPE)("detailed manga scrape of $url", async ({ url, expectedDataPath }) => {
  const scraper = await MangaScraperFactory.make(MangaSource.TOONILY);
  const result = await scraper.getDetailedManga(url);
  const expectedData = await import(expectedDataPath);

  expect(result.title).toEqual(expectedData.title);
  expect(result.description).toEqual(expectedData.description);
  expect(result.imageThumbnail).toEqual(expectedData.imageThumbnail);
  expect(result.alternativeTitles).toEqual(expectedData.alternativeTitles);
  expect(result.url).toEqual(expectedData.url);
  expect(result.title).toEqual(expectedData.title);
  expect(result.type).toEqual(expectedData.type);
  expect(result.status).toEqual(expectedData.status);
  expect(result.releaseYear).toEqual(expectedData.releaseYear);

  expect(new Set(result.authors)).toEqual(new Set(expectedData.authors));
  expect(new Set(result.genres)).toEqual(new Set(expectedData.genres));
  expect(new Set(result.artists)).toEqual(new Set(expectedData.artists));

  expect(new Set(result.chapters.map((chapter) => ({ ...chapter, lastUpdate: undefined })))).toEqual(
    new Set(expectedData.chapters.map((chapter: any) => ({ ...chapter, lastUpdate: undefined }))),
  );
});
