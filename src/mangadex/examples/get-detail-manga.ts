import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { MangadexScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.ASURACOMIC)) as MangadexScraper;
  const result = await scraper.getDetailManga(
    "https://mangadex.org/title/304ceac3-8cdb-4fe7-acf7-2b6ff7a60613/attack-on-titan"
  );

  await fs.promises.writeFile("detail-manga.json", JSON.stringify(result, null, 2));

  console.log("Result has been saved to detail-manga.json");

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
