import { type ScrapedDetailedManga } from "./scraper";

export interface ExternalSourceStrategy {
  /**
   * The name of the external source.
   *
   * @example example of getting the name
   * ``ts
   * const strategy = new MyExternalSourceStrategy(manga);
   * const name = strategy.getSourceName();
   *
   * console.log(name); // "manga-updates"
   * ```
   */
  getSourceName(): string;

  /**
   * Tries to match the manga with the external source.
   * If a match is found, the manga external source will be saved to the `manga.externalSources` property.
   *
   * @example Basic usage
   * ```ts
   * const strategy = new MyExternalSourceStrategy(manga);
   * const matchedManga = await strategy.tryMatchExternalSource();
   *
   * console.log(matchedManga.externalSources);
   * ```
   */
  tryMatchExternalSource(): Promise<ScrapedDetailedManga>;
}
