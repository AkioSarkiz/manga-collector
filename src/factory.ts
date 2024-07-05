import { AsuraComicScraper } from "./asuracomic/index.js";
import { MangaSource } from "./index.js";
import { MangadexScraper } from "./mangadex/index.js";
import { ManganatoScraper } from "./manganato/index.js";
import { ToonilyScraper } from "./toonily/index.js";

export class MangaScraperFactory {
  public static async make(
    source: MangaSource
  ): Promise<ManganatoScraper | AsuraComicScraper | ToonilyScraper | MangadexScraper> {
    let scraper;

    switch (source) {
      case MangaSource.MANGANATO:
        scraper = new ManganatoScraper();
        break;

      case MangaSource.ASURACOMIC:
        scraper = new AsuraComicScraper();
        break;

      case MangaSource.TOONILY:
        scraper = new ToonilyScraper();
        break;

      case MangaSource.MANGADEX:
        scraper = new MangadexScraper();
        break;

      default:
        throw new Error("Invalid manga source");
    }

    await scraper.init();

    return scraper;
  }
}
