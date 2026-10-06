import type { ReactNode } from "react";

interface SidebarSectionProps {
  title?: string;
  children: ReactNode;
}

export default function SidebarSection({
  title,
  children,
}: SidebarSectionProps) {
  return (
    <div className="mb-6">
      {title && (
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-brand-200">
          {title}
        </p>
      )}
      <nav className="space-y-1">{children}</nav>
    </div>
  );
}