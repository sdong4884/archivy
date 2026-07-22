import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { WishlistItem } from "../types/movie";

function wishlistCollection(uid: string) {
  return collection(db, "users", uid, "wishlist");
}

export async function addToWishlist(
  uid: string,
  movie: WishlistItem,
): Promise<void> {
  await setDoc(doc(wishlistCollection(uid), String(movie.id)), {
    id: movie.id,
    title: movie.title,
    posterUrl: movie.posterUrl,
    addedAt: serverTimestamp(),
  });
}

export async function removeFromWishlist(
  uid: string,
  movieId: number,
): Promise<void> {
  await deleteDoc(doc(wishlistCollection(uid), String(movieId)));
}

export async function getWishlist(uid: string): Promise<WishlistItem[]> {
  const snapshot = await getDocs(
    query(wishlistCollection(uid), orderBy("addedAt", "desc")),
  );
  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data();
    return {
      id: data.id,
      title: data.title,
      posterUrl: data.posterUrl,
    };
  });
}
