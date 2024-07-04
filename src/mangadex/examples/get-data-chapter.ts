import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { MangadexScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGADEX)) as MangadexScraper;
  const result = await scraper.getDataChapter("https://mangadex.org/chapter/0f7f932b-c426-46c6-9d36-2923ae3f7e13");

  await fs.promises.writeFile("data-chapter.json", JSON.stringify(result, null, 2));

  console.log("Result has been saved to data-chapter.json");

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
