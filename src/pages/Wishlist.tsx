import { useAuthStore } from "../store/authStore";
import { useWishlist } from "../hooks/useWishlist";
import { MovieCard } from "../components/movie/MovieCard";

export function Wishlist() {
  const user = useAuthStore((state) => state.user);
  const { wishlist, isLoading, likedIds, toggleWishlist } = useWishlist();

  if (!user) {
    return <p className="text-sm text-gray-400">로그인이 필요합니다.</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-gray-400">불러오는 중...</p>;
  }

  if (wishlist.length === 0) {
    return <p className="text-sm text-gray-400">찜한 영화가 없습니다.</p>;
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
