import { useState } from "react";
import { Link } from "react-router-dom";

import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBanner from "../../components/common/StatusBanner";
import JobStatusBadge from "../../components/jobs/jobDetail/JobStatusBadge";
import EmploymentTypeBadge from "../../components/jobs/jobDetail/EmploymentTypeBadge";
import ApprovalStatusBadge from "../../components/profile/ApprovalStatusBadge";

interface CompanyProfileData {
  id: string;
  company_name: string;
  logo: string | null;
  banner: string | null;
  description: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
  approval_status?: string;
  rejection_reason?: string;
}

interface CompanyJobItem {
  id: string;
  company: string;
  company_id: string;
  company_name: string;
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

function formatSalary(job: CompanyJobItem): string {
  const { salary_min, salary_max, salary_currency } = job;
  if (salary_min == null && salary_max == null) return "Not specified";

  const fmt = (n: number) => new Intl.NumberFormat().format(n);
  if (salary_min != null && salary_max != null) {
    return `${salary_currency} ${fmt(salary_min)} – ${fmt(salary_max)}`;
  }
  if (salary_min != null) return `${salary_currency} ${fmt(salary_min)}+`;
  return `Up to ${salary_currency} ${fmt(salary_max as number)}`;
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

export default function CompanyJobsPage() {
  const { data: profile, loading: profileLoading } =
    useData<CompanyProfileData>(endpoints.accounts.company);

  const {
    data: jobs,
    loading: jobsLoading,
    error: jobsError,
  } = useData<CompanyJobItem[]>(endpoints.jobs.list);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (profileLoading || jobsLoading) {
    return <LoadingSpinner label="Loading your jobs..." />;
  }

  if (jobsError) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <StatusBanner variant="error">{jobsError}</StatusBanner>
        </div>
      </div>
    );
  }

  const count = jobs?.length ?? 0;
  const coverSrc = profile?.banner || DEFAULT_COVER;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page pb-12">
      {/* ---------- Cover with overlaid company identity ---------- */}
      <div className="relative h-72 w-full overflow-hidden bg-brand-600 sm:h-80 lg:h-96">
        <img
          src={coverSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-800/70 to-brand-600/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%)]" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-5 sm:px-6 sm:pb-8">
            <div className="flex min-w-0 items-end gap-3 sm:gap-5">
              {profile?.logo ? (
                <img
                  src={profile.logo}
                  alt={profile.company_name}
                  className="h-16 w-16 shrink-0 rounded-2xl border-4 border-white/90 object-cover shadow-lg sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-white/90 bg-brand-50 text-2xl font-semibold text-brand-600 shadow-lg sm:h-24 sm:w-24 sm:text-3xl">
                  {profile?.company_name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <div className="min-w-0 flex-1 pb-1">
                <h1 className="truncate text-xl font-bold text-white drop-shadow sm:text-3xl">
                  {profile?.company_name || "Company"}
                </h1>

                {profile?.industry && (
                  <p className="mt-1 truncate text-sm text-white/85 drop-shadow">
                    {profile.industry}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-white/85">
                  {profile?.address && (
                    <span className="inline-flex max-w-full items-center gap-1.5 truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="truncate">{profile.address}</span>
                    </span>
                  )}

                  {profile?.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex max-w-full items-center gap-1.5 truncate transition hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span className="truncate">
                        {profile.website.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                  )}
                </div>

                {profile?.approval_status && (
                  <div className="mt-3">
                    <ApprovalStatusBadge status={profile.approval_status} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Link
                to="/company/jobs/new"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                Post a job
              </Link>

              <Link
                to="/company/profile/edit"
                className="rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Edit profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Content below ---------- */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-ink-800">
              Posted jobs
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {count} {count === 1 ? "job" : "jobs"} listed · Manage
              status and edit postings
            </p>
          </div>
        </div>

        {profile?.approval_status &&
          profile.approval_status !== "APPROVED" && (
            <div
              className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                profile.approval_status === "REJECTED"
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {profile.approval_status === "REJECTED" ? (
                <>
                  Your company profile was rejected. Update it to be
                  re-reviewed before posting new jobs.
                </>
              ) : (
                <>
                  Your company profile is pending approval. Jobs you
                  post will be queued until it's approved.
                </>
              )}
            </div>
          )}

        {count === 0 ? (
          <EmptyState
            title="You haven't posted any jobs yet"
            message="Post your first job to start receiving applications."
            actionLabel="Post a job"
            actionTo="/company/jobs/new"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            }
          />
        ) : (
          <ul className="space-y-3">
            {(jobs ?? []).map((job) => {
              const isExpanded = expandedId === job.id;

              return (
                <li key={job.id} className="min-w-0">
                  <div
                    className={`overflow-hidden rounded-2xl border bg-surface transition ${
                      isExpanded
                        ? "border-brand-300 shadow-sm"
                        : "border-line hover:border-brand-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : job.id)
                      }
                      className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-ink-100/40 sm:gap-4 sm:p-5"
                      aria-expanded={isExpanded}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="min-w-0 truncate text-base font-semibold text-ink-800">
                            {job.title}
                          </h3>
                          <JobStatusBadge status={job.status} />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <EmploymentTypeBadge
                            type={job.employment_type}
                          />

                          {job.location && (
                            <span className="max-w-full truncate rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600">
                              {job.location}
                            </span>
                          )}

                          <span className="text-[11px] text-ink-400">
                            Posted {formatDate(job.created_at)}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full bg-ink-100 p-2 text-ink-500 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-line bg-page/40 p-4 sm:p-6">
                        {job.status === "REJECTED" &&
                          job.rejection_reason && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                              <span className="font-medium">
                                Rejection reason:
                              </span>{" "}
                              {job.rejection_reason}
                            </div>
                          )}

                        <dl className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                          <Fact
                            label="Salary"
                            value={formatSalary(job)}
                          />
                          <Fact
                            label="Deadline"
                            value={
                              job.application_deadline
                                ? formatDate(job.application_deadline)
                                : "Open until filled"
                            }
                          />
                          <Fact
                            label="Type"
                            value={job.employment_type.replace("_", " ")}
                          />
                          <Fact
                            label="Updated"
                            value={formatDate(job.updated_at)}
                          />
                        </dl>

                        {job.description && (
                          <ExpandedSection title="About the role">
                            <p className="whitespace-pre-line break-words text-sm leading-relaxed text-ink-600">
                              {job.description}
                            </p>
                          </ExpandedSection>
                        )}

                        {job.responsibilities && (
                          <ExpandedSection title="Responsibilities">
                            <p className="whitespace-pre-line break-words text-sm leading-relaxed text-ink-600">
                              {job.responsibilities}
                            </p>
                          </ExpandedSection>
                        )}

                        {job.requirements && (
                          <ExpandedSection title="Requirements">
                            <p className="whitespace-pre-line break-words text-sm leading-relaxed text-ink-600">
                              {job.requirements}
                            </p>
                          </ExpandedSection>
                        )}

                        <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
                          {/* <Link
                            to={`/jobs/${job.id}`}
                            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                          >
                            View public posting
                          </Link> */}

                          {/* <Link
                            to={`/company/jobs/${job.id}/applications`}
                            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
                          >
                            View applications
                          </Link> */}

                          <Link
                            to={`/company/jobs/${job.id}/edit`}
                            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
                          >
                            Edit job
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-ink-800">
        {value}
      </dd>
    </div>
  );
}

function ExpandedSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 min-w-0 last:mb-0">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
        {title}
      </h3>
      {children}
    </div>
  );
}