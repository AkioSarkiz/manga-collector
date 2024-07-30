import { MangaScraperFactory, MangaSource } from "../../index.js";
import fs from "fs";

const main = async () => {
  const url = "https://mangadex.org/chapter/0f7f932b-c426-46c6-9d36-2923ae3f7e13";
  const filename = "detailed-chapter.json";

  const scraper = await MangaScraperFactory.make(MangaSource.MANGADEX);
  const result = await scraper.getDetailedChapter(url);

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
