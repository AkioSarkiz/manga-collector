import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { ManganatoScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.MANGANATO)) as ManganatoScraper;
  const result = await scraper.getDetailedChapter("https://chapmanganato.to/manga-oa952283/chapter-133");

  await fs.promises.writeFile("data-chapter.json", JSON.stringify(result, null, 2));

  console.log("Result has been saved to data-chapter.json");

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
