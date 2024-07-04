import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { MangadexScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGADEX)) as MangadexScraper;
  const result = await scraper.search("Solo Max-Level Newbie");

  await fs.promises.writeFile("search.json", JSON.stringify(result, null, 2));

  console.log("Result has been saved to search.json");

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
