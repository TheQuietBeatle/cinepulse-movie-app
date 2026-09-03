export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: 'movie' | 'series' | 'episode' | string;
  Poster: string;
}

export interface MovieRating {
  Source: string;
  Value: string;
}

export interface MovieDetails extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: MovieRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  totalSeasons?: string;
}

export interface OmdbSearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

export type ContentType = 'all' | 'movie' | 'series' | 'episode';
export type SortOption = 'relevance' | 'year-desc' | 'year-asc' | 'title-asc';

export interface FilterCriteria {
  type: ContentType;
  year?: string;
  sortBy: SortOption;
}
