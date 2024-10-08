import fs from "fs";
import { MangaScraperFactory, MangaSource } from "../../index";

const main = async () => {
  const url = "https://mangadex.org/title/6b958848-c885-4735-9201-12ee77abcb3c/spy-family";
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
