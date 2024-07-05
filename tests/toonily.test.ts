import { describe, expect, expectTypeOf, test } from "vitest";
import { MangaSource } from "../src/constants.js";
import { MangaScraperFactory } from "../src/factory.js";
import { ResponseChapter, ResponseDetailManga, ResponseListManga } from "../src/asuracomic/types/type.js";
import { ToonilyScraper } from "../src/toonily/index.js";
import { ScrapedDetailedManga } from "../src/index.js";

const MANGA_DATA_TO_DETAILED_SCRAPE = [
  {
    url: "https://toonily.com/webtoon/mookhyang-the-origin/",
    expected: {
      url: "https://toonily.com/webtoon/mookhyang-the-origin/",
      type: "manhwa",
      description:
        "In a world with bloody and vast battlefields where several forces fought for supremacy; a young boy only known as number 2044, was kidnapped and trained to be an assassin by the enemy since he was a child. After much intensive training and struggling through life-threatening situations, he gained the name “Mukhyang”. But Mukhyang was never satisfied, he had an unfulfilled thirst for something, and that was the path of the sword! As Mukhyang was dissatisfied with his life as an assassin, he met his mentor ‘Yu Baek of the Hwan Sa Sword’ and his life changed forever. Will he be able to reach the pinnacle of martial arts?! Fighting with geniuses as he climbs his way to the top!",
      author: {
        name: "Jeon Dong-Jo",
        url: "https://toonily.com/authors/jeon-dong-jo/",
      },
      genres: [
        {
          url: "https://toonily.com/webtoon-genre/action/",
          name: "Action",
        },
        {
          url: "https://toonily.com/webtoon-genre/shounen/",
          name: "Shounen",
        },
      ],
      rate: 4.3,
      rateVoters: 177,
      followsUsers: 565,
      views: 492100,
      title: "Mookhyang The Origin",
      status: "completed",
      chapters: [
        {
          _id: 0,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-47/",
          title: "Chapter 47 - The End",
          lastUpdate: new Date("2021-08-14T22:00:00.000Z"),
          index: 47,
        },
        {
          _id: 1,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-46/",
          title: "Chapter 46",
          lastUpdate: new Date("2021-08-06T22:00:00.000Z"),
          index: 46,
        },
        {
          _id: 2,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-45/",
          title: "Chapter 45",
          lastUpdate: new Date("2021-08-01T22:00:00.000Z"),
          index: 45,
        },
        {
          _id: 3,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-44/",
          title: "Chapter 44",
          lastUpdate: new Date("2021-07-23T22:00:00.000Z"),
          index: 44,
        },
        {
          _id: 4,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-43/",
          title: "Chapter 43",
          lastUpdate: new Date("2021-07-14T22:00:00.000Z"),
          index: 43,
        },
        {
          _id: 5,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-42/",
          title: "Chapter 42",
          lastUpdate: new Date("2021-07-07T22:00:00.000Z"),
          index: 42,
        },
        {
          _id: 6,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-41/",
          title: "Chapter 41",
          lastUpdate: new Date("2021-07-01T22:00:00.000Z"),
          index: 41,
        },
        {
          _id: 7,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-40/",
          title: "Chapter 40",
          lastUpdate: new Date("2021-06-23T22:00:00.000Z"),
          index: 40,
        },
        {
          _id: 8,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-39/",
          title: "Chapter 39",
          lastUpdate: new Date("2021-06-18T22:00:00.000Z"),
          index: 39,
        },
        {
          _id: 9,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-38/",
          title: "Chapter 38",
          lastUpdate: new Date("2021-06-09T22:00:00.000Z"),
          index: 38,
        },
        {
          _id: 10,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-37/",
          title: "Chapter 37",
          lastUpdate: new Date("2021-06-02T22:00:00.000Z"),
          index: 37,
        },
        {
          _id: 11,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-36/",
          title: "Chapter 36",
          lastUpdate: new Date("2021-05-26T22:00:00.000Z"),
          index: 36,
        },
        {
          _id: 12,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-35/",
          title: "Chapter 35",
          lastUpdate: new Date("2021-05-19T22:00:00.000Z"),
          index: 35,
        },
        {
          _id: 13,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-34/",
          title: "Chapter 34",
          lastUpdate: new Date("2021-05-12T22:00:00.000Z"),
          index: 34,
        },
        {
          _id: 14,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-33/",
          title: "Chapter 33",
          lastUpdate: new Date("2021-05-05T22:00:00.000Z"),
          index: 33,
        },
        {
          _id: 15,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-32/",
          title: "Chapter 32",
          lastUpdate: new Date("2021-04-28T22:00:00.000Z"),
          index: 32,
        },
        {
          _id: 16,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-31/",
          title: "Chapter 31",
          lastUpdate: new Date("2021-04-21T22:00:00.000Z"),
          index: 31,
        },
        {
          _id: 17,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-30/",
          title: "Chapter 30",
          lastUpdate: new Date("2021-04-14T22:00:00.000Z"),
          index: 30,
        },
        {
          _id: 18,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-29/",
          title: "Chapter 29",
          lastUpdate: new Date("2021-04-08T22:00:00.000Z"),
          index: 29,
        },
        {
          _id: 19,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-28/",
          title: "Chapter 28",
          lastUpdate: new Date("2021-03-31T22:00:00.000Z"),
          index: 28,
        },
        {
          _id: 20,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-27/",
          title: "Chapter 27",
          lastUpdate: new Date("2021-03-24T23:00:00.000Z"),
          index: 27,
        },
        {
          _id: 21,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-26/",
          title: "Chapter 26",
          lastUpdate: new Date("2021-03-18T23:00:00.000Z"),
          index: 26,
        },
        {
          _id: 22,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-25/",
          title: "Chapter 25",
          lastUpdate: new Date("2021-03-11T23:00:00.000Z"),
          index: 25,
        },
        {
          _id: 23,
          title: "Chapter 24",
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-24/",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 24,
        },
        {
          _id: 24,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-23/",
          title: "Chapter 23",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 23,
        },
        {
          _id: 25,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-22/",
          title: "Chapter 22",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 22,
        },
        {
          _id: 26,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-21/",
          title: "Chapter 21",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 21,
        },
        {
          _id: 27,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-20/",
          title: "Chapter 20",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 20,
        },
        {
          _id: 28,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-19/",
          title: "Chapter 19",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 19,
        },
        {
          _id: 29,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-18/",
          title: "Chapter 18",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 18,
        },
        {
          _id: 30,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-17/",
          title: "Chapter 17",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 17,
        },
        {
          _id: 31,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-16/",
          title: "Chapter 16",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 16,
        },
        {
          _id: 32,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-15/",
          title: "Chapter 15",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 15,
        },
        {
          _id: 33,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-14/",
          title: "Chapter 14",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 14,
        },
        {
          _id: 34,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-13/",
          title: "Chapter 13",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 13,
        },
        {
          _id: 35,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-12/",
          title: "Chapter 12",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 12,
        },
        {
          _id: 36,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-11/",
          title: "Chapter 11",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 11,
        },
        {
          _id: 37,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-10/",
          title: "Chapter 10",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 10,
        },
        {
          _id: 38,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-9/",
          title: "Chapter 9",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 9,
        },
        {
          _id: 39,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-8/",
          title: "Chapter 8",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 8,
        },
        {
          _id: 40,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-7/",
          title: "Chapter 7",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 7,
        },
        {
          _id: 41,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-6/",
          title: "Chapter 6",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 6,
        },
        {
          _id: 42,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-5/",
          title: "Chapter 5",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 5,
        },
        {
          _id: 43,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-4/",
          title: "Chapter 4",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 4,
        },
        {
          _id: 44,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-3/",
          title: "Chapter 3",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 3,
        },
        {
          _id: 45,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-2/",
          title: "Chapter 2",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 2,
        },
        {
          _id: 46,
          url: "https://toonily.com/webtoon/mookhyang-the-origin/chapter-1/",
          title: "Chapter 1",
          lastUpdate: new Date("2021-03-03T23:00:00.000Z"),
          index: 1,
        },
      ],
    },
  },
  {
    url: "https://toonily.com/webtoon/reverse-villain/",
  },
  {
    url: "https://toonily.com/webtoon/solo-leveling-005/",
  },
  {
    url: "https://toonily.com/webtoon/her-summon-001/",
  },
  {
    url: "https://toonily.com/webtoon/not-a-lady-anymore/",
  },
  {
    url: "https://toonily.com/webtoon/love-rebooted/",
  },
];

