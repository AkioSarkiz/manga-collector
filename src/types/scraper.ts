import { IManga } from "@shineiichijo/marika";
import { SeriesResponse } from "./manga-updates";

export type ScrapedMangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";
export type ScrapedMangaType = "manga" | "novel" | "one-shot" | "doujin" | "manhwa" | "manhua";

export interface ScrapedGenre {
  name: string;

  url?: string;
}

export interface ScrapedChapter {
  url: string;

  index?: number;
  title?: string;
  lastUpdate?: Date;
  views?: number;
}

export interface ScrapedArtist {
  name: string;

  url?: string;
}

export interface ScrapedAuthor {
  name: string;

  url?: string;
}

export interface ExternalSource {
  name: string;
  url: string;
  data: SeriesResponse | IManga;
}

export interface ScrapedDetailedManga {
  url: string;
  title: string;
  status: ScrapedMangaStatus;
  description: string;
  imageThumbnail: string;

  alternativeTitles?: string[];
  releaseYear?: number;
  type?: ScrapedMangaType;
  authors?: ScrapedAuthor[];
  artists?: ScrapedArtist[];
  views?: number;
  rate?: number;
  rateVoters?: number;
  followsUsers?: number;

  chapters: ScrapedChapter[];
  genres: ScrapedGenre[];

  externalSources?: ExternalSource[];
}

export interface ScrapedDetailedChapterFrame {
  index: number;
  originSrc: string;
  cdnSrc?: string;
  alt?: string;
}

export interface ScrapedDetailedChapter {
  url: string;
  frames: ScrapedDetailedChapterFrame[];

  title?: string;
}

export type ScrapedListOfMangaItem = {
  imageThumbnail: string;
  title: string;
  url: string;
};

export type ScrapedListOfManga = {
  currentPage: number;

  /**
   * Total count of manga
   */
  totalData?: number;

  /**
   * Total count of pages
   */
  totalPages?: number;

  canPrev?: boolean;
  canNext?: boolean;

  data: ScrapedListOfMangaItem[];
};

export interface Scraper {
  /**
   * Initialization of scraper, it should be called before any other method
   *
   * @returns Promise<void>
   */
  init: () => Promise<void>;

  /**
   * Shutdown of scraper, it should be called after any other method
   *
   * @returns Promise<void>
   */
  shutdown: () => Promise<void>;

  /**
   * Get detailed information about manga by url
   *
   * @param {string} url
   * @returns {Promise<ScrapedDetailedManga>}
   */
  getDetailedManga: (url: string) => Promise<ScrapedDetailedManga>;

  /**
   * Get detailed information about chapter by url
   *
   * @param {string} url
   * @returns {Promise<ScrapedDetailedChapter>}
   */
  getDetailedChapter: (url: string) => Promise<ScrapedDetailedChapter>;

  /**
   * Get latest updates
   *
   * @param {number} page
   * @returns {Promise<ScrapedListOfManga>}
   */
  getLatestUpdates: (page?: number) => Promise<ScrapedListOfManga>;

  /**
   * Search manga with query
   *
   * @param {string} search query
   * @param {number} page
   * @returns {Promise<ScrapedListOfManga>}
   */
  search: (query: string, page?: number) => Promise<ScrapedListOfManga>;
}
