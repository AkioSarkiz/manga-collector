export type * from "./types/index.js";

export * from "./external-sources/index.js";
export { MangaScraperFactory } from "./factory.js";

export enum MangaSource {
  MANGANATO = "manganato",
  MANGADEX = "mangadex",
  TOONILY = "toonily",
  MANGAFIRE = "mangafire",
}

export enum ExternalSource {
  MANGA_UPDATES = "manga-updates",
}
