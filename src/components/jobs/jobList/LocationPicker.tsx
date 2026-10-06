interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  return (
    <div className="relative min-w-[180px]">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-brand-500">
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
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Around you"
        className="w-full rounded-xl border border-line bg-surface py-3 pl-9 pr-3 text-sm text-ink-800 outline-none transition placeholder:text-ink-500 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}