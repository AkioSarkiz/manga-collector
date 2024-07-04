import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { ToonilyScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.TOONILY)) as ToonilyScraper;
  const result = await scraper.getListLatestUpdate();

  await fs.promises.writeFile("get-list-latest-update.json", JSON.stringify(result, null, 2));

  console.log("Result has been saved to get-list-latest-update.json");

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
