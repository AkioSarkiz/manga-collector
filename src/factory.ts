import { MangaSource, type Scraper } from "./index.js";
import { ToonilyScraper, ManganatoScraper, MangadexScraper, MangafireScraper } from "./providers/index.js";

export class MangaScraperFactory {
  /**
   * Creates a scraper instance based on the given source.
   *
   * @param {MangaSource} source - The source of the manga.
   * @return {Promise<Scraper>} A promise that resolves to the created scraper instance.
   */
  public static async make(source: MangaSource): Promise<Scraper> {
    let scraper;

    switch (source) {
      case MangaSource.MANGANATO:
        scraper = new ManganatoScraper();
        break;

      case MangaSource.TOONILY:
        scraper = new ToonilyScraper();
        break;

      case MangaSource.MANGADEX:
        scraper = new MangadexScraper();
        break;

      case MangaSource.MANGAFIRE:
        scraper = new MangafireScraper();
        break;

      default:
        throw new Error(`Invalid manga source: ${source}`);
    }

    await scraper.init();

    return scraper;
  }
}
