export interface Author {
  name: string;
  link: string;
}

export interface Genre {
  name: string;
  link: string;
}

export interface Chapter {
  name: string;
  link: string;
  uploaded_at: string;
  views: string;
}

export interface DetailedManga {
  title: string;
  alt_titles: string[];
  description: string;
  authors: Author[];
  status: "ongoing" | "completed";
  genres: Genre[];
  chapters: Chapter[];
}

export interface DetailedMangaProps {
  url: string;
}
