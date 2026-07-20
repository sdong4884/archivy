import type { Movie, MovieDetail } from "../../types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w342";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

interface TmdbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
}

interface TmdbSearchResponse {
  results: TmdbMovieResult[];
  page: number;
  total_pages: number;
}

export interface MovieSearchPage {
  movies: Movie[];
  page: number;
  totalPages: number;
}

function normalizeMovie(raw: TmdbMovieResult): Movie {
  return {
    id: raw.id,
    title: raw.title,
    posterUrl: raw.poster_path ? `${POSTER_BASE_URL}${raw.poster_path}` : null,
  };
}

export async function searchMovies(
  query: string,
  page: number,
): Promise<MovieSearchPage> {
  const url = new URL(`${TMDB_BASE_URL}/search/movie`);
  url.searchParams.set("query", query);
  url.searchParams.set("language", "ko-KR");
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("영화 검색에 실패했습니다.");
  }

  const data: TmdbSearchResponse = await response.json();
  return {
    movies: data.results.map(normalizeMovie),
    page: data.page,
    totalPages: data.total_pages,
  };
}

interface TmdbMovieDetailResponse {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const url = new URL(`${TMDB_BASE_URL}/movie/${id}`);
  url.searchParams.set("language", "ko-KR");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("영화 정보를 불러오지 못했습니다.");
  }

  const data: TmdbMovieDetailResponse = await response.json();
  return {
    id: data.id,
    title: data.title,
    tagline: data.tagline,
    overview: data.overview,
    posterUrl: data.poster_path ? `${POSTER_BASE_URL}${data.poster_path}` : null,
    backdropUrl: data.backdrop_path
      ? `${BACKDROP_BASE_URL}${data.backdrop_path}`
      : null,
    releaseDate: data.release_date,
    runtime: data.runtime,
    voteAverage: data.vote_average,
    genres: data.genres.map((genre) => genre.name),
  };
}
