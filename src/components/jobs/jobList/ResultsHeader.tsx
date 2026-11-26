interface ResultsHeaderProps {
  count: number;
  loading?: boolean;
}

export default function ResultsHeader({ count, loading }: ResultsHeaderProps) {
  return (
    <h2 className="break-words text-sm font-semibold text-ink-800 sm:text-base">
      {loading
        ? "Searching..."
        : `Showing ${count} job ${count === 1 ? "result" : "results"}`}
    </h2>
  );
}