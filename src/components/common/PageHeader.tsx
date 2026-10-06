import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div>
        <h1 className="text-3xl font-bold text-ink-800">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}