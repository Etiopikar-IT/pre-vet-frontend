import { useEffect, useRef } from "react";

import DropdownItem from "./DropdownItem";
import ProfileTrigger from "./ProfileTrigger";
import UserAvatar from "./UserAvatar";
import {
  DashboardIcon,
  EditIcon,
  LogoutIcon,
  UserIcon,
} from "./icons";

interface ProfileDropdownProps {
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  roleLabel: string;
  profilePath: string;
  profileEditPath: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({
  email,
  displayName,
  avatarUrl,
  roleLabel,
  profilePath,
  profileEditPath,
  open,
  onToggle,
  onClose,
  onLogout,
}: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative">
      <ProfileTrigger
        email={email}
        displayName={displayName}
        avatarUrl={avatarUrl}
        open={open}
        onClick={onToggle}
      />

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
        >
          {/* User info block */}
          <div className="border-b border-line px-4 py-4">
            <div className="flex items-center gap-3">
              <UserAvatar email={email} src={avatarUrl} size="md" />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-800">
                  {displayName}
                </p>
                <p className="truncate text-xs text-ink-500">{email}</p>
              </div>
            </div>

            <span className="mt-3 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700">
              {roleLabel}
            </span>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <DropdownItem
              to="/dashboard"
              icon={<DashboardIcon />}
              label="Dashboard"
              onClick={onClose}
            />
            <DropdownItem
              to={profilePath}
              icon={<UserIcon />}
              label="View profile"
              onClick={onClose}
            />
            <DropdownItem
              to={profileEditPath}
              icon={<EditIcon />}
              label="Edit profile"
              onClick={onClose}
            />
          </div>

          {/* Logout */}
          <div className="border-t border-line p-1.5">
            <DropdownItem
              icon={<LogoutIcon />}
              label="Log out"
              variant="danger"
              onClick={onLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
}