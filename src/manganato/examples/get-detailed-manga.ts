import { MangaScraperFactory, MangaSource } from "../../index.js";
import { ManganatoScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;
  const result = await scraper.getDetailedManga("https://chapmanganato.to/manga-fy982633");
  const filename = "detailed-manga.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
