import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import PublicLandingPage from "../pages/PublicLandingPage";

export default function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="flex items-center gap-3 text-ink-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand-500" />
          Loading…
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <PublicLandingPage />;
}