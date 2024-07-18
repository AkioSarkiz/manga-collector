import { MangaSource, Scraper } from "./index.js";
import { MangadexScraper } from "./mangadex/index.js";
import { ManganatoScraper } from "./manganato/index.js";
import { ToonilyScraper } from "./toonily/index.js";

export class MangaScraperFactory {
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

      default:
        throw new Error(`Invalid manga source: ${source}`);
    }

    await scraper.init();

    // @ts-ignore
    return scraper;
  }
}
