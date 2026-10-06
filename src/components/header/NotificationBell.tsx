import { Link } from "react-router-dom";

import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";
import { BellIcon } from "./icons";

interface NotificationBellProps {
  to?: string;
}

export default function NotificationBell({
  to = "/notifications",
}: NotificationBellProps) {
  const { data } = useData<{ count: number }>(
    endpoints.accounts.notificationsUnreadCount,
  );

  const count = data?.count ?? 0;

  return (
    <Link
      to={to}
      className="relative rounded-lg p-2 text-ink-600 transition hover:bg-ink-100 hover:text-ink-800"
      aria-label={
        count > 0 ? `Notifications (${count} unread)` : "Notifications"
      }
    >
      <BellIcon />

      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-surface">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}