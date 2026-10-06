interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export default function LoadingSpinner({
  label = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex min-h-[calc(100vh-64px)] items-center justify-center bg-page ${className}`}
    >
      <div className="flex items-center gap-3 text-ink-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand-500" />
        {label}
      </div>
    </div>
  );
}