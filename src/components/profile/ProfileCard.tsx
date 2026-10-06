import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import ApprovalStatusBadge from "./ApprovalStatusBadge";

interface ProfileMetaItem {
  icon: ReactNode;
  label: string;
  href?: string;
}

interface ProfileCardProps {
  name: string;
  handle?: string;
  photoUrl?: string | null;
  initials?: string;
  role?: string;
  location?: string;
  approvalStatus?: string;
  meta?: ProfileMetaItem[];
  primaryAction?: {
    label: string;
    to: string;
    icon?: ReactNode;
  };
  secondaryAction?: {
    label: string;
    to: string;
    icon?: ReactNode;
  };
}

export default function ProfileCard({
  name,
  handle,
  photoUrl,
  initials,
  role,
  location,
  approvalStatus,
  meta = [],
  primaryAction,
  secondaryAction,
}: ProfileCardProps) {
  const fallback =
    initials ||
    name
      ?.split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") ||
    "?";

  return (
    <div className="relative z-10 rounded-2xl border border-line bg-surface p-5 shadow-sm">
      {/* Avatar */}
      <div className="mb-4 flex justify-center sm:justify-start">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-24 w-24 rounded-full border-4 border-surface object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface bg-brand-50 text-3xl font-semibold text-brand-600">
            {fallback}
          </div>
        )}
      </div>

      <div className="text-center sm:text-left">
        <h1 className="text-xl font-bold text-ink-800">{name}</h1>

        {handle && <p className="mt-0.5 text-sm text-ink-500">{handle}</p>}

        {role && (
          <p className="mt-2 text-sm font-medium text-ink-700">{role}</p>
        )}

        {location && (
          <p className="mt-1 text-xs text-ink-500">{location}</p>
        )}

        {approvalStatus && (
          <div className="mt-3">
            <ApprovalStatusBadge status={approvalStatus} />
          </div>
        )}
      </div>

      {meta.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-ink-600">
          {meta.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-ink-400">{item.icon}</span>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-brand-600 hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                <span className="truncate">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="mt-5 space-y-2">
          {primaryAction && (
            <Link
              to={primaryAction.to}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              {primaryAction.icon}
              {primaryAction.label}
            </Link>
          )}

          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-500 px-4 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}