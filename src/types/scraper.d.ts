export type ScrapedMangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";
export type ScrapedMangaType = "manga" | "novel" | "one-shot" | "doujin" | "manhwa" | "manhua";

export interface ScrapedGenre {
  name: string;

  url?: string;
}

export interface ScrapedChapter {
  url: string;
  parent_href: string;

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

export interface ScrapedDetailedManga {
  url: string;
  title: string;
  status: ScrapedMangaStatus;
  description: string;
  type: ScrapedMangaType;

  author?: ScrapedAuthor;
  artist?: ScrapedArtist;
  views?: number;
  rate?: number;
  rateVoters?: number;
  followsUsers?: number;

  chapters: ScrapedChapter[];
  genres: ScrapedGenre[];
}

export interface ScrapedDetailedChapter {
  url: string;
  title: string;
  frames: string[];
  nextChapterUrl?: string;
  previousChapterUrl?: string;
}

export type ScrapedListOfManga = {
  totalData: number;
  currentPage: number;
  prevPage?: number;
  nextPage?: number;
  totalPages?: number;

  data: {
    _id: number;
    imageThumbnail: string;
    title: string;
    href: string;
  }[];
};

export interface Scraper {
  init: () => Promise<void>;
  shutdown: () => Promise<void>;

  getDetailedManga: (url: string) => Promise<ScrapedDetailedManga>;
  getDetailedChapter: (url: string) => Promise<ScrapedDetailedChapter>;
  search: (query: string, page?: number) => Promise<ScrapedListOfManga>;
}
