interface ResultsHeaderProps {
  count: number;
  loading?: boolean;
}

export default function ResultsHeader({ count, loading }: ResultsHeaderProps) {
  return (
    <h2 className="text-base font-semibold text-ink-800">
      {loading
        ? "Searching..."
        : `Showing ${count} job ${count === 1 ? "result" : "results"}`}
    </h2>
  );
}