export interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
}

export interface MovieDetail {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  runtime: number;
  voteAverage: number;
  genres: string[];
}

export interface WishlistItem {
  id: number;
  title: string;
  posterUrl: string | null;
}

export interface Entry {
  id: number;
  title: string;
  posterUrl: string | null;
  rating: number;
  comment: string;
}
