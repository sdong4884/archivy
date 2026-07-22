import { Link } from "react-router-dom";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    posterUrl: string | null;
  };
  isLiked: boolean;
  onToggleLike: () => void;
}

export function MovieCard({ movie, isLiked, onToggleLike }: MovieCardProps) {
  return (
    <div className="flex flex-col">
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
          onClick={onToggleLike}
          aria-label="찜하기"
          className="shrink-0 cursor-pointer"
        >
          {isLiked ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartOutlineIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}
