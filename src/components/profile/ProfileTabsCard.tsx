import type { ReactNode } from "react";

import ProfileTabs from "./ProfileTab";

export interface TabDefinition {
  id: string;
  label: string;
}

interface ProfileTabsCardProps {
  tabs: TabDefinition[];
  active: string;
  onChange: (id: string) => void;
  children: ReactNode;
  className?: string;
}

export default function ProfileTabsCard({
  tabs,
  active,
  onChange,
  children,
  className = "",
}: ProfileTabsCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-line bg-surface ${className}`}
    >
      <ProfileTabs tabs={tabs} active={active} onChange={onChange} />

      <div className="min-h-[320px] flex-1 p-6">{children}</div>
    </div>
  );
}