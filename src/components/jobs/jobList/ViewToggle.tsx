interface ViewToggleProps {
  value: "grid" | "list";
  onChange: (value: "grid" | "list") => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-line bg-surface">
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        className={`px-3 py-2 transition ${
          value === "grid"
            ? "bg-brand-500 text-white"
            : "text-ink-500 hover:bg-ink-100"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view"
        className={`px-3 py-2 transition ${
          value === "list"
            ? "bg-brand-500 text-white"
            : "text-ink-500 hover:bg-ink-100"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
    </div>
  );
}