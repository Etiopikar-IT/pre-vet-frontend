import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function initials(email: string) {
  const name = email.split("@")[0] ?? "";
  return name.slice(0, 2).toUpperCase();
}

export default function SidebarFooter() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="border-t border-white/10 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
          {initials(user.email)}
        </div>

        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium text-white">
            {user.email}
          </p>
          <p className="truncate text-xs text-brand-200">
            {user.user_type === "COMPANY" ? "Company" : "Job seeker"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md p-2 text-brand-100 transition hover:bg-white/10 hover:text-white"
          aria-label="Log out"
          title="Log out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}