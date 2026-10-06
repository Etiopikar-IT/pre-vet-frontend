import type { ReactNode } from "react";

interface JobSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function JobSection({
  title,
  children,
  className = "",
}: JobSectionProps) {
  return (
    <div className={`mt-6 rounded-2xl border border-line bg-surface p-8 ${className}`}>
      <h2 className="mb-4 text-lg font-semibold text-ink-800">{title}</h2>
      {children}
    </div>
  );
}