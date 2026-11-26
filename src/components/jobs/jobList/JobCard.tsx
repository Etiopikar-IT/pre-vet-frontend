import { Link } from "react-router-dom";

import CompanyAvatar from "./../CompanyAvatar";
import EmploymentTypeBadge from "./../jobDetail/EmploymentTypeBadge";

export interface JobCardData {
  id: number;
  company_id: number;
  company_name: string;
  company_logo?: string | null;
  title: string;
  location: string;
  employment_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  created_at: string;
}

function formatSalary(job: JobCardData): string {
  const { salary_min, salary_max, salary_currency } = job;

  if (salary_min == null && salary_max == null) return "Salary not specified";

  const fmt = (n: number) => new Intl.NumberFormat().format(n);

  if (salary_min != null && salary_max != null) {
    return `${salary_currency} ${fmt(salary_min)} – ${fmt(salary_max)}`;
  }
  if (salary_min != null) return `${salary_currency} ${fmt(salary_min)}+`;
  return `Up to ${salary_currency} ${fmt(salary_max as number)}`;
}

export default function JobCard({ job }: { job: JobCardData }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface p-4 transition hover:border-brand-300 hover:shadow-sm sm:p-5"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-ink-500">
            {job.company_name || "Unknown company"}
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-ink-800 group-hover:text-brand-600">
            {job.title}
          </h3>
        </div>

        <span className="shrink-0">
          <CompanyAvatar
            name={job.company_name}
            logo={job.company_logo}
            size="sm"
          />
        </span>
      </div>

      <p className="mt-3 truncate text-sm font-medium text-brand-600">
        {formatSalary(job)}
      </p>

      <div className="mt-auto flex min-w-0 flex-wrap items-center gap-2 pt-4">
        <span className="min-w-0 max-w-full shrink">
          <EmploymentTypeBadge type={job.employment_type} />
        </span>

        {job.location && (
          <span className="max-w-full truncate rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600">
            {job.location}
          </span>
        )}
      </div>
    </Link>
  );
}