import { MangaScraperFactory, MangaSource } from "../../index.js";
import fs from "fs";

const main = async () => {
  const url = "https://mangafire.to/read/kiritani-san-chossore-kuunsu-ka.59pzm/ja/chapter-1";
  const filename = "detailed-chapter.json";

  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
  const result = await scraper.getDetailedChapter(url);

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
