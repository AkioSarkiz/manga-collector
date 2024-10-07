import path from "node:path";
import { expect, test } from "vitest";
import { MyAnimeListExternalSourceMatcher } from "../../src/index";

const MANGA_LINK_DATA = [
  {
    name: "manga-one-punch-man",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-one-punch-man.json"),
    expectedExternalDataUrl: "https://myanimelist.net/manga/44347/One_Punch-Man",
  },
  {
    name: "reverse-villain",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-reverse-villain.json"),
    expectedExternalDataUrl: "https://myanimelist.net/manga/148002/Reverse_Villain",
  },
  {
    name: "manga-spy-family",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-spy-family.json"),
    expectedExternalDataUrl: "https://myanimelist.net/manga/119161/Spy_x_Family",
  },
];

test.each(MANGA_LINK_DATA)("should link manga $name", async ({ detailedMangaPath, expectedExternalDataUrl }) => {
  const manga = await import(detailedMangaPath);
  const matcher = new MyAnimeListExternalSourceMatcher(manga);
  const matchedManga = await matcher.tryMatchExternalSource();

  if (!matchedManga.externalSources) {
    expect.fail("No external sources found");
  }

  expect(matchedManga.externalSources).toContainEqual({
    name: matcher.getSourceName(),
    data: expect.anything(),
    url: expect.anything(),
  });

  const externalMangaUpdates = matchedManga.externalSources.find(({ name }) => name === matcher.getSourceName());

  if (!externalMangaUpdates) {
    test.fails(`Could not find ${matcher.getSourceName()}`);
  }

  expect(externalMangaUpdates!.data.url).toBe(expectedExternalDataUrl);
  expect(externalMangaUpdates!.url).toBe(expectedExternalDataUrl);

  await new Promise((resolve) => setTimeout(resolve, 2000));
});
