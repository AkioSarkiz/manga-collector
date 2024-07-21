import { expect, test } from "vitest";
import { tryLinkMangaUpdatesData } from "../../src/utils/index.js";
import path from "path";
import { ExternalSource } from "../../src/index.js";

const MANGA_LINK_DATA = [
  {
    name: "manga-da-capo",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-da-capo.json"),
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/wmsw1kn/da-capo",
  },
  {
    name: "manga-im-getting-married-to-a-girl-i-hate-in-my-class",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-im-getting-married-to-a-girl-i-hate-in-my-class.json"),
    expectedExternalDataUrl:
      "https://www.mangaupdates.com/series/qllhw5u/class-no-daikirai-na-joshi-to-kekkon-suru-koto-ni-natta",
  },
  {
    name: "manga-one-punch-man",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-one-punch-man.json"),
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/e1096mh/one-punch-man",
  },
  {
    name: "manga-spy-family",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-spy-family.json"),
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/v5is1fi/spy-x-family",
  },
  {
    name: "zhang-de-tai-xiang-boss-jieguo-shiren-zhen-de-xinle",
    detailedMangaPath: path.join(
      __dirname,
      "data/detailed-manga-zhang-de-tai-xiang-boss-jieguo-shiren-zhen-de-xinle.json"
    ),
    expectedExternalDataUrl:
      "https://www.mangaupdates.com/series/rq0w3cz/zhang-de-tai-xiang-boss-jieguo-shiren-zhen-de-xinle",
  },
  {
    name: "keyaki-shoutengai-sakura-no-yu",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-keyaki-shoutengai-sakura-no-yu.json"),
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/0ui9s99/keyaki-shoutengai-sakura-no-yu",
  },
  {
    name: "manga-kajino-gui",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-kajino-gui.json"),
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/gph53m6/kajino-gui",
  },
  {
    name: "justice-judo-center",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-justice-judo-center.json"),
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/jwvrp6k/justice-judo-center",
  },
  {
    name: "fate-makes-no-mistakes",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-fate-makes-no-mistakes.json"),
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/7h4bfy6/fate-makes-no-mistakes",
  },
  {
    name: "kouritsu-kuriya-madoushi-daini-no-jinsei-de-madou-o-kiwameru",
    detailedMangaPath: path.join(
      __dirname,
      "data/detailed-manga-kouritsu-kuriya-madoushi-daini-no-jinsei-de-madou-o-kiwameru.json"
    ),
    expectedExternalDataUrl:
      "https://www.mangaupdates.com/series/relacl5/kouritsu-kuriya-madoushi-daini-no-jinsei-de-madou-o-kiwameru",
  },
  {
    name: "detailed-manga-my-secretly-hot-husband",
    detailedMangaPath: path.join(__dirname, "data/detailed-manga-my-secretly-hot-husband.json"),
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/cmtkded/my-secretly-hot-husband",
  },
  {
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/1xk8myw/11336",
    name: "manga-11336",
    detailedMangaPath: path.join(__dirname, "data/detailed-11336.json"),
  },
  {
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/6iabio1/the-frozen-player-returns",
    name: "manga-the-frozen-player-returns",
    detailedMangaPath: path.join(__dirname, "data/detailed-the-frozen-player-returns.json"),
  },
  {
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/pclvuco/4-cut-hero",
    name: "manga-4-cut-hero",
    detailedMangaPath: path.join(__dirname, "data/detailed-4-cut-hero.json"),
  },
  {
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/d9kgu2a/mystic-musketeer",
    name: "manga-mystic-musketeer",
    detailedMangaPath: path.join(__dirname, "data/detailed-mystic-musketeer.json"),
  },
  {
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/sclnjge/teenage-mercenary",
    name: "manga-teenage-mercenary",
    detailedMangaPath: path.join(__dirname, "data/detailed-teenage-mercenary.json"),
  },
  {
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/rwg23en/the-beginning-after-the-end",
    name: "manga-the-beginning-after-the-end",
    detailedMangaPath: path.join(__dirname, "data/detailed-the-beginning-after-the-end.json"),
  },
  {
    expectedExternalDataUrl: "https://www.mangaupdates.com/series/bj0un1d/volcanic-age",
    name: "manga-volcanic-age",
    detailedMangaPath: path.join(__dirname, "data/detailed-volcanic-age.json"),
  },
];

test.each(MANGA_LINK_DATA)("should link manga $name", async ({ detailedMangaPath, expectedExternalDataUrl }) => {
  const data = await tryLinkMangaUpdatesData(await import(detailedMangaPath));

  expect(data.externalSources).toContainEqual({
    name: ExternalSource.MANGA_UPDATES,
    data: expect.anything(),
  });

  const externalMangaUpdates = data.externalSources!.find(({ name }) => name === ExternalSource.MANGA_UPDATES);

  if (!externalMangaUpdates) {
    test.fails(`Could not find ${ExternalSource.MANGA_UPDATES}`);
  }

  expect(externalMangaUpdates!.data.url).toBe(expectedExternalDataUrl);
});
