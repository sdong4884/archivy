interface ConfirmModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
        <p className="text-sm text-gray-100">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded border border-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-700"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-white"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
