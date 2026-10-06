import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  children,
  action,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`mt-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink-800">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}