import { useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useDetail } from "../../hooks/useDetail";
import { endpoints } from "../../api/endpoints";

import BackLink from "../../components/jobs/BackLink";
import JobSection from "../../components/jobs/JobSection";
import JobDetailHeader from "../../components/jobs/jobDetail/JobDetailHeader";
import JobApplyCTA from "../../components/jobs/jobDetail/JobApplyCTA";
import JobOwnerActions from "../../components/jobs/jobDetail/JobOwnerActions";

interface JobDetail {
  id: number;
  company: number;
  company_name: string;
  company_logo?: string | null;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  employment_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  application_deadline: string | null;
  status: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

function formatSalary(job: JobDetail): string {
  const { salary_min, salary_max, salary_currency } = job;

  if (salary_min == null && salary_max == null) return "Not specified";

  const fmt = (n: number) => new Intl.NumberFormat().format(n);

  if (salary_min != null && salary_max != null) {
    return `${salary_currency} ${fmt(salary_min)} – ${fmt(salary_max)}`;
  }
  if (salary_min != null) return `${salary_currency} ${fmt(salary_min)}+`;
  return `Up to ${salary_currency} ${fmt(salary_max as number)}`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: job, loading, error } = useDetail<JobDetail>(
    endpoints.jobs.list,
    id,
  );

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-page">
        <div className="flex items-center gap-3 text-ink-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand-500" />
          Loading job...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-line bg-surface p-12 text-center">
            <h2 className="text-lg font-semibold text-ink-800">
              Job not found
            </h2>
            <div className="mt-5">
              <BackLink to="/jobs" label="Back to jobs" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwner =
    user?.user_type === "COMPANY" && user.company_id === job.company;

  const canApply =
    job.status === "PUBLISHED" && user?.user_type === "JOB_SEEKER";

  let actions = null;
  if (canApply) {
    actions = <JobApplyCTA jobId={job.id} />;
  } else if (isOwner) {
    actions = <JobOwnerActions jobId={job.id} />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <BackLink to="/jobs" label="Back to jobs" />
        </div>

        <JobDetailHeader
          companyName={job.company_name}
          companyLogo={job.company_logo}
          title={job.title}
          location={job.location}
          employmentType={job.employment_type}
          status={job.status}
          salary={formatSalary(job)}
          deadline={
            job.application_deadline
              ? formatDate(job.application_deadline)
              : "Open until filled"
          }
          posted={formatDate(job.created_at)}
          rejectionReason={job.rejection_reason}
          actions={actions}
        />

        {job.description && (
          <JobSection title="About the role">
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
              {job.description}
            </p>
          </JobSection>
        )}

        {job.responsibilities && (
          <JobSection title="Responsibilities">
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
              {job.responsibilities}
            </p>
          </JobSection>
        )}

        {job.requirements && (
          <JobSection title="Requirements">
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
              {job.requirements}
            </p>
          </JobSection>
        )}

        <p className="mt-8 text-center text-xs text-ink-400">
          Posted {formatDate(job.created_at)}
        </p>
      </div>
    </div>
  );
}