import { Link, useParams } from "react-router-dom";

import { useDetail } from "../../hooks/useDetail";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBanner from "../../components/common/StatusBanner";
import BackLink from "../../components/jobs/BackLink";
import ApplicationStatusBadge from "../../components/jobs/applications/ApplicationsStatusBadge";

interface ApplicationDetail {
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

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

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

function statusCopy(status: string): string {
  switch (status) {
    case "ACCEPTED":
      return "Your application was accepted — the company would like to move forward.";
    case "REJECTED":
      return "The company has decided not to move forward with this application.";
    case "REVIEWED":
      return "Your application is currently being reviewed.";
    case "SUBMITTED":
    default:
      return "Your application has been received and is awaiting review.";
  }
}

export default function JobSeekerApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: application,
    loading,
    error,
  } = useDetail<ApplicationDetail>(endpoints.applications.list, id);

  if (loading) return <LoadingSpinner label="Loading application..." />;

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <StatusBanner variant="error">{error}</StatusBanner>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Application not found"
            message="This application may have been removed or you don't have access to it."
            actionLabel="Back to applications"
            actionTo="/applications"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page pb-12">
      {/* ---------- Cover with overlaid identity ---------- */}
      <div className="relative h-56 w-full overflow-hidden bg-brand-600 sm:h-64 lg:h-72">
        <img
          src={DEFAULT_COVER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-800/70 to-brand-600/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%)]" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
            {/* Left: icon + job title + company */}
            <div className="flex items-end gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-white/90 bg-brand-50 text-brand-600 shadow-lg sm:h-20 sm:w-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>
              </div>

              <div className="min-w-0 pb-1">
                <h1 className="truncate text-2xl font-bold text-white drop-shadow sm:text-3xl">
                  {application.job_title}
                </h1>

                <p className="mt-1 truncate text-sm text-white/85 drop-shadow">
                  {application.company_name}
                </p>

                <div className="mt-3">
                  <ApplicationStatusBadge status={application.status} />
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to={`/jobs/${application.job}`}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                View job posting
              </Link>

              <Link
                to="/applications"
                className="rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                All applications
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Content below ---------- */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <div className="mb-6">
          <BackLink to="/applications" label="Back to applications" />
        </div>

        {/* Status summary card */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink-500">
            Status
          </h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-ink-600">
              {statusCopy(application.status)}
            </p>

            <ApplicationStatusBadge
              status={application.status}
              className="self-start sm:self-auto"
            />
          </div>

          <dl className="mt-6 grid gap-5 border-t border-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                Applied on
              </dt>
              <dd className="mt-1 text-sm text-ink-800">
                {formatDate(application.created_at)}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                Last updated
              </dt>
              <dd className="mt-1 text-sm text-ink-800">
                {formatDate(application.updated_at)}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                Applicant
              </dt>
              <dd className="mt-1 text-sm text-ink-800">
                {application.job_seeker_name || "You"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Cover letter card */}
        <div className="mt-6 rounded-2xl border border-line bg-surface p-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-800">
            Your cover letter
          </h2>

          {application.cover_letter ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
              {application.cover_letter}
            </p>
          ) : (
            <p className="text-sm italic text-ink-400">
              No cover letter was submitted.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}