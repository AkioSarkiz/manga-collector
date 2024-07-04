import { PaginationProps } from "./";

export interface SearchProps extends PaginationProps {
  query: string;
}

export interface SearchManga {
  title: string;
  link: string;
  cover: string;
  rating: string;
  views: string;
}
