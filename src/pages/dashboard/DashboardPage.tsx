import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBanner from "../../components/common/StatusBanner";
import JobStatusBadge from "../../components/jobs/jobDetail/JobStatusBadge";
import ApplicationStatusBadge from "../../components/jobs/applications/ApplicationsStatusBadge";

/* ---------- Types ---------- */
interface JobItem {
  id: number;
  title: string;
  status: string;
  location: string;
  created_at: string;
}

interface ApplicationItem {
  id: number;
  job: number;
  job_title: string;
  company_name: string;
  status: string;
  created_at: string;
}

interface ProfileShape {
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  professional_title?: string;
  about?: string;
  skills?: string;
  education?: string;
  experience?: string;
  cv?: string | null;
  company_name?: string;
  description?: string;
  industry?: string;
  website?: string;
  address?: string;
  approval_status?: string;
}

/* ---------- Accent palette ---------- */
type Accent = "blue" | "emerald" | "amber" | "rose" | "purple";

const ACCENTS: Record<
  Accent,
  { bg: string; text: string; ring: string; icon: string }
> = {
  blue: {
    bg: "bg-brand-50",
    text: "text-brand-700",
    ring: "ring-brand-100",
    icon: "text-brand-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-100",
    icon: "text-emerald-500",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-100",
    icon: "text-amber-500",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-100",
    icon: "text-rose-500",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-100",
    icon: "text-purple-500",
  },
};

/* ---------- Stat card ---------- */
function StatCard({
  label,
  value,
  hint,
  accent,
  icon,
  to,
}: {
  label: string;
  value: number | string;
  hint?: string;
  accent: Accent;
  icon: React.ReactNode;
  to?: string;
}) {
  const a = ACCENTS[accent];

  const inner = (
    <div
      className={`rounded-2xl border border-line bg-surface p-5 ring-1 ${a.ring} transition hover:-translate-y-0.5 hover:shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-ink-800">{value}</p>
          {hint && (
            <p className="mt-1 truncate text-xs text-ink-500">{hint}</p>
          )}
        </div>

        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.bg} ${a.icon}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
}

/* ---------- Small stat (secondary row) ---------- */
function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: Accent;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-semibold ${a.text}`}>{value}</p>
    </div>
  );
}

/* ---------- Icons ---------- */
const Icons = {
  Briefcase: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  File: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Clock: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Check: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Users: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Star: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Sparkle: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
    </svg>
  ),
};

/* ---------- News items ---------- */
const NEWS_ITEMS = [
  {
    id: 1,
    category: "Career",
    title: "5 questions to ask in your next interview",
    excerpt: "Good questions signal curiosity and preparation.",
    accent: "blue" as Accent,
  },
  {
    id: 2,
    category: "Hiring",
    title: "Writing a job post that attracts great candidates",
    excerpt: "Clear titles and honest salary ranges double applicant quality.",
    accent: "emerald" as Accent,
  },
  {
    id: 3,
    category: "Trends",
    title: "Remote work in 2026: what's actually changing",
    excerpt: "Hybrid isn't dead, but the details have shifted.",
    accent: "purple" as Accent,
  },
];

