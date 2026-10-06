import JobCard, { type JobCardData } from "./JobCard";
import JobCardSkeleton from "./JobCardSkeleton";

interface JobCardListProps {
  jobs: JobCardData[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function JobCardList({
  jobs,
  loading = false,
  emptyMessage = "No jobs match your search.",
}: JobCardListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-12 text-center">
        <p className="text-sm text-ink-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}