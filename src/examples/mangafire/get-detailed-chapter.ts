import { MangaScraperFactory, MangaSource } from "../../index";
import fs from "fs";

const main = async () => {
  const url = "https://mangafire.to/read/mushibamihime.qn0q5/en/chapter-6";
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
