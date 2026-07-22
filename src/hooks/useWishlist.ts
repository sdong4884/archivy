import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { addToWishlist, getWishlist, removeFromWishlist } from "../lib/wishlist";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import type { WishlistItem } from "../types/movie";

export function useWishlist() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist", user?.uid],
    queryFn: () => getWishlist(user!.uid),
    enabled: !!user,
  });

  const likedIds = new Set((wishlist ?? []).map((item) => item.id));

  const mutation = useMutation({
    mutationFn: async ({
      movie,
      wasLiked,
    }: {
      movie: WishlistItem;
      wasLiked: boolean;
    }) => {
      if (!user) {
        await signInWithPopup(auth, googleProvider);
        return;
      }
      if (wasLiked) {
        await removeFromWishlist(user.uid, movie.id);
      } else {
        await addToWishlist(user.uid, movie);
      }
    },
    onSuccess: (_result, { wasLiked }) => {
      if (!user) return;
      queryClient.invalidateQueries({ queryKey: ["wishlist", user.uid] });
      showToast(
        wasLiked ? "찜 목록에서 삭제되었습니다." : "찜 목록에 추가되었습니다.",
      );
    },
    onError: () => {
      showToast("찜하기에 실패했습니다.");
    },
  });

  const toggleWishlist = (movie: WishlistItem) => {
    mutation.mutate({ movie, wasLiked: likedIds.has(movie.id) });
  };

  return { wishlist: wishlist ?? [], isLoading, likedIds, toggleWishlist };
}
