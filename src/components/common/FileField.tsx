import type { ChangeEvent } from "react";

interface FileFieldProps {
  id: string;
  name: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  hint?: string;
  /** Whether the profile already has a file on the server. */
  hasExistingFile?: boolean;
  /** Set when the user has selected a new file in this session. */
  hasNewFile?: boolean;
  className?: string;
}

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition file:mr-4 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100";

const labelClass = "mb-1 block text-sm font-medium text-ink-700";

export default function FileField({
  id,
  name,
  label,
  onChange,
  accept,
  hint,
  hasExistingFile = false,
  hasNewFile = false,
  className = "",
}: FileFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        onChange={onChange}
        className={inputClass}
      />

      {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}

      {hasExistingFile && !hasNewFile && (
        <p className="mt-2 text-xs text-ink-500">
          Current file uploaded. Choose a new one to replace it.
        </p>
      )}

      {hasNewFile && (
        <p className="mt-2 text-xs text-emerald-600">
          New file selected.
        </p>
      )}
    </div>
  );
}