import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
  actionOnClick?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionTo,
  actionOnClick,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-12 text-center">
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          {icon}
        </div>
      )}

      <h2 className="text-lg font-semibold text-ink-800">{title}</h2>

      {message && (
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
          {message}
        </p>
      )}

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && actionOnClick && !actionTo && (
        <button
          type="button"
          onClick={actionOnClick}
          className="mt-5 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}