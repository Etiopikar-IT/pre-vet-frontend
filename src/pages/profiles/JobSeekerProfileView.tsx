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
import ProfileAbout from "../../components/profile/ProfileAbout";
import ProfileExperience from "../../components/profile/ProfileExperience";
import ProfileEducation from "../../components/profile/ProfileEducation";
import ProfileContact from "../../components/profile/ProfileContact";
import ApprovalStatusBadge from "../../components/profile/ApprovalStatusBadge";

interface JobSeekerProfileData {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  cover_photo?: string | null;
  phone: string;
  location: string;
  professional_title: string;
  about: string;
  skills: string;
  education: string;
  experience: string;
  cv: string | null;
  approval_status?: string;
  rejection_reason?: string;
}

type TabId = "about" | "experience" | "education" | "contact";

const TABS: { id: TabId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

export default function JobSeekerProfileView() {
  const { data: profile, loading, error } = useData<JobSeekerProfileData>(
    endpoints.accounts.jobSeeker,
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
            title="No profile yet"
            message="Create your profile so employers can find you."
            actionLabel="Create profile"
            actionTo="/job-seeker/profile/edit"
          />
        </div>
      </div>
    );
  }

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "Unnamed user";

  const handle =
    "@" +
    (profile.professional_title || "jobseeker")
      .toLowerCase()
      .replace(/\s+/g, "");

  const isProfileEmpty =
    !profile.about &&
    !profile.skills &&
    !profile.experience &&
    !profile.education &&
    !profile.phone &&
    !profile.cv;

  const coverSrc = profile.cover_photo || DEFAULT_COVER;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page pb-12">
      {/* ---------- Cover with overlaid job seeker identity ---------- */}
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
            {/* Left: avatar + name + meta */}
            <div className="flex items-end gap-4 sm:gap-5">
              {profile.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt={fullName}
                  className="h-20 w-20 shrink-0 rounded-full border-4 border-white/90 object-cover shadow-lg sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/90 bg-brand-50 text-2xl font-semibold text-brand-600 shadow-lg sm:h-24 sm:w-24 sm:text-3xl">
                  {fullName
                    .split(" ")
                    .map((p) => p.charAt(0).toUpperCase())
                    .slice(0, 2)
                    .join("") || "?"}
                </div>
              )}

              <div className="min-w-0 pb-1">
                <h1 className="truncate text-2xl font-bold text-white drop-shadow sm:text-3xl">
                  {fullName}
                </h1>

                {profile.professional_title && (
                  <p className="mt-1 truncate text-sm text-white/90 drop-shadow">
                    {profile.professional_title}
                  </p>
                )}

                <p className="mt-0.5 truncate text-xs text-white/70">
                  {handle}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/85">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {profile.location}
                    </span>
                  )}

                  {profile.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {profile.phone}
                    </span>
                  )}

                  {profile.cv && (
                    <a
                      href={profile.cv}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 transition hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      Download CV
                    </a>
                  )}
                </div>

                {profile.approval_status && (
                  <div className="mt-3">
                    <ApprovalStatusBadge status={profile.approval_status} />
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
                to="/job-seeker/profile/edit"
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
            {tab === "about" && <ProfileAbout about={profile.about} />}

            {tab === "experience" && (
              <ProfileExperience
                experience={profile.experience}
                heading={null}
              />
            )}

            {tab === "education" && (
              <ProfileEducation education={profile.education} />
            )}

            {tab === "contact" && (
              <ProfileContact
                phone={profile.phone}
                location={profile.location}
                cvUrl={profile.cv}
              />
            )}
          </ProfileTabsCard>

          {/* Right: overview card */}
          <ProfileOverviewCard title="Overview">
            <div className="space-y-5">
              <ProfileStatusBanner
                status={profile.approval_status}
                rejectionReason={profile.rejection_reason}
              />

              {profile.about && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    About
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
                    {profile.about}
                  </p>
                </div>
              )}

              {profile.skills && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((skill, i) => (
                        <span
                          key={`${skill}-${i}`}
                          className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {isProfileEmpty && (
                <p className="text-sm text-ink-500">
                  Nothing to show yet. Add your skills and a short bio
                  from{" "}
                  <Link
                    to="/job-seeker/profile/edit"
                    className="text-brand-600 hover:underline"
                  >
                    edit profile
                  </Link>
                  .
                </p>
              )}
            </div>
          </ProfileOverviewCard>
        </div>
      </div>
    </div>
  );
}