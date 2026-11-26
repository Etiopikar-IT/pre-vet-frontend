import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setDrawerOpen(false);
  };

  const handleOpenMenu = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setDrawerOpen(true);
    }
  };

  const leftSlot = (
    <>
      <HamburgerButton onClick={handleOpenMenu} />
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

  const showSections = pathname === "/";

  return (
    <>
      <HeaderShell
        left={leftSlot}
        right={publicRight}
        bottom={showSections ? undefined : undefined}
      />

      {/* Burger drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-72 max-w-[85vw] transform bg-white shadow-xl transition-transform duration-200 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-ink-200 px-4 py-3">
            <span className="text-sm font-semibold text-ink-900">Menu</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-md p-2 text-ink-700 hover:bg-ink-100"
              aria-label="Close menu"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            <Link
              to="/jobs"
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              Jobs
            </Link>
            <Link
              to="/register/company"
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
            Join as a company
            </Link>

            {showSections && (
              <>
                <div className="my-2 border-t border-ink-200" />
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      active === s.id
                        ? "text-brand-600"
                        : "text-ink-700 hover:bg-ink-100"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                openApply();
              }}
              className="mt-3 rounded-lg border border-brand-500 bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Join the talent pool
            </button>
          </nav>
        </aside>
      </div>
    </>
  );
}