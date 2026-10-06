interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  { value: "", label: "Newest" },
  { value: "-salary_min", label: "Highest salary" },
  { value: "salary_min", label: "Lowest salary" },
  { value: "application_deadline", label: "Deadline" },
];

export default function SortDropdown({
  value,
  onChange,
}: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-600">
      <span>Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      >
        {OPTIONS.map((o) => (
          <option key={o.value || "default"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}