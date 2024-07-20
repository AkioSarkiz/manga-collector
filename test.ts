import { tryLinkMangaUpdatesData } from "./src/utils/index.js";
import { MangaScraperFactory, MangaSource } from "./src/index.js";
import fs from "fs";

(async () => {
  const scrapper = await MangaScraperFactory.make(MangaSource.TOONILY);

  const latestUpdates = await scrapper.getLatestUpdates();

  for (let i = 0; i < latestUpdates.data.length && i < 10; i++) {
    const latestUpdate = latestUpdates.data[i];
    const detailedManga = await scrapper.getDetailedManga(latestUpdate.url);

    const manga = await tryLinkMangaUpdatesData(detailedManga);

    if (manga.externalSources?.length) {
      const source = manga.externalSources[0];

      if (source) {
        const dataUrl = new URL(source.data.url);
        const paths = dataUrl.pathname.split("/");

        fs.writeFileSync(`detailed-${paths[paths.length - 1]}.json`, JSON.stringify(detailedManga, null, 2));
      }
    }

    console.log("ENDED");
  }
})();
