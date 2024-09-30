import { MangaScraperFactory, MangaSource } from "../../index";
import fs from "fs";

const main = async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
  const result = await scraper.search("Solo Leveling");
  const filename = "search.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
