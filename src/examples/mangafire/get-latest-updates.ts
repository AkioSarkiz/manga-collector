import fs from "fs";
import { MangaScraperFactory, MangaSource } from "../../index";

const main = async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
  const result = await scraper.getLatestUpdates();
  const filename = "get-list-latest-update.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
