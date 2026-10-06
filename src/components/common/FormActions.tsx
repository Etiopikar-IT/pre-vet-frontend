import { Link } from "react-router-dom";

interface FormActionsProps {
  /** Submit button label when not submitting. */
  submitLabel?: string;
  submittingLabel?: string;
  submitting: boolean;
  /** Optional cancel target. */
  cancelTo?: string;
  cancelLabel?: string;
}

export default function FormActions({
  submitLabel = "Save",
  submittingLabel = "Saving...",
  submitting,
  cancelTo,
  cancelLabel = "Cancel",
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
      {cancelTo && (
        <Link
          to={cancelTo}
          className="rounded-lg border border-line px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
        >
          {cancelLabel}
        </Link>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
}