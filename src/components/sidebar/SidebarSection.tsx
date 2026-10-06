import type { ReactNode } from "react";

interface SidebarSectionProps {
  title?: string;
  collapsed?: boolean;
  children: ReactNode;
}

export default function SidebarSection({
  title,
  collapsed = false,
  children,
}: SidebarSectionProps) {
  return (
    <div className="mb-6">
      {title && !collapsed && (
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-brand-200">
          {title}
        </p>
      )}

      {/* Divider when collapsed (replaces the heading) */}
      {title && collapsed && (
        <div className="mx-auto mb-3 h-px w-8 bg-white/10" />
      )}

      <nav className="space-y-1">{children}</nav>
    </div>
  );
}