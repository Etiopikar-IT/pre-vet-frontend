import { Link } from "react-router-dom";

import ApplicationStatusBadge from "./ApplicationsStatusBadge";

export interface ApplicationListItem {
  id: number;
  job: number;
  job_title: string;
  company_name: string;
  job_seeker_name: string;
  cover_letter: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ApplicationCardProps {
  application: ApplicationListItem;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApplicationCard({
  application,
}: ApplicationCardProps) {
  return (
    <Link
      to={`/applications/${application.id}`}
      className="block rounded-2xl border border-line bg-surface p-6 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-ink-800">
            {application.job_title}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {application.company_name}
          </p>
          <p className="mt-3 text-xs text-ink-400">
            Applied {formatDate(application.created_at)}
          </p>
        </div>

        <ApplicationStatusBadge status={application.status} />
      </div>
    </Link>
  );
}