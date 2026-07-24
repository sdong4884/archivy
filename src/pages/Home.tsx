import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  ArchiveBoxXMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { getEntries } from "../lib/entries";
import { useAuthStore } from "../store/authStore";

type SortOption = "latest" | "ratingDesc";

function ratingBadgeClasses(rating: number): string {
  if (rating <= 2) {
    return "bg-gray-500/15 text-gray-300 border-gray-500/40";
  }
  if (rating <= 3) {
    return "bg-sky-500/15 text-sky-300 border-sky-500/40";
  }
  if (rating <= 4) {
    return "bg-purple-500/15 text-purple-300 border-purple-500/40";
  }
  return "bg-pink-500/15 text-pink-300 border-pink-500/40";
}

export function Home() {
  const user = useAuthStore((state) => state.user);

  const {
    data: entries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["entries", user?.uid],
    queryFn: () => getEntries(user!.uid),
    enabled: !!user,
  });

  const [sortOption, setSortOption] = useState<SortOption>("latest");

  const sortedEntries = useMemo(() => {
    if (!entries) return entries;
    if (sortOption === "latest") return entries;
    return [...entries].sort((a, b) => b.rating - a.rating);
  }, [entries, sortOption]);

  if (!user) {
    return (
      <div className="flex flex-1 flex-col gap-2 items-center justify-center text-sm text-gray-400">
        <p>서비스 이용을 위해서는 로그인이 필요합니다.</p>
        <p>로그인하고, 기록을 남겨보세요.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-sm text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-sm text-red-400">
        기록을 불러오지 못했습니다.
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400">
        <ArchiveBoxXMarkIcon className="h-12 w-12" />
        <p className="text-sm">기록이 아직 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 inline-flex rounded-lg border border-gray-800 bg-gray-800/50 p-1">
        <button
          type="button"
          onClick={() => setSortOption("latest")}
          className={`cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            sortOption === "latest"
              ? "bg-gray-700 text-gray-100"
              : "text-gray-400"
          }`}
        >
          최신순
        </button>
        <button
          type="button"
          onClick={() => setSortOption("ratingDesc")}
          className={`cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            sortOption === "ratingDesc"
              ? "bg-gray-700 text-gray-100"
              : "text-gray-400"
          }`}
        >
          별점 높은순
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(sortedEntries ?? []).map((entry) => (
          <div
            key={entry.id}
            className="flex gap-4 rounded-lg border border-gray-800 bg-gray-800/50 p-3 sm:gap-6 sm:p-4"
          >
            <Link
              to={`/movie/${entry.id}`}
              className="w-20 shrink-0 overflow-hidden rounded bg-gray-800 sm:w-28"
            >
              {entry.posterUrl ? (
                <img
                  src={entry.posterUrl}
                  alt={entry.title}
                  className="aspect-2/3 h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-2/3 items-center justify-center text-[10px] text-gray-500">
                  포스터 없음
                </div>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <Link
                  to={`/movie/${entry.id}`}
                  className="truncate text-base font-semibold text-gray-100 sm:text-lg"
                >
                  {entry.title}
                </Link>
                <Link
                  to={`/movie/${entry.id}/modify`}
                  aria-label="수정하기"
                  className="shrink-0 cursor-pointer"
                >
                  <PencilSquareIcon className="h-5 w-5 text-gray-400" />
                </Link>
              </div>

              <div
                className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${ratingBadgeClasses(entry.rating)}`}
              >
                <StarIcon className="h-3.5 w-3.5" />
                <span>{entry.rating.toFixed(1)}</span>
              </div>

              {entry.comment && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300 wrap-break-word">
                  {entry.comment}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
