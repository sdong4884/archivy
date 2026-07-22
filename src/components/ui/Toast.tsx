import { useToastStore } from "../../store/toastStore";

export function Toast() {
  const message = useToastStore((state) => state.message);

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-100 shadow-lg">
        {message}
      </div>
    </div>
  );
}
