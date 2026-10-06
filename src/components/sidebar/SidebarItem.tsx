import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  end?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  to,
  icon,
  label,
  badge,
  end = false,
  collapsed = false,
  onClick,
}: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition",
          collapsed ? "justify-center" : "gap-3",
          isActive
            ? "bg-white/10 text-white"
            : "text-brand-100 hover:bg-white/5 hover:text-white",
        ].join(" ")
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <span
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition",
              isActive
                ? "bg-brand-500 text-white"
                : "bg-white/5 text-brand-100 group-hover:bg-white/10",
            ].join(" ")}
          >
            {icon}
          </span>

          {!collapsed && <span className="flex-1">{label}</span>}

          {!collapsed && badge !== undefined && badge > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              {badge > 99 ? "99+" : badge}
            </span>
          )}

          {/* Dot badge when collapsed */}
          {collapsed && badge !== undefined && badge > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </>
      )}
    </NavLink>
  );
}