import { MangaScraperFactory, MangaSource } from "../../index.js";
import fs from "fs";

const main = async () => {
  const url = "https://fanfox.net/manga/wo_he_wo_de_ai_ni_ya/v01/c001/1.html";
  const filename = "detailed-chapter.json";

  const scraper = await MangaScraperFactory.make(MangaSource.FANFOX);
  const result = await scraper.getDetailedChapter(url);

  await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));

  console.log(`Result has been saved to ${filename}`);

  await scraper.shutdown();
};

main()
  .then(() => console.log("Done"))
  .catch(console.error);
