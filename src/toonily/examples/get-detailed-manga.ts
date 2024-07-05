import { MangaScraperFactory, MangaSource } from "../../index.js";
import { ToonilyScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.TOONILY)) as ToonilyScraper;
  const result = await scraper.getDetailedManga("https://toonily.com/webtoon/the-duke-and-the-fox-princess/");
  const filename = "detailed-manga.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
