import { Link } from "react-router-dom";

import logo from "../../assets/pre-vet logo.png";

interface SidebarLogoProps {
  collapsed?: boolean;
}

export default function SidebarLogo({ collapsed = false }: SidebarLogoProps) {
  return (
    <Link
      to="/dashboard"
      className={[
        "flex items-center px-4 py-5 transition",
        collapsed ? "justify-center" : "gap-3 px-6",
      ].join(" ")}
      aria-label="Pre-Vet home"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
        <img
          src={logo}
          alt="Pre-Vet"
          className="h-full w-full object-contain"
        />
      </div>

      {!collapsed && (
        <div className="leading-tight">
          <p className="text-base font-semibold text-white">Pre-Vet</p>
          <p className="text-xs text-brand-100">Careers &amp; Hiring</p>
        </div>
      )}
    </Link>
  );
}