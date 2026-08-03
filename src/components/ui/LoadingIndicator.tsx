interface LoadingIndicatorProps {
  className?: string;
}

export function LoadingIndicator({ className = "" }: LoadingIndicatorProps) {
  return (
    <p
      className={`flex flex-1 items-center justify-center text-sm text-gray-400 ${className}`}
    >
      불러오는 중...
    </p>
  );
}
