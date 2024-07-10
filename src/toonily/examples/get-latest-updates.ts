import { MangaScraperFactory, MangaSource } from "../../index.js";
import fs from "fs";

const main = async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.TOONILY);
  const result = await scraper.getLatestUpdates(2);
  const filename = "get-list-latest-update.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
