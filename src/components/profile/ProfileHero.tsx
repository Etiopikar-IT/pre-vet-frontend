import { Link } from "react-router-dom";

import ApprovalStatusBadge from "./ApprovalStatusBadge";

interface ProfileHeroProps {
  name: string;
  photoUrl?: string | null;
  photoAlt?: string;
  /** Fallback initials if no photo */
  initials?: string;
  subtitle?: string;
  location?: string;
  approvalStatus?: string;
  editTo: string;
  editLabel?: string;
}

export default function ProfileHero({
  name,
  photoUrl,
  photoAlt,
  initials,
  subtitle,
  location,
  approvalStatus,
  editTo,
  editLabel = "Edit profile",
}: ProfileHeroProps) {
  const fallback =
    initials ||
    name
      ?.split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") ||
    "?";

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={photoAlt || name}
            className="h-24 w-24 shrink-0 rounded-full border border-line object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-50 text-3xl font-semibold text-brand-600">
            {fallback}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-ink-800">
            {name || "Unnamed user"}
          </h1>

          {subtitle && (
            <p className="mt-1 text-sm text-ink-600">{subtitle}</p>
          )}

          {location && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {location}
            </p>
          )}

          {approvalStatus && (
            <div className="mt-3">
              <ApprovalStatusBadge status={approvalStatus} />
            </div>
          )}
        </div>

        <Link
          to={editTo}
          className="shrink-0 rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
        >
          {editLabel}
        </Link>
      </div>
    </div>
  );
}