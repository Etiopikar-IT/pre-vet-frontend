import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar_collapsed") === "1",
  );

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink-800">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />

      <div
        className={[
          "flex flex-1 flex-col transition-[padding] duration-200",
          collapsed ? "md:pl-20" : "md:pl-72",
        ].join(" ")}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}