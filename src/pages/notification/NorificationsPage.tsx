import { useState } from "react";

import { api } from "../../api/api";
import { endpoints } from "../../api/endpoints";
import { useData } from "../../hooks/useData";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBanner from "../../components/common/StatusBanner";
import NotificationItem, {
  type NotificationItemData,
} from "../../components/nottifications/NotificationItem";

type Filter = "all" | "unread";

export default function NotificationsPage() {
  const {
    data: notifications,
    loading,
    error,
    refetch,
  } = useData<NotificationItemData[]>(endpoints.accounts.notifications);

  const [filter, setFilter] = useState<Filter>("all");
  const [markingAll, setMarkingAll] = useState(false);
  const [actionError, setActionError] = useState("");

  const list = notifications ?? [];
  const unreadCount = list.filter((n) => !n.is_read).length;

  const visibleList =
    filter === "unread" ? list.filter((n) => !n.is_read) : list;

  const handleItemClick = async (n: NotificationItemData) => {
    if (n.is_read) return;

    try {
      await api.patch(
        `${endpoints.accounts.notifications}${n.id}/`,
        { is_read: true },
      );
      await refetch();
    } catch {
      setActionError("Could not update that notification. Try again.");
    }
  };

  const handleMarkAllRead = async () => {
    if (markingAll || unreadCount === 0) return;

    setMarkingAll(true);
    setActionError("");

    try {
      await api.post(endpoints.accounts.notificationsMarkAllRead);
      await refetch();
    } catch {
      setActionError("Could not mark all as read. Try again.");
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading notifications..." />;

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <StatusBanner variant="error">{error}</StatusBanner>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-800">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {unreadCount === 0
                ? "You're all caught up."
                : `${unreadCount} unread ${
                    unreadCount === 1 ? "notification" : "notifications"
                  }`}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {markingAll ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        {/* Filter tabs */}
        {list.length > 0 && (
          <div className="mb-5 flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === "all"
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-line bg-surface text-ink-700 hover:bg-ink-100"
              }`}
            >
              All
              <span
                className={`ml-2 text-xs ${
                  filter === "all" ? "text-white/80" : "text-ink-400"
                }`}
              >
                {list.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === "unread"
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-line bg-surface text-ink-700 hover:bg-ink-100"
              }`}
            >
              Unread
              <span
                className={`ml-2 text-xs ${
                  filter === "unread" ? "text-white/80" : "text-ink-400"
                }`}
              >
                {unreadCount}
              </span>
            </button>
          </div>
        )}

        {/* Action error */}
        {actionError && (
          <StatusBanner variant="error" className="mb-5">
            {actionError}
          </StatusBanner>
        )}

        {/* List */}
        {visibleList.length === 0 ? (
          <EmptyState
            title={
              list.length === 0
                ? "No notifications yet"
                : "Nothing unread"
            }
            message={
              list.length === 0
                ? "We'll let you know when something happens — applications, approvals, and job updates."
                : "You've read everything. Nice."
            }
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            }
          />
        ) : (
          <ul className="space-y-3">
            {visibleList.map((n) => (
              <li key={n.id}>
                <NotificationItem
                  notification={n}
                  onClick={() => handleItemClick(n)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}