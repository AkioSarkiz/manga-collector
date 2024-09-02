import { MangaScraperFactory, MangaSource } from "../../index.js";
import fs from "fs";

const main = async () => {
  const url = "https://mangafire.to/manga/lonely-attack-on-a-different-world.m22zz";
  const filename = "detailed-manga.json";

  const scraper = await MangaScraperFactory.make(MangaSource.MANGAFIRE);
  const result = await scraper.getDetailedManga(url);

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
