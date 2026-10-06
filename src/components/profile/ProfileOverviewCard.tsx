import type { ReactNode } from "react";

interface ProfileOverviewCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function ProfileOverviewCard({
  title = "Overview",
  children,
  className = "",
}: ProfileOverviewCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-line bg-surface p-6 ${className}`}
    >
      <h2 className="mb-4 text-base font-semibold text-ink-800">{title}</h2>
      <div className="flex-1">{children}</div>
    </div>
  );
}