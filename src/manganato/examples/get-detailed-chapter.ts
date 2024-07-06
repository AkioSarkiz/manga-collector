import { MangaScraperFactory, MangaSource } from "../../index.js";
import fs from "fs";

const main = async () => {
  const scraper = await MangaScraperFactory.make(MangaSource.MANGANATO);
  const result = await scraper.getDetailedChapter("https://chapmanganato.to/manga-oa952283/chapter-133");
  const filename = "data-chapter.json";

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
