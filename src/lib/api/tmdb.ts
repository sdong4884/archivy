import type { Movie } from "../../types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w342";

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
