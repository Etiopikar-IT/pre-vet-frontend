import type { ReactNode } from "react";

import ProfileCard from "./ProfileCard";
import ProfileStats from "./ProfileStats";

export interface ProfileMetaItem {
  icon: ReactNode;
  label: string;
  href?: string;
}

export interface ProfileAction {
  label: string;
  to: string;
  icon?: ReactNode;
}

interface ProfileDetailsCardProps {
  name: string;
  handle?: string;
  photoUrl?: string | null;
  role?: string;
  location?: string;
  approvalStatus?: string;
  meta?: ProfileMetaItem[];
  primaryAction?: ProfileAction;
  secondaryAction?: ProfileAction;
  stats?: { value: number | string; label: string }[];
}

export default function ProfileDetailsCard({
  name,
  handle,
  photoUrl,
  role,
  location,
  approvalStatus,
  meta = [],
  primaryAction,
  secondaryAction,
  stats = [],
}: ProfileDetailsCardProps) {
  return (
    <div className="space-y-4">
      <ProfileCard
        name={name}
        handle={handle}
        photoUrl={photoUrl}
        role={role}
        location={location}
        approvalStatus={approvalStatus}
        meta={meta}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
      />

      {stats.length > 0 && <ProfileStats stats={stats} />}
    </div>
  );
}