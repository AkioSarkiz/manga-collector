import { MangaScraperFactory, MangaSource } from "../../index.js";
import { AsuraComicScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.ASURACOMIC);
  const url = "https://asuracomic.net/1908287720-solo-max-level-newbie-chapter-158/";
  const result = await scraper.getDetailedChapter(url);
  const filename = "detailed-chapter.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
