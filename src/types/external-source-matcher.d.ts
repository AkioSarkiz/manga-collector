import { type ScrapedDetailedManga } from "./scraper";

export interface ExternalSourceMatcher {
  /**
   * The name of the external source.
   *
   * @example example of getting the name
   * ``ts
   * const name = externalSourceMatcher.getSourceName();
   * 
   * console.log(name); // "manga-updates"
   * ```
   */
  public getSourceName(): string;

  /**
   * Tries to match the manga with the external source.
   * If a match is found, the manga external source will be saved to the `manga.externalSources` property.
   *
   * @example Basic usage
   * ```ts
   * const externalSourceMatcher = new MyExternalSourceMatcher(manga);
   * const matchedManga = await externalSourceMatcher.tryMatchExternalSource();
   *
   * console.log(matchedManga.externalSources);
   * ```
   */
  public tryMatchExternalSource(): Promise<ScrapedDetailedManga>;
}
