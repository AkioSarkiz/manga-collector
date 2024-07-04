import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { AsuraComicScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.ASURACOMIC)) as AsuraComicScraper;
  const result = await scraper.getDataChapter("https://asuracomic.net/1908287720-solo-max-level-newbie-chapter-158/");

  await fs.promises.writeFile("data-chapter.json", JSON.stringify(result, null, 2));

  console.log("Result has been saved to data-chapter.json");

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
