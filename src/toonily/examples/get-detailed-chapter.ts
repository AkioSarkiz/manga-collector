import { MangaSource } from "../../constants.js";
import { MangaScraperFactory } from "../../factory.js";
import { ToonilyScraper } from "../index.js";
import fs from "fs";

const main = async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.TOONILY)) as ToonilyScraper;
  const result = await scraper.getDetailedChapter("https://toonily.com/webtoon/not-a-lady-anymore/chapter-1/");
  const filename = "detailed-chapter.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
