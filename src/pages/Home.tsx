import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StarIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getEntries } from "../lib/entries";
import { useAuthStore } from "../store/authStore";

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

  if (!user) {
    return <p className="text-sm text-gray-400">로그인이 필요합니다.</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-gray-400">불러오는 중...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-400">기록을 불러오지 못했습니다.</p>
    );
  }

  if (!entries || entries.length === 0) {
    return <p className="text-sm text-gray-400">기록한 영화가 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {entries.map((entry) => (
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
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {entry.comment}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
