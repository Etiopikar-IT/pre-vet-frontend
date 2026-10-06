import { Link } from "react-router-dom";

import logo from "../../assets/pre-vet logo.png";

interface SidebarLogoProps {
  to?: string;
}

export default function SidebarLogo({ to = "/" }: SidebarLogoProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-6 py-6"
      aria-label="Pre-Vet home"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-2">
        <img
          src={logo}
          alt="Pre-Vet"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="leading-tight">
        <p className="text-base font-semibold text-white">Pre-Vet</p>
        <p className="text-xs text-brand-100">Careers & Hiring</p>
      </div>
    </Link>
  );
}