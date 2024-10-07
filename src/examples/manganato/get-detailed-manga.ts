import fs from "fs";
import { MangaScraperFactory, MangaSource } from "../../index";

const main = async () => {
  const url = "https://manganato.com/manga-vz956108";
  const filename = "detailed-manga.json";

  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.getDetailedManga(url);

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
