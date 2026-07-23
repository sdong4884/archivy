import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchMovies } from "../lib/api/tmdb";
import { useWishlist } from "../hooks/useWishlist";
import { MovieCard } from "../components/movie/MovieCard";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const { likedIds, toggleWishlist } = useWishlist();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, {
      replace: true,
    });
  }, [debouncedQuery, setSearchParams]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["movies", debouncedQuery],
    queryFn: ({ pageParam }) => searchMovies(debouncedQuery, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: debouncedQuery.length > 0,
  });

  const movies = data?.pages.flatMap((page) => page.movies) ?? [];

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="영화 제목을 검색하세요"
        className="w-full rounded border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus:border-gray-500 focus:outline-none"
      />

      {isLoading && <p className="mt-6 text-sm text-gray-400">검색 중...</p>}
      {isError && (
        <p className="mt-6 text-sm text-red-400">검색에 실패했습니다.</p>
      )}
      {!isLoading && debouncedQuery && movies.length === 0 && (
        <p className="flex flex-1 flex-col items-center justify-center mt-6 text-sm text-gray-400">
          검색 결과가 없습니다.
        </p>
      )}

      {movies.length > 0 && (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isLiked={likedIds.has(movie.id)}
              onToggleLike={() => toggleWishlist(movie)}
            />
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <p className="mt-6 text-sm text-gray-400">불러오는 중...</p>
      )}
      <div ref={sentinelRef} />
    </>
  );
}
