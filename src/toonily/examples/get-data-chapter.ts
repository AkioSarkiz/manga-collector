import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { ToonilyScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.ASURACOMIC)) as ToonilyScraper;
  const result = await scraper.getDataChapter("https://toonily.com/webtoon/not-a-lady-anymore/chapter-1/");

  await fs.promises.writeFile("data-chapter.json", JSON.stringify(result, null, 2));

  console.log("Result has been saved to data-chapter.json");

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
