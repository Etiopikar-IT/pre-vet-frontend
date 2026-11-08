import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useApplyModal } from "../apply/ApplyModalContext";
import HeaderShell from "../header/HeaderShell";
import HeaderLogo from "../header/HeaderLogo";
import PublicNav from "../header/PublicNav";
import AuthedNav from "../header/AuthedNav";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "sectors", label: "Sectors" },
  { id: "process", label: "How it works" },
  { id: "team", label: "Team" },
  { id: "after", label: "After you join" },
];

interface PublicHeaderProps {
  onMenuClick?: () => void;
}

function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md p-2 text-ink-700 hover:bg-ink-100 md:hidden"
      aria-label="Open menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

export default function PublicHeader({ onMenuClick }: PublicHeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { open: openApply } = useApplyModal();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [active, setActive] = useState<string>("");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const targets = SECTIONS.map((s) =>
      document.getElementById(s.id),
    ).filter(Boolean) as HTMLElement[];

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const leftSlot = (
    <>
      {onMenuClick && <HamburgerButton onClick={onMenuClick} />}
      <HeaderLogo to={isAuthenticated ? "/dashboard" : "/"} />
    </>
  );

  if (isAuthenticated && user) {
    return (
      <HeaderShell
        left={leftSlot}
        right={<AuthedNav user={user} onLogout={handleLogout} />}
      />
    );
  }

  const publicRight = (
    <>
      <button
        type="button"
        onClick={openApply}
        className="hidden rounded-lg border border-brand-500 bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 sm:inline-block"
      >
        Join the talent pool
      </button>
      <PublicNav />
    </>
  );

  const publicBottom = (
    <nav className="flex items-center gap-1">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => scrollTo(s.id)}
          className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === s.id
              ? "text-brand-600"
              : "text-ink-700 hover:bg-ink-100"
          }`}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );

  const showSections = pathname === "/";

  return (
    <HeaderShell
      left={leftSlot}
      right={publicRight}
      bottom={showSections ? publicBottom : undefined}
    />
  );
}