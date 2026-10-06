import type { ReactNode } from "react";

interface FilterPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}

export default function FilterPill({
  label,
  active = false,
  onClick,
  icon,
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-line bg-surface text-ink-700 hover:border-brand-300 hover:text-brand-600",
      ].join(" ")}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}