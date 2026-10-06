import type { ReactNode } from "react";

export interface NotificationItemData {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationItemProps {
  notification: NotificationItemData;
  onClick?: () => void;
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

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

function iconFor(type: string): { node: ReactNode; classes: string } {
  const c = "h-5 w-5";

  switch (type) {
    case "PROFILE_APPROVED":
      return {
        classes: "bg-emerald-50 text-emerald-600",
        node: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ),
      };
    case "PROFILE_REJECTED":
      return {
        classes: "bg-red-50 text-red-600",
        node: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ),
      };
    case "JOB_STATUS_CHANGED":
      return {
        classes: "bg-brand-50 text-brand-600",
        node: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        ),
      };
    case "APPLICATION_STATUS_CHANGED":
      return {
        classes: "bg-purple-50 text-purple-600",
        node: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      };
    default:
      return {
        classes: "bg-ink-100 text-ink-500",
        node: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        ),
      };
  }
}

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const { classes, node } = iconFor(notification.notification_type);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
        notification.is_read
          ? "border-line bg-surface hover:border-brand-300"
          : "border-brand-200 bg-brand-50/40 hover:border-brand-400"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${classes}`}
      >
        {node}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`truncate text-sm ${
              notification.is_read
                ? "font-medium text-ink-700"
                : "font-semibold text-ink-800"
            }`}
          >
            {notification.title}
          </h3>

          <span className="shrink-0 text-[11px] text-ink-400">
            {formatRelative(notification.created_at)}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">
          {notification.message}
        </p>
      </div>

      {!notification.is_read && (
        <span
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500"
          aria-label="Unread"
        />
      )}
    </button>
  );
}