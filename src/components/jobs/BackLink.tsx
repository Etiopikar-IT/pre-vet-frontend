import { Link } from "react-router-dom";

interface BackLinkProps {
  to: string;
  label: string;
  className?: string;
}

export default function BackLink({
  to,
  label,
  className = "",
}: BackLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline ${className}`}
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
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      {label}
    </Link>
  );
}