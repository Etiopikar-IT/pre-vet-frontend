import { Link } from "react-router-dom";

interface ApplyActionsProps {
  cancelTo: string;
  submitting: boolean;
  disabled?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}

export default function ApplyActions({
  cancelTo,
  submitting,
  disabled = false,
  submitLabel = "Submit application",
  submittingLabel = "Submitting...",
}: ApplyActionsProps) {
  const isDisabled = submitting || disabled;

  return (
    <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
      <Link
        to={cancelTo}
        className="rounded-lg border border-line px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
      >
        Cancel
      </Link>

      <button
        type="submit"
        disabled={isDisabled}
        className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
}