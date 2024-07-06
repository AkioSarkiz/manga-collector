import { Browser } from "puppeteer";
export type ResponseListManga = {
  totalData: number;
  canNext: boolean;
  canPrev: boolean;
  totalPage?: number;
  currentPage: number;
  data: {
    _id: number;
    image_thumbnail: string;
    title: string;
    href: string;
  }[];
};
export type genre = {
  url?: string;
  name: string;
  path: string;
};
export type chapter = {
  path: string;
  url: string;
  parent_href: string;
  title?: string;
  last_update?: string;
  views?: string;
};
export type ResponseDetailManga = {
  path: string;
  url: string;
  author: string;
  title: string;
  status: string;
  genres: genre[];
  views?: string;
  rate?: string;
  rate_number?: string;
  follows?: string;
  chapters: chapter[];
};
export type image_chapter = {
  _id?: number;
  src_origin: string;
  src_cdn?: string;
  alt: string;
};
export type ResponseChapter = {
  url?: string;
  path?: string;
  title: string;
  chapter_data: image_chapter[];
  prev_chapter: chapter | null;
  next_chapter: chapter | null;
};
export type constructorParams = {
  baseUrl?: string;
};
export interface AbstractMangaFactory {
  baseUrl: string;
  browser?: Promise<Browser>;
  all_genres: genre[];
  getListLatestUpdate(page?: number): Promise<ResponseListManga>;
  getDetailManga(url: string): Promise<ResponseDetailManga>;
  getDataChapter(
    url_chapter: string,
    url?: string,
    path?: string,
    prev_chapter?: chapter,
    next_chapter?: chapter
  ): Promise<ResponseChapter>;
  getListByGenre(genre: genre, page?: number, status?: any, sort?: any): Promise<ResponseListManga>;
  search(keyword: string, page?: number): Promise<ResponseListManga>;
}
