import { Link } from "react-router-dom";


interface JobApplyCTAProps {
  onApply: () => void;
  isAnonymous?: boolean;
}

export default function JobApplyCTA({
  onApply,
  isAnonymous = false,
}: JobApplyCTAProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-500">
        {isAnonymous
          ? "Interested? Apply with your email — no account needed."
          : "Interested in this role? Submit an application."}
      </p>

      <button
        type="button"
        onClick={onApply}
        className="inline-block rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Apply for this job
      </button>
    </div>
  );
}