// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// AsuraComic is under maintenance right now and this is an experimental feature.
// So tests disabled to pass release.
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import { expect, test } from "vitest";

test("fake", () => {
  expect(1).toBe(1);
});

// import { describe, expect, expectTypeOf, test } from "vitest";
// import { MangaSource } from "../src/index.js";
// import { MangaScraperFactory } from "../src/factory.js";
// import { AsuraComicScraper } from "../src/asuracomic/index.js";
// import { ResponseChapter, ResponseDetailManga, ResponseListManga } from "../src/asuracomic/types/type.js";

// describe("test asuracomic", async () => {
//   const scraper = (await MangaScraperFactory.make(MangaSource.ASURACOMIC)) as AsuraComicScraper;

//   test("should load latest manga", async () => {
//     const result = await scraper.getListLatestUpdate();
//     expectTypeOf(result).toEqualTypeOf<ResponseListManga>();
//   });

//   test("search Solo Max-Level Newbie manga", async () => {
//     const result = await scraper.search("Solo Max-Level Newbie");
//     expectTypeOf(result).toEqualTypeOf<ResponseListManga>();
//     expect(result.data.length).greaterThanOrEqual(1);
//   });

//   test("get detail of Solo Max-Level Newbie manga", async () => {
//     const result = await scraper.getDetailManga("https://asuracomic.net/manga/1908287720-solo-max-level-newbie/");
//     expectTypeOf(result).toEqualTypeOf<ResponseDetailManga>();
//   });

//   test("get data chapter of Solo Max-Level Newbie manga", async () => {
//     const result = await scraper.getDataChapter("https://asuracomic.net/1908287720-solo-max-level-newbie-chapter-158/");
//     expectTypeOf(result).toEqualTypeOf<ResponseChapter>();
//     expect(result.chapter_data.length).equal(16);
//   });
// });
