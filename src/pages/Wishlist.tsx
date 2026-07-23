import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";
import { useWishlist } from "../hooks/useWishlist";
import { MovieCard } from "../components/movie/MovieCard";

export function Wishlist() {
  const user = useAuthStore((state) => state.user);
  const { wishlist, isLoading, likedIds, toggleWishlist } = useWishlist();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-sm text-gray-400">
        로그인이 필요합니다.
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

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400">
        <ArchiveBoxXMarkIcon className="h-12 w-12" />
        <p className="text-sm">찜한 영화가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-6">
      {wishlist.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isLiked={likedIds.has(movie.id)}
          onToggleLike={() => toggleWishlist(movie)}
        />
      ))}
    </div>
  );
}
