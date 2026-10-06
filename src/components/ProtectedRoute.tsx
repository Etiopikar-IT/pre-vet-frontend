import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../context/AuthContext";
import type { UserType } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedType?: UserType;
}

export default function ProtectedRoute({
  children,
  allowedType,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedType && user.user_type !== allowedType) {
    // Send them to their own profile instead of a generic "/"
    return (
      <Navigate
        to={
          user.user_type === "COMPANY"
            ? "/company/profile"
            : "/job-seeker/profile"
        }
        replace
      />
    );
  }

  return <>{children}</>;
}