interface CoverLetterFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  rows?: number;
  id?: string;
  name?: string;
}

export default function CoverLetterField({
  value,
  onChange,
  label = "Cover letter",
  placeholder = "Tell the company why you're a great fit for this role...",
  hint = "Optional but recommended. Introduce yourself and explain your interest in the role.",
  rows = 10,
  id = "cover_letter",
  name = "cover_letter",
}: CoverLetterFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-ink-700"
      >
        {label}
      </label>

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        placeholder={placeholder}
      />

      {hint && <p className="mt-2 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}