import { MangaScraperFactory, MangaSource } from "../../index.js";
import { AsuraComicScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.ASURACOMIC)) as AsuraComicScraper;
  const result = await scraper.getDetailManga("https://asuracomic.net/manga/1908287720-solo-max-level-newbie/");

  await fs.promises.writeFile("detail-manga.json", JSON.stringify(result, null, 2));

  console.log("Result has been saved to detail-manga.json");

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