/* ---------- Component ---------- */
export default function DashboardPage() {
  const { user, loading } = useAuth();

  const isCompany = user?.user_type === "COMPANY";

  const { data: jobs, loading: jobsLoading } = useData<JobItem[]>(
    endpoints.jobs.list,
  );

  const { data: applications, loading: appsLoading } =
    useData<ApplicationItem[]>(endpoints.applications.list);

  const profileUrl = isCompany
    ? endpoints.accounts.company
    : endpoints.accounts.jobSeeker;
  const { data: profile, loading: profileLoading } =
    useData<ProfileShape>(profileUrl);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (!user) return <Navigate to="/login" replace />;

  /* ---------- Derived stats ---------- */
  const totalJobs = jobs?.length ?? 0;
  const pendingJobs =
    jobs?.filter((j) => j.status === "PENDING").length ?? 0;
  const publishedJobs =
    jobs?.filter((j) => j.status === "PUBLISHED").length ?? 0;
  const rejectedJobs =
    jobs?.filter((j) => j.status === "REJECTED").length ?? 0;

  const totalApplications = applications?.length ?? 0;
  const reviewedApplications =
    applications?.filter((a) => a.status === "REVIEWED").length ?? 0;
  const acceptedApplications =
    applications?.filter((a) => a.status === "ACCEPTED").length ?? 0;
  const rejectedApplications =
    applications?.filter((a) => a.status === "REJECTED").length ?? 0;

  /* ---------- Profile completion ---------- */
  const completionFields: (keyof ProfileShape)[] = [
    "first_name",
    "last_name",
    "phone",
    "location",
    "professional_title",
    "about",
    "skills",
    "education",
    "experience",
    "cv",
  ];

  const filledFields = completionFields.filter((key) => {
    const value = profile?.[key];
    return typeof value === "string" ? value.trim() !== "" : Boolean(value);
  }).length;

  const completionPct = Math.round(
    (filledFields / completionFields.length) * 100,
  );

  /* ---------- Recent activity (max 3) ---------- */
  const recentActivity = isCompany
    ? (jobs ?? []).slice(0, 3)
    : (applications ?? []).slice(0, 3);

  const isBusy = jobsLoading || appsLoading || profileLoading;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Greeting */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink-800">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">{user.email}</p>
        </div>

        <Link
          to={isCompany ? "/company/jobs/new" : "/jobs"}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
        >
          {isCompany ? "Post a new job" : "Find jobs"}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Missing profile banner */}
      {!profileLoading && !profile && (
        <StatusBanner variant="warning" className="mb-6">
          {isCompany
            ? "You haven't created a company profile yet — create one so you can post jobs."
            : "You haven't created your profile yet — create one to start applying."}{" "}
          <Link
            to={
              isCompany
                ? "/company/profile/edit"
                : "/job-seeker/profile/edit"
            }
            className="font-semibold underline"
          >
            Set it up now
          </Link>
        </StatusBanner>
      )}

      {/* ---------- Big stat cards ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isCompany ? (
          <>
            <StatCard
              label="Total jobs"
              value={isBusy ? "—" : totalJobs}
              hint="All postings"
              accent="blue"
              icon={Icons.Briefcase}
              to="/company/jobs"
            />
            <StatCard
              label="Published"
              value={isBusy ? "—" : publishedJobs}
              hint="Live right now"
              accent="emerald"
              icon={Icons.Check}
              to="/company/jobs"
            />
            <StatCard
              label="Pending review"
              value={isBusy ? "—" : pendingJobs}
              hint="Awaiting approval"
              accent="amber"
              icon={Icons.Clock}
              to="/company/jobs"
            />
            <StatCard
              label="Applicants"
              value={isBusy ? "—" : totalApplications}
              hint="Across all jobs"
              accent="purple"
              icon={Icons.Users}
              to="/applications"
            />
          </>
        ) : (
          <>
            <StatCard
              label="Applications"
              value={isBusy ? "—" : totalApplications}
              hint="Total sent"
              accent="blue"
              icon={Icons.File}
              to="/applications"
            />
            <StatCard
              label="In review"
              value={isBusy ? "—" : reviewedApplications}
              hint="Being considered"
              accent="amber"
              icon={Icons.Clock}
              to="/applications"
            />
            <StatCard
              label="Accepted"
              value={isBusy ? "—" : acceptedApplications}
              hint="Offers received"
              accent="emerald"
              icon={Icons.Check}
              to="/applications"
            />
            <StatCard
              label="Profile"
              value={isBusy ? "—" : `${completionPct}%`}
              hint="Completion"
              accent="rose"
              icon={Icons.Star}
              to="/job-seeker/profile"
            />
          </>
        )}
      </div>

      {/* ---------- Secondary stats row ---------- */}
      <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
        {isCompany ? (
          <>
            <MiniStat
              label="Rejected"
              value={isBusy ? "—" : rejectedJobs}
              accent="rose"
            />
            <MiniStat
              label="Total applicants"
              value={isBusy ? "—" : totalApplications}
              accent="blue"
            />
            <MiniStat
              label="In review"
              value={isBusy ? "—" : reviewedApplications}
              accent="amber"
            />
            <MiniStat
              label="Accepted"
              value={isBusy ? "—" : acceptedApplications}
              accent="emerald"
            />
          </>
        ) : (
          <>
            <MiniStat
              label="Rejected"
              value={isBusy ? "—" : rejectedApplications}
              accent="rose"
            />
            <MiniStat
              label="Interviewing"
              value={isBusy ? "—" : reviewedApplications}
              accent="amber"
            />
            <MiniStat
              label="Offers"
              value={isBusy ? "—" : acceptedApplications}
              accent="emerald"
            />
            <MiniStat
              label="Completion"
              value={isBusy ? "—" : `${completionPct}%`}
              accent="purple"
            />
          </>
        )}
      </div>

      {/* ---------- Activity + News ---------- */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Recent activity — compact, capped at 3 */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-800">
              Recent activity
            </h2>

            <Link
              to={isCompany ? "/company/jobs" : "/applications"}
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              View all
            </Link>
          </div>

          {isBusy ? (
            <p className="text-sm text-ink-500">Loading…</p>
          ) : recentActivity.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-page/40 p-8 text-center">
              <p className="text-sm text-ink-500">
                {isCompany
                  ? "No jobs posted yet."
                  : "No applications yet."}
              </p>
              <Link
                to={isCompany ? "/company/jobs/new" : "/jobs"}
                className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                {isCompany ? "Post a job" : "Browse jobs"}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {isCompany
                ? (recentActivity as JobItem[]).map((job) => (
                    <li
                      key={job.id}
                      className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="block truncate text-sm font-medium text-ink-800 hover:text-brand-600"
                        >
                          {job.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {job.location || "No location"} ·{" "}
                          {formatRelative(job.created_at)}
                        </p>
                      </div>
                      <JobStatusBadge status={job.status} />
                    </li>
                  ))
                : (recentActivity as ApplicationItem[]).map((app) => (
                    <li
                      key={app.id}
                      className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <Link
                          to={`/applications/${app.id}`}
                          className="block truncate text-sm font-medium text-ink-800 hover:text-brand-600"
                        >
                          {app.job_title}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {app.company_name} ·{" "}
                          {formatRelative(app.created_at)}
                        </p>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </li>
                  ))}
            </ul>
          )}

          {/* Progress footer inside the same card */}
          {!isBusy && recentActivity.length > 0 && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                {isCompany ? "Publishing rate" : "Application success"}
              </p>

              {isCompany ? (
                <>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${
                          totalJobs === 0
                            ? 0
                            : Math.round((publishedJobs / totalJobs) * 100)
                        }%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink-500">
                    {totalJobs === 0
                      ? "No jobs yet."
                      : `${publishedJobs} of ${totalJobs} jobs published.`}
                  </p>
                </>
              ) : (
                <>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${
                          totalApplications === 0
                            ? 0
                            : Math.round(
                                (acceptedApplications / totalApplications) *
                                  100,
                              )
                        }%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink-500">
                    {totalApplications === 0
                      ? "No applications yet."
                      : `${acceptedApplications} of ${totalApplications} applications accepted.`}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* News column */}
        <div className="space-y-4">
          {/* Boost / status card */}
          <div className="overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-purple-50 p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white">
                {Icons.Sparkle}
              </span>
              <h3 className="text-sm font-semibold text-brand-700">
                {isCompany ? "Company status" : "Boost your profile"}
              </h3>
            </div>

            {isCompany ? (
              <>
                <p className="text-xs leading-relaxed text-brand-700/80">
                  {profile?.approval_status === "APPROVED"
                    ? "Your company is approved. New postings go straight to review."
                    : profile?.approval_status === "REJECTED"
                      ? "Your company profile was rejected. Update it to be re-reviewed."
                      : profile
                        ? "Your company profile is pending approval."
                        : "Create your company profile to start posting jobs."}
                </p>
                <Link
                  to="/company/profile"
                  className="mt-4 inline-block text-xs font-semibold text-brand-700 hover:underline"
                >
                  Go to company profile →
                </Link>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-brand-700">
                    {completionPct}%
                  </span>
                  <span className="text-xs text-brand-700/70">
                    profile complete
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>

                <Link
                  to="/job-seeker/profile/edit"
                  className="mt-4 inline-block text-xs font-semibold text-brand-700 hover:underline"
                >
                  {completionPct === 100
                    ? "View your profile →"
                    : "Complete your profile →"}
                </Link>
              </>
            )}
          </div>

          {/* News list — compact */}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-800">
                News & tips
              </h3>
              <Link
                to="/news"
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                See all →
              </Link>
            </div>

            <ul className="space-y-3">
              {NEWS_ITEMS.map((item) => {
                const a = ACCENTS[item.accent];
                return (
                  <li
                    key={item.id}
                    className="rounded-xl border border-line p-3 transition hover:border-brand-300 hover:bg-page/40"
                  >
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${a.bg} ${a.text}`}
                    >
                      {item.category}
                    </span>
                    <h4 className="mt-1.5 text-sm font-semibold leading-snug text-ink-800">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">
                      {item.excerpt}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper ---------- */
function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";

  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 60) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}