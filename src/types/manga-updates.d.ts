export interface SeriesResponse {
  series_id: number;
  title: string;
  url: string;
  associated: Associated[];
  description: string;
  image: Image;
  type: string;
  year: string;
  bayesian_rating: number;
  rating_votes: number;
  genres: Genre[];
  categories: Category[];
  latest_chapter: number;
  forum_id: number;
  status: string;
  licensed: boolean;
  completed: boolean;
  anime: Anime;
  related_series: Relatedsery[];
  authors: Author[];
  publishers: Publisher[];
  publications: Publication[];
  recommendations: Recommendation[];
  category_recommendations: Recommendation[];
  rank: Rank;
  last_updated: Lastupdated;
  admin: Admin;
}

interface Profile {
  upgrade: Upgrade;
}

interface Upgrade {
  requested: boolean;
  reason: string;
}

interface Avatar {
  id: number;
  url: string;
  height: number;
  width: number;
}

interface Lastupdated {
  timestamp: number;
  as_rfc3339: string;
  as_string: string;
}

interface Rank {
  position: Position;
  old_position: Position;
  lists: Lists;
}

interface Lists {
  reading: number;
  wish: number;
  complete: number;
  unfinished: number;
  custom: number;
}

interface Recommendation {
  series_name: string;
  series_id: number;
  weight: number;
}

interface Publication {
  publication_name: string;
  publisher_name: string;
  publisher_id: string;
}

interface Publisher {
  publisher_name: string;
  publisher_id: number;
  type: string;
  notes: string;
}

interface Author {
  name: string;
  author_id: number;
  type: string;
}

interface Relatedsery {
  relation_id: number;
  relation_type: string;
  related_series_id: number;
  related_series_name: string;
  triggered_by_relation_id: number;
}

interface Anime {
  start: string;
  end: string;
}

interface Category {
  series_id: number;
  category: string;
  votes: number;
  votes_plus: number;
  votes_minus: number;
  added_by: number;
}

interface Genre {
  genre: string;
}

interface Image {
  url: Url;
  height: number;
  width: number;
}

interface Url {
  original: string;
  thumb: string;
}

interface Associated {
  title: string;
}

export interface SearchedSeriesResponse {
  total_hits: number;
  page: number;
  per_page: number;
  results: Result[];
}

interface Result {
  record: Record;
  hit_title: string;
  metadata: Metadata;
}

interface Metadata {
  user_list: Userlist;
  user_genre_highlights: Usergenrehighlight[];
}

interface Usergenrehighlight {
  genre: string;
  color: string;
}

interface Userlist {
  series: Series;
  list_id: number;
  list_type: string;
  list_icon: string;
  status: Status;
  priority: number;
  time_added: Lastupdated;
}

interface Status {
  volume: number;
  chapter: number;
}

interface Series {
  id: number;
  title: string;
}

interface Record {
  series_id: number;
  title: string;
  url: string;
  description: string;
  image: Image;
  type: string;
  year: string;
  bayesian_rating: number;
  rating_votes: number;
  genres: Genre[];
  latest_chapter: number;
  rank: Rank;
  last_updated: Lastupdated;
  admin: Admin;
}

interface Admin {
  added_by: Addedby;
  approved: boolean;
}

interface Addedby {
  user_id: number;
  username: string;
  url: string;
  avatar: Avatar;
  time_joined: Lastupdated;
  signature: string;
  forum_title: string;
  folding_at_home: boolean;
  profile: Profile;
  stats: Stats;
  user_group: string;
  user_group_name: string;
}

interface Stats {
  forum_posts: number;
  added_authors: number;
  added_groups: number;
  added_publishers: number;
  added_releases: number;
  added_series: number;
}

interface Position {
  week: number;
  month: number;
  three_months: number;
  six_months: number;
  year: number;
}
