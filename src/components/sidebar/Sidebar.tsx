import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";

import SidebarLogo from "./SidebarLogo";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const isCompany = user?.user_type === "COMPANY";

  const { data: unread } = useData<{ count: number }>(
    endpoints.accounts.notificationsUnreadCount,
  );
  const unreadCount = unread?.count ?? 0;

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-brand-600 transition-[width,transform] duration-200 ease-out",
          collapsed ? "w-20" : "w-72",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        ].join(" ")}
        onClick={stopPropagation}
      >
        <SidebarLogo collapsed={collapsed} />

        <div className="flex-1 overflow-y-auto px-3">
          <SidebarSection collapsed={collapsed}>
            <SidebarItem
              to="/dashboard"
              label="Dashboard"
              collapsed={collapsed}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
              }
            />

            <SidebarItem
              to="/jobs"
              label="Search jobs"
              collapsed={collapsed}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
            />

            {isCompany ? (
              <SidebarItem
                to="/company/jobs"
                label="Posted jobs"
                collapsed={collapsed}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                }
              />
            ) : (
              <SidebarItem
                to="/applications"
                label="Applications"
                collapsed={collapsed}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="13" y2="17" />
                  </svg>
                }
              />
            )}
          </SidebarSection>

          <SidebarSection title="Stay updated" collapsed={collapsed}>
            <SidebarItem
              to="/notifications"
              label="Notifications"
              collapsed={collapsed}
              badge={unreadCount}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              }
            />

            <SidebarItem
              to="/news"
              label="News"
              collapsed={collapsed}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
              }
            />
          </SidebarSection>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden border-t border-white/10 py-3 text-xs font-medium text-white/70 transition hover:bg-white/5 hover:text-white md:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {!collapsed && <span>Collapse</span>}
          </span>
        </button>

        <SidebarFooter collapsed={collapsed} />
      </aside>
    </>
  );
}