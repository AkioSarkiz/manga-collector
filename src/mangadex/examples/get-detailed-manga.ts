import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { MangadexScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  // const url = "https://mangadex.org/title/304ceac3-8cdb-4fe7-acf7-2b6ff7a60613/attack-on-titan";
  const url = "https://mangadex.org/title/58bb34a5-452a-49a3-bd08-e167d654dbe4";
  const filename = "detailed-manga.json";

  const scraper = (await MangaScraperFactory.make(MangaSource.MANGADEX)) as MangadexScraper;
  const result = await scraper.getDetailedManga(url);

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
