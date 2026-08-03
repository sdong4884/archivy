import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Entry } from "../types/movie";

interface EntryDoc {
  id: number;
  title: string;
  posterUrl: string | null;
  rating: number;
  comment: string;
}

function entriesCollection(uid: string) {
  return collection(db, "users", uid, "entries");
}

function entryDoc(uid: string, movieId: number) {
  return doc(entriesCollection(uid), String(movieId));
}

export async function getEntries(uid: string): Promise<Entry[]> {
  const snapshot = await getDocs(
    query(entriesCollection(uid), orderBy("updatedAt", "desc")),
  );
  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as EntryDoc;
    return {
      id: data.id,
      title: data.title,
      posterUrl: data.posterUrl,
      rating: data.rating,
      comment: data.comment,
    };
  });
}

export async function getEntry(
  uid: string,
  movieId: number,
): Promise<Entry | null> {
  const snapshot = await getDoc(entryDoc(uid, movieId));
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as EntryDoc;
  return {
    id: data.id,
    title: data.title,
    posterUrl: data.posterUrl,
    rating: data.rating,
    comment: data.comment,
  };
}

export async function saveEntry(uid: string, entry: Entry): Promise<void> {
  if (entry.rating <= 0 || entry.comment.trim().length === 0) {
    throw new Error("별점과 코멘트는 필수입니다.");
  }
  await setDoc(entryDoc(uid, entry.id), {
    id: entry.id,
    title: entry.title,
    posterUrl: entry.posterUrl,
    rating: entry.rating,
    comment: entry.comment,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEntry(uid: string, movieId: number): Promise<void> {
  await deleteDoc(entryDoc(uid, movieId));
}
