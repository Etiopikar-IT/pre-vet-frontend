export default function JobCardSkeleton() {
  return (
    <div className="h-full animate-pulse rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-24 rounded bg-ink-100" />
          <div className="mt-2 h-4 w-40 rounded bg-ink-100" />
        </div>
        <div className="h-10 w-10 rounded-lg bg-ink-100" />
      </div>

      <div className="mt-4 h-3 w-32 rounded bg-ink-100" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-ink-100" />
        <div className="h-3 w-3/4 rounded bg-ink-100" />
      </div>

      <div className="mt-5 flex gap-2">
        <div className="h-6 w-20 rounded-full bg-ink-100" />
        <div className="h-6 w-24 rounded-full bg-ink-100" />
      </div>
    </div>
  );
}