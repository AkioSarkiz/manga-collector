import { MangaScraperFactory, MangaSource } from "../../index.js";
import fs from "fs";

const main = async () => {
  const url = "https://mangadex.org/title/58bb34a5-452a-49a3-bd08-e167d654dbe4";
  const filename = "detailed-manga.json";

  const scraper = await MangaScraperFactory.make(MangaSource.MANGADEX);
  const result = await scraper.getDetailedManga(url);

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
