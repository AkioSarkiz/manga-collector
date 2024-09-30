import type {
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
} from "../../types";
import { axios } from "../../lib";
import { urlJoin } from "../../functions";

export class MangadexScraper implements Scraper {
  private readonly baseUrl: string = "https://mangadex.org";

  private getUrl(path: string = ""): string {
    return urlJoin(this.baseUrl, path);
  }

  public async getLatestUpdates(page: number = 1): Promise<ScrapedListOfManga> {
    const data: ScrapedListOfMangaItem[] = [];
    const limit = 20;
    const offset = (page - 1) * limit;

    const url = `https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includes[]=cover_art`;
    const response = await axios.get(url);
    const listLatestUpdate = response.data.data;

    listLatestUpdate.map((e: any, i: number) => {
      const coverId = e.relationships.find((r: any) => r.type === "cover_art").attributes.fileName;

      data.push({
        title: e.attributes.title.en,
        url: this.getUrl(`title/${e.id}`),
        imageThumbnail: this.getUrl(`covers/${e.id}/${coverId}`),
      });
    });

    return {
      totalData: response.data.total,
      canNext: offset <= 9967,
      canPrev: offset !== 0,
      totalPages: 9983,
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

    // Get info Manga like (title, author, tag)
    const infoMangaUrl = `https://api.mangadex.org/manga/${mangaId}?includes[]=artist&includes[]=author&includes[]=cover_art`;
    const response = await axios.get(infoMangaUrl);
    const mangaData = response.data.data;
    const alternativeTitles = mangaData.attributes.altTitles.map((e: any) => {
      const languageCode = Object.keys(e)[0];

      return e[languageCode];
    });

    const imageThumbnailId = mangaData.relationships.find((relationship: any) => relationship.type === "cover_art")
      .attributes.fileName;

    const imageThumbnail = this.getUrl(`covers/${mangaData.id}/${imageThumbnailId}`);

    mangaData.relationships
      .filter((relationship: any) => relationship.type === "author")
      .map((relationship: any) => {
        authors.push({
          name: relationship.attributes.name,
          url: `https://mangadex.org/author/${relationship.id}`,
        });
      });

    mangaData.relationships
      .filter((relationship: any) => relationship.type === "artist")
      .map((relationship: any) => {
        artists.push({
          name: relationship.attributes.name,
          url: `https://mangadex.org/author/${relationship.id}`,
        });
      });

    mangaData.attributes.tags.map((e: any) => {
      genres.push({
        url: `https://mangadex.org/tag/${e.id}`,
        name: e.attributes.name.en,
      });
    });

    // Get info Manga Chapter
    const chapters: ScrapedChapter[] = [];
    const chapterMangaUrl = `https://api.mangadex.org/manga/${mangaId}/feed?translatedLanguage[]=en&includes[]=scanlation_group&&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
    const chaptersResponse = await axios.get(chapterMangaUrl);

    chaptersResponse.data.data.map((e: any, i: number) => {
      chapters.push({
        url: `https://mangadex.org/chapter/${e.id}`,
        title: e.attributes.title,
        index: e.attributes.chapter,
        lastUpdate: e.attributes.updatedAt ? new Date(e.attributes.updatedAt) : undefined,
      });
    });

    return {
      // type??
      alternativeTitles,
      imageThumbnail,
      url,
      description: mangaData.attributes.description.en,
      authors,
      artists,
      genres,
      title: mangaData.attributes.title.en,
      status: mangaData.attributes.status,
      chapters,
    };
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
        index: i,
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
