import axios from "axios";
import { chapter, genre, image_chapter, ResponseChapter, ResponseDetailManga, ResponseListManga } from "./types/type";
import {
  ScrapedArtist,
  ScrapedAuthor,
  ScrapedChapter,
  ScrapedDetailedManga,
  ScrapedGenre,
  ScrapedListOfManga,
  ScrapedListOfMangaItem,
  Scraper,
} from "../types/index.js";

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

  public async getDataChapter(
    url_chapter: string,
    url?: string | undefined,
    path?: string | undefined,
    prev_chapter?: chapter | undefined,
    next_chapter?: chapter | undefined
  ): Promise<ResponseChapter> {
    const sourceId = url_chapter;
    const chapter_data: image_chapter[] = [] as image_chapter[];
    let title = "null";
    // get info data
    await axios
      .get(`https://api.mangadex.org/chapter/${sourceId}?includes[]=scanlation_group&includes[]=manga&includes[]=user`)
      .then(function (response) {
        const infoData = response.data.data;
        let mangaId = 0;
        for (let i = 0; i < infoData.relationships.length; i++)
          if (infoData.relationships[i].type == "manga") {
            mangaId = i;
            break;
          }
        title = `${infoData.relationships[mangaId].attributes.title.en} chap ${infoData.attributes.chapter} [${infoData.attributes.title}]`;
      })
      .catch(function (error) {
        console.log(error);
      });
    //get img data
    await axios
      .get(`https://api.mangadex.org/at-home/server/${sourceId}?forcePort443=false`)
      .then(function (response) {
        const hash = response.data.chapter.hash;
        response.data.chapter.data.map((e: any, i: number) => {
          chapter_data.push({
            _id: i,
            src_origin: `https://uploads.mangadex.org/data/${hash}/${response.data.chapter.data[i]}`,
            alt: title + " id: " + i,
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    return {
      url: `${this.baseUrl}/chapter/${sourceId}`,
      path: `/chapter/${sourceId}`,
      title,
      chapter_data,
      prev_chapter: null,
      next_chapter: null,
    };
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
