import { Link } from "react-router-dom";

interface JobApplyCTAProps {
  jobId: number;
}

export default function JobApplyCTA({ jobId }: JobApplyCTAProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-500">
        Interested in this role? Submit an application.
      </p>

      <Link
        to={`/jobs/${jobId}/apply`}
        className="inline-block rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Apply for this job
      </Link>
    </div>
  );
}