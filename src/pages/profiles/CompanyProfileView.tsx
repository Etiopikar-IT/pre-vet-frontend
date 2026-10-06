import { useState } from "react";
import { Link } from "react-router-dom";

import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBanner from "../../components/common/StatusBanner";

import ProfileTabsCard from "../../components/profile/ProfileTabsCard";
import ProfileOverviewCard from "../../components/profile/ProfileOverviewCard";
import ProfileStatusBanner from "../../components/profile/ProfileStatusBanner";
import ApprovalStatusBadge from "../../components/profile/ApprovalStatusBadge";

interface CompanyProfileData {
  id: number;
  company_name: string;
  logo: string | null;
  cover_photo?: string | null;
  description: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
  approval_status?: string;
  rejection_reason?: string;
}

type TabId = "about" | "contact";

const TABS: { id: TabId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

export default function CompanyProfileView() {
  const { data: profile, loading, error } = useData<CompanyProfileData>(
    endpoints.accounts.company,
  );

  const [tab, setTab] = useState<TabId>("about");

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <StatusBanner variant="error">{error}</StatusBanner>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="No company profile yet"
            message="Create your company profile to start posting jobs."
            actionLabel="Create profile"
            actionTo="/company/profile/edit"
          />
        </div>
      </div>
    );
  }

  const isProfileEmpty =
    !profile.description &&
    !profile.industry &&
    !profile.website &&
    !profile.phone &&
    !profile.address;

  const coverSrc = profile.cover_photo || DEFAULT_COVER;

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

        {/* Overlay content */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4 sm:gap-5">
              {profile.logo ? (
                <img
                  src={profile.logo}
                  alt={profile.company_name}
                  className="h-20 w-20 shrink-0 rounded-2xl border-4 border-white/90 object-cover shadow-lg sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white/90 bg-brand-50 text-3xl font-semibold text-brand-600 shadow-lg sm:h-24 sm:w-24">
                  {profile.company_name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <div className="min-w-0 pb-1">
                <h1 className="truncate text-2xl font-bold text-white drop-shadow sm:text-3xl">
                  {profile.company_name}
                </h1>

                {profile.industry && (
                  <p className="mt-1 truncate text-sm text-white/85 drop-shadow">
                    {profile.industry}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/85">
                  {profile.address && (
                    <span className="inline-flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {profile.address}
                    </span>
                  )}

                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 transition hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      {profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}

                  {profile.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {profile.phone}
                    </span>
                  )}
                </div>

                {profile.approval_status && (
                  <div className="mt-3">
                    <ApprovalStatusBadge status={profile.approval_status} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to="/company/jobs"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                View my jobs
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

      {/* ---------- Two-column content below ---------- */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left: tabs card */}
          <ProfileTabsCard
            tabs={TABS}
            active={tab}
            onChange={(id) => setTab(id as TabId)}
          >
            {tab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    About the company
                  </h3>

                  {profile.description ? (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
                      {profile.description}
                    </p>
                  ) : (
                    <p className="text-sm italic text-ink-400">
                      No description provided.
                    </p>
                  )}
                </div>

                {isProfileEmpty && (
                  <p className="text-sm text-ink-500">
                    Your profile is empty. Add a description and contact
                    details from{" "}
                    <Link
                      to="/company/profile/edit"
                      className="text-brand-600 hover:underline"
                    >
                      edit profile
                    </Link>
                    .
                  </p>
                )}
              </div>
            )}

            {tab === "contact" && (
              <dl className="grid gap-6 sm:grid-cols-2">
                <CompanyDetail label="Phone" value={profile.phone} />
                <CompanyDetail
                  label="Website"
                  value={profile.website}
                  href={profile.website}
                />
                <CompanyDetail
                  label="Address"
                  value={profile.address}
                  className="sm:col-span-2"
                />
              </dl>
            )}
          </ProfileTabsCard>

          {/* Right: overview card */}
          <ProfileOverviewCard title="Overview">
            <div className="space-y-5">
              <ProfileStatusBanner
                status={profile.approval_status}
                rejectionReason={profile.rejection_reason}
              />

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Snapshot
                </h3>
                <dl className="space-y-2.5 text-sm">
                  {profile.industry && (
                    <SnapshotRow
                      label="Industry"
                      value={profile.industry}
                    />
                  )}
                  {profile.address && (
                    <SnapshotRow
                      label="Location"
                      value={profile.address}
                    />
                  )}
                  {profile.website && (
                    <SnapshotRow
                      label="Website"
                      value={profile.website.replace(/^https?:\/\//, "")}
                      href={profile.website}
                    />
                  )}
                  {profile.phone && (
                    <SnapshotRow
                      label="Phone"
                      value={profile.phone}
                    />
                  )}
                </dl>
              </div>
            </div>
          </ProfileOverviewCard>
        </div>
      </div>
    </div>
  );
}

/* ---------- Local pieces ---------- */

function CompanyDetail({
  label,
  value,
  href,
  className = "",
}: {
  label: string;
  value?: string | null;
  href?: string | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink-800">
        {value ? (
          href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="italic text-ink-400">Not provided</span>
        )}
      </dd>
    </div>
  );
}

function SnapshotRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </dt>
      <dd className="max-w-[60%] truncate text-right font-medium text-ink-700">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}