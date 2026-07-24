import { useRef, useState } from "react";
import {
  Navigate,
  useBlocker,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { getMovieDetail } from "../lib/api/tmdb";
import { getEntry, saveEntry } from "../lib/entries";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import type { Entry, MovieDetail } from "../types/movie";

function clampRating(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.round(Math.min(Math.max(value, 0), 5) * 10) / 10;
}

export function MovieModify() {
  const { id } = useParams();
  const movieId = Number(id);
  const user = useAuthStore((state) => state.user);

  const { data: movie } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetail(movieId),
  });

  const { data: existingEntry, isLoading: isEntryLoading } = useQuery({
    queryKey: ["entry", user?.uid, movieId],
    queryFn: () => getEntry(user!.uid, movieId),
    enabled: !!user,
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!movie || isEntryLoading) {
    return <p className="text-sm text-gray-400">불러오는 중...</p>;
  }

  return (
    <MovieModifyForm uid={user.uid} movie={movie} existingEntry={existingEntry ?? null} />
  );
}

interface MovieModifyFormProps {
  uid: string;
  movie: MovieDetail;
  existingEntry: Entry | null;
}

function MovieModifyForm({ uid, movie, existingEntry }: MovieModifyFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);

  const initial = {
    rating: existingEntry?.rating ?? 0,
    comment: existingEntry?.comment ?? "",
  };

  const [rating, setRating] = useState(initial.rating);
  const [comment, setComment] = useState(initial.comment);
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);
  // ref(값이 바뀔 때 리렌더를 유발할 필요가 없고, useBlocker의 판단 함수가
  // 항상 "가장 최근에 저장된 값"을 즉시 읽을 수 있어야 하므로 state 대신 ref 사용)
  const savedInitialRef = useRef(initial);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (rating !== savedInitialRef.current.rating ||
        comment !== savedInitialRef.current.comment) &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  const handleSave = async () => {
    const entry: Entry = {
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      rating,
      comment,
    };
    try {
      await saveEntry(uid, entry);
    } catch {
      setIsSaveConfirmOpen(false);
      showToast("기록 저장에 실패했습니다.");
      return;
    }
    queryClient.setQueryData(["entry", uid, movie.id], entry);
    savedInitialRef.current = { rating, comment };
    setIsSaveConfirmOpen(false);
    showToast("기록이 저장되었습니다.");
    navigate("/");
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="flex items-center gap-4">
        <div className="w-24 shrink-0 overflow-hidden rounded bg-gray-800">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="aspect-2/3 h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-2/3 items-center justify-center text-[10px] text-gray-500">
              포스터 없음
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-100">
            {movie.title}
          </h1>
          {movie.genres.length > 0 && (
            <p className="mt-1 text-sm text-gray-400">
              {movie.genres.join(" / ")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-300">
          별점
        </label>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const fillPercent =
                Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
              return (
                <div key={star} className="relative h-7 w-7">
                  <StarOutlineIcon className="absolute inset-0 h-7 w-7 text-gray-600" />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${fillPercent}%` }}
                  >
                    <StarSolidIcon className="h-7 w-7 text-yellow-400" />
                  </div>
                </div>
              );
            })}
          </div>
          <input
            type="number"
            step={0.1}
            min={0}
            max={5}
            value={rating}
            onChange={(event) =>
              setRating(clampRating(event.target.valueAsNumber))
            }
            placeholder="0.0"
            className="w-16 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-100 [appearance:textfield] focus:border-gray-500 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-300">
          코멘트
        </label>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={6}
          placeholder="이 영화에 대한 생각을 남겨보세요"
          className="mt-2 w-full resize-none rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-gray-500 focus:outline-none"
        />
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer rounded border border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          취소
        </button>
        <button
          onClick={() => setIsSaveConfirmOpen(true)}
          className="cursor-pointer rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-white"
        >
          저장
        </button>
      </div>

      <ConfirmModal
        open={blocker.state === "blocked"}
        message="기록을 중단하시겠습니까?"
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />

      <ConfirmModal
        open={isSaveConfirmOpen}
        message="기록을 저장하시겠습니까?"
        onConfirm={handleSave}
        onCancel={() => setIsSaveConfirmOpen(false)}
      />
    </div>
  );
}
