import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page text-ink-800">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Push content to the right of the sidebar on desktop */}
      <div className="md:pl-72">
        {/* Header: mobile menu toggle + user profile + notifications */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}