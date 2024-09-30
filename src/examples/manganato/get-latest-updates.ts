import { MangaScraperFactory, MangaSource } from "../../index";
import fs from "fs";

const main = async () => {
  const filename = "get-list-latest-update.json";

  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.getLatestUpdates();

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
