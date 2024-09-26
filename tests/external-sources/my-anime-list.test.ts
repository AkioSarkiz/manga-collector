// import { expect, test } from "vitest";
// import path from "path";
// import { ExternalSource, MyAnimeListExternalSourceMatcher } from "../../src/index.js";

// const MANGA_LINK_DATA = [
//   {
//     name: "manga-one-punch-man",
//     detailedMangaPath: path.join(__dirname, "data/detailed-manga-one-punch-man.json"),
//     expectedExternalDataUrl: "https://www.mangaupdates.com/series/e1096mh/one-punch-man",
//   },
// ];

// test.each(MANGA_LINK_DATA)("should link manga $name", async ({ detailedMangaPath, expectedExternalDataUrl }) => {
//   const matcher = new MyAnimeListExternalSourceMatcher(await import(detailedMangaPath));
//   const matchedManga = await matcher.tryMatchExternalSource();

//   expect.fail("stop");

//   expect(matchedManga.externalSources).toContainEqual({
//     name: ExternalSource.MANGA_UPDATES,
//     data: expect.anything(),
//     url: expect.anything(),
//   });

//   const externalMangaUpdates = matchedManga.externalSources!.find(({ name }) => name === ExternalSource.MANGA_UPDATES);

//   if (!externalMangaUpdates) {
//     test.fails(`Could not find ${ExternalSource.MANGA_UPDATES}`);
//   }

//   expect(externalMangaUpdates!.data.url).toBe(expectedExternalDataUrl);
//   expect(externalMangaUpdates!.url).toBe(expectedExternalDataUrl);
// });