describe("test asuracomic", async () => {
  const scraper = (await MangaScraperFactory.make(MangaSource.TOONILY)) as ToonilyScraper;

  test("should load latest manga", async () => {
    const result = await scraper.getListLatestUpdate();
    expectTypeOf(result).toEqualTypeOf<ResponseListManga>();
  });

  test("search Solo Max-Level Newbie manga", async () => {
    const result = await scraper.search("Solo Max-Level Newbie");
    expectTypeOf(result).toEqualTypeOf<ResponseListManga>();
    expect(result.data.length).greaterThanOrEqual(1);
  });

  test("get data chapter of Solo Max-Level Newbie manga", async () => {
    const result = await scraper.getDataChapter("https://toonily.com/webtoon/solo-leveling-005/chapter-0/");
    expectTypeOf(result).toEqualTypeOf<ResponseChapter>();
    expect(result.chapter_data.length).equal(16);
  });
});

describe.each(MANGA_DATA_TO_DETAILED_SCRAPE)("scrape $url", async ({ url, expected }) => {
  const scraper = (await MangaScraperFactory.make(MangaSource.TOONILY)) as ToonilyScraper;

  test("scrape", async () => {
    const result = await scraper.getDetailedManga(url);
    expectTypeOf(result).toEqualTypeOf<ScrapedDetailedManga>();

    if (expected) {
      expect(result).toEqual(expected);
    }
  });
});
