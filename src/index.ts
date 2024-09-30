export type * from "./types/index";

export * from "./external-sources/index";
export { MangaScraperFactory } from "./factory";

export enum MangaSource {
  MANGANATO = "manganato",
  MANGADEX = "mangadex",
  TOONILY = "toonily",
  MANGAFIRE = "mangafire",
}
