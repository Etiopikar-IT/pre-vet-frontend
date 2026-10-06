import { useState } from "react";

import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import type { User } from "../../types";

interface AuthedNavProps {
  user: User;
  onLogout: () => void;
}

export default function AuthedNav({ user, onLogout }: AuthedNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const profilePath =
    user.user_type === "COMPANY"
      ? "/company/profile"
      : "/job-seeker/profile";

  const profileEditPath =
    user.user_type === "COMPANY"
      ? "/company/profile/edit"
      : "/job-seeker/profile/edit";

  const roleLabel = user.user_type === "COMPANY" ? "Company" : "Job seeker";
  const displayName = user.email.split("@")[0];

  return (
    <>
      <NotificationBell />

      <ProfileDropdown
        email={user.email}
        displayName={displayName}
        avatarUrl={user.avatar_url}
        roleLabel={roleLabel}
        profilePath={profilePath}
        profileEditPath={profileEditPath}
        open={menuOpen}
        onToggle={() => setMenuOpen((v) => !v)}
        onClose={() => setMenuOpen(false)}
        onLogout={onLogout}
      />
    </>
  );
}