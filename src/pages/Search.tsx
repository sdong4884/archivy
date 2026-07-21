import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { searchMovies } from "../lib/api/tmdb";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

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

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
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
        <p className="mt-6 text-sm text-gray-400">검색 결과가 없습니다.</p>
      )}

      {movies.length > 0 && (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="flex flex-col">
              <Link
                to={`/movie/${movie.id}`}
                className="block aspect-2/3 overflow-hidden rounded-lg bg-gray-800"
              >
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                    포스터 없음
                  </div>
                )}
              </Link>

              <div className="mt-2 flex items-start justify-between gap-2">
                <Link
                  to={`/movie/${movie.id}`}
                  className="truncate text-sm font-medium text-gray-100"
                >
                  {movie.title}
                </Link>
                <button
                  onClick={() => toggleLike(movie.id)}
                  aria-label="찜하기"
                  className="shrink-0 cursor-pointer"
                >
                  {likedIds.has(movie.id) ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartOutlineIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <p className="mt-6 text-sm text-gray-400">불러오는 중...</p>
      )}
      <div ref={sentinelRef} />
    </div>
  );
}
