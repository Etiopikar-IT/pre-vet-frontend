import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import HeaderShell from "./header/HeaderShell";
import HeaderLogo from "./header/HeaderLogo";
import PublicNav from "./header/PublicNav";
import AuthedNav from "./header/AuthedNav";

interface HeaderProps {
  notificationCount?: number;
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

export default function Header({
  notificationCount = 0,
  onMenuClick,
}: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const leftSlot = (
    <>
      {onMenuClick && <HamburgerButton onClick={onMenuClick} />}
      <HeaderLogo to={isAuthenticated ? "/dashboard" : "/"} />
    </>
  );

  // Public header
  if (!isAuthenticated || !user) {
    return <HeaderShell left={leftSlot} right={<PublicNav />} />;
  }

  // Authenticated header
  return (
    <HeaderShell
      left={leftSlot}
      right={
        <AuthedNav
          user={user}
          onLogout={handleLogout}
        />
      }
    />
  );
}