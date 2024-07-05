import {
  ScrapedArtist,
  ScrapedAuthor,
  ScrapedChapter,
  ScrapedDetailedChapter,
  ScrapedDetailedChapterFrame,
  ScrapedDetailedManga,
  ScrapedGenre,
  ScrapedListOfManga,
  ScrapedListOfMangaItem,
  Scraper,
} from "../types/index.js";
import { axios } from "../utils/axios.js";

export class MangadexScraper implements Scraper {
  private readonly baseUrl: string = "https://mangadex.org";

  public async getListLatestUpdate(page?: number | undefined): Promise<ResponseListManga> {
    let totalData = 0;
    let data: {
      _id: number;
      image_thumbnail: string;
      title: string;
      href: string;
    }[] = [];
    let offset = 0;
    if (page != undefined)
      if (page >= 0 && page <= 9983) offset = page;
      else throw new Error("Offset is out of bound");
    await axios
      .get(
        `https://api.mangadex.org/manga?limit=16&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`
      )
      .then(function (response) {
        const listLatestUpdate = response.data.data;
        totalData = response.data.total;
        data = listLatestUpdate.map((e: any, i: any) => {
          return {
            _id: offset + i,
            title: e.attributes.title.en,
            href: `/${e.id}`,
            image_thumbnail: "not implemented",
          };
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    return {
      totalData,
      canNext: offset <= 9967 ? true : false,
      canPrev: offset === 0 ? false : true,
      totalPage: 9983,
      currentPage: offset,
      data,
    };
  }

  public async getDetailedManga(url: string): Promise<ScrapedDetailedManga> {
    const urlObj = new URL(url);
    const mangaId = urlObj.pathname.split("/")[2];

    const authors: ScrapedAuthor[] = [];
    const artists: ScrapedArtist[] = [];
    const genres: ScrapedGenre[] = [];

    //Get info Manga like (title, author, tag)
    const infoMangaUrl = `https://api.mangadex.org/manga/${mangaId}?includes[]=artist&includes[]=author&includes[]=cover_art`;
    const response = await axios.get(infoMangaUrl);
    const mangaData = response.data.data;

    mangaData.relationships
      .filter((relationship: any) => relationship.type === "author")
      .map((relationship: any) => {
        authors.push({
          name: relationship.attributes.name,
          url: `https://mangadex.org/author/${relationship.id}`,
        } as ScrapedAuthor);
      });

    mangaData.relationships
      .filter((relationship: any) => relationship.type === "artist")
      .map((relationship: any) => {
        artists.push({
          name: relationship.attributes.name,
          url: `https://mangadex.org/author/${relationship.id}`,
        } as ScrapedAuthor);
      });

    mangaData.attributes.tags.map((e: any) => {
      genres.push({
        url: `https://mangadex.org/tag/${e.id}`,
        name: e.attributes.name.en,
      });
    });

    //Get info Manga Chapter
    const chapters: ScrapedChapter[] = [];
    const chapterMangaUrl = `https://api.mangadex.org/manga/${mangaId}/feed?translatedLanguage[]=en&includes[]=scanlation_group&&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
    const chaptersResponse = await axios.get(chapterMangaUrl);

    chaptersResponse.data.data.map((e: any, i: number) => {
      chapters.push({
        _id: i,
        url: `https://mangadex.org/chapter/${e.id}`,
        title: e.attributes.title,
        index: e.attributes.chapter,
        lastUpdate: e.attributes.updatedAt ? new Date(e.attributes.updatedAt) : undefined,
      });
    });

    return {
      url,
      description: mangaData.attributes.description.en,
      authors,
      artists,
      genres,
      title: mangaData.attributes.title.en,
      status: mangaData.attributes.status,
      chapters,
    } as ScrapedDetailedManga;
  }

  public async getDetailedChapter(url: string): Promise<ScrapedDetailedChapter> {
    const urlObj = new URL(url);
    const mangaId = urlObj.pathname.split("/")[2];
    const frames: ScrapedDetailedChapterFrame[] = [];

    const mangaUrl = `https://api.mangadex.org/chapter/${mangaId}?includes[]=scanlation_group&includes[]=manga&includes[]=user`;
    const responseManga = await axios.get(mangaUrl);

    for (const relationship of responseManga.data.data.relationships) {
      if (relationship.type === "manga") {
        break;
      }
    }

    const responseChapters = await axios.get(`https://api.mangadex.org/at-home/server/${mangaId}?forcePort443=false`);
    const hash = responseChapters.data.chapter.hash;

    for (let i = 0; i < responseChapters.data.chapter.data.length; i++) {
      frames.push({
        _id: i,
        originSrc: `https://uploads.mangadex.org/data/${hash}/${responseChapters.data.chapter.data[i]}`,
      });
    }

    return {
      url: `${this.baseUrl}/chapter/${mangaId}`,
      title: responseManga.data.data.attributes.title,
      frames,
    } as ScrapedDetailedChapter;
  }

  public async search(query: string, page: number = 1): Promise<ScrapedListOfManga> {
    const data: ScrapedListOfMangaItem[] = [];
    const limit = 20;
    const offset = (page - 1) * limit;

    const url = `https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=artist&includes[]=author&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=${query}&order[relevance]=desc`;
    const response = await axios.get(url);

    response.data.data.map((e: any, i: number) => {
      const coverRelationship = e.relationships.find((r: any) => r.type === "cover_art");

      data.push({
        _id: i,
        title: e.attributes.title.en,
        url: `https://mangadex.org/title/${e.id}`,
        imageThumbnail: `https://mangadex.org/covers/${e.id}/${coverRelationship.attributes.fileName}`,
      } as ScrapedListOfMangaItem);
    });

    const totalPages = Math.ceil(response.data.total / limit);
    const canNext = offset + limit < response.data.total;
    const canPrev = offset > 0;

    return {
      totalData: response.data.total,
      canNext,
      canPrev,
      totalPages,
      currentPage: page,
      data,
    };
  }

  public async init() {
    // there are notion we need to do
  }

  public async shutdown() {
    // there are notion we need to do
  }
}
