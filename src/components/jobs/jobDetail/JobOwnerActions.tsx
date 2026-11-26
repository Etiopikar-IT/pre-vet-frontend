import { Link } from "react-router-dom";

// interface JobOwnerActionsProps {
//   jobId: number;
// }

export default function JobOwnerActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* <Link
        to={`/company/jobs/${jobId}/applications`}
        className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        View applications
      </Link> */}

      <Link
        to="/company/jobs"
        className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
      >
        Back to my jobs
      </Link>
    </div>
  );
}