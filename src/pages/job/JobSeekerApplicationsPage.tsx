import { Link, useLocation } from "react-router-dom";

import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBanner from "../../components/common/StatusBanner";
import ApplicationsList from "../../components/jobs/applications/ApplicationList";
import type { ApplicationListItem } from "../../components/jobs/applications/ApplicationsCard";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

export default function JobSeekerApplicationsPage() {
  const location = useLocation();
  const state = location.state as { message?: string } | null;

  const {
    data: applications,
    loading,
    error,
  } = useData<ApplicationListItem[]>(endpoints.applications.list);

  if (loading) {
    return <LoadingSpinner label="Loading applications..." />;
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <StatusBanner variant="error">{error}</StatusBanner>
        </div>
      </div>
    );
  }

  const list = applications ?? [];
  const count = list.length;

  const submitted = list.filter((a) => a.status === "SUBMITTED").length;
  const reviewed = list.filter((a) => a.status === "REVIEWED").length;
  const accepted = list.filter((a) => a.status === "ACCEPTED").length;
  const rejected = list.filter((a) => a.status === "REJECTED").length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page pb-12">
      {/* ---------- Cover with overlaid page identity ---------- */}
      <div className="relative h-56 w-full overflow-hidden bg-brand-600 sm:h-64 lg:h-72">
        <img
          src={DEFAULT_COVER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-800/70 to-brand-600/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%)]" />

        {/* Overlay content */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
            {/* Left: title + subtitle */}
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
                  My applications
                </h1>

                <p className="mt-1 text-sm text-white/85 drop-shadow">
                  {count} {count === 1 ? "application" : "applications"}{" "}
                  · Track your progress and stay on top of responses
                </p>

                {/* Mini status summary */}
                {count > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/85">
                    {submitted > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-300" />
                        {submitted} submitted
                      </span>
                    )}
                    {reviewed > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-brand-200" />
                        {reviewed} in review
                      </span>
                    )}
                    {accepted > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-300" />
                        {accepted} accepted
                      </span>
                    )}
                    {rejected > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-300" />
                        {rejected} rejected
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to="/jobs"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                Browse jobs
              </Link>

              <Link
                to="/job-seeker/profile"
                className="rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                View profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Content below ---------- */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        {state?.message && (
          <StatusBanner variant="success" className="mb-5">
            {state.message}
          </StatusBanner>
        )}

        {count === 0 ? (
          <EmptyState
            title="No applications yet"
            message="When you apply for a job, it will appear here."
            actionLabel="Browse jobs"
            actionTo="/jobs"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="13" y2="17" />
              </svg>
            }
          />
        ) : (
          <ApplicationsList applications={list} />
        )}
      </div>
    </div>
  );
}