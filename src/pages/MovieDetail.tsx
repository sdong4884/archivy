import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getMovieDetail } from "../lib/api/tmdb";
import { useWishlist } from "../hooks/useWishlist";
import { auth, googleProvider } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";

export function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { likedIds, toggleWishlist } = useWishlist();

  const handleModifyClick = async () => {
    if (!user) {
      await signInWithPopup(auth, googleProvider);
      return;
    }
    navigate(`/movie/${id}/modify`);
  };

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetail(Number(id)),
  });

  if (isLoading) {
    return <p className="text-sm text-gray-400">불러오는 중...</p>;
  }

  if (isError || !movie) {
    return (
      <p className="text-sm text-red-400">영화 정보를 불러오지 못했습니다.</p>
    );
  }

  return (
    <div className="relative -m-4 flex-1 overflow-hidden bg-gray-900">
      {movie.backdropUrl && (
        <div className="absolute inset-0">
          <img
            src={movie.backdropUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/90 to-black/80" />
        </div>
      )}

      <div className="relative mx-auto flex max-w-[1000px] flex-col gap-6 p-6 sm:flex-row sm:p-10 lg:px-16">
        <div className="w-40 shrink-0 self-center sm:w-70 sm:self-start">
          <div className="aspect-2/3 overflow-hidden rounded-lg bg-gray-800 shadow-lg">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                포스터 없음
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 text-white">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {movie.title}
            </h1>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() =>
                  toggleWishlist({
                    id: movie.id,
                    title: movie.title,
                    posterUrl: movie.posterUrl,
                  })
                }
                aria-label="찜하기"
                className="cursor-pointer"
              >
                {likedIds.has(movie.id) ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="h-6 w-6 text-white" />
                )}
              </button>
              <button
                type="button"
                onClick={handleModifyClick}
                aria-label="기록하기"
                className="cursor-pointer"
              >
                <PencilSquareIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-300">
            {movie.releaseDate && <span>개봉일 | {movie.releaseDate}</span>}
            <span>평점 | {movie.voteAverage.toFixed(1)}</span>
            {movie.runtime > 0 && <span>러닝타임 | {movie.runtime}분</span>}
          </div>

          {movie.genres.length > 0 && (
            <div className="mt-1 text-sm text-gray-300">
              장르 | {movie.genres.join(" / ")}
            </div>
          )}

          {movie.tagline && (
            <blockquote className="mt-8 text-center text-lg font-medium text-gray-100 italic">
              <span className="mr-1 font-serif text-2xl not-italic text-gray-400">
                &ldquo;
              </span>
              {movie.tagline}
              <span className="ml-1 font-serif text-2xl not-italic text-gray-400">
                &rdquo;
              </span>
            </blockquote>
          )}

          {movie.overview && (
            <p className="mt-8 text-sm leading-relaxed text-gray-300">
              {movie.overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
