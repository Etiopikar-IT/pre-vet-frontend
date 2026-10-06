import type { ChangeEvent } from "react";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: "text" | "email" | "tel" | "url" | "number" | "password";
  placeholder?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
  colSpan?: 1 | 2;
}

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

const labelClass = "mb-1 block text-sm font-medium text-ink-700";

export default function FormField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  required = false,
  multiline = false,
  rows = 4,
  className = "",
  colSpan,
}: FormFieldProps) {
  const wrapperClass =
    colSpan === 2 ? `sm:col-span-2 ${className}` : className;

  return (
    <div className={wrapperClass}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          placeholder={placeholder}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={inputClass}
        />
      )}

      {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}