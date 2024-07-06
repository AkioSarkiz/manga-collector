import { MangaScraperFactory, MangaSource } from "../../index.js";
import { AsuraComicScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.ASURACOMIC);
  const result = await scraper.getDetailedManga("https://asuracomic.net/manga/1908287720-solo-max-level-newbie/");
  const filename = "detailed-manga.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
