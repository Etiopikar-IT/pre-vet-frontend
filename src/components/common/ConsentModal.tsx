import { useEffect } from "react";
import type { ReactNode } from "react";

interface ConsentModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  children: ReactNode;
}

export default function ConsentModal({
  open,
  title,
  onCancel,
  onConfirm,
  confirmLabel = "I agree",
  cancelLabel = "Cancel",
  children,
}: ConsentModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-modal-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line px-6 py-5">
          <h2
            id="consent-modal-title"
            className="text-lg font-semibold text-ink-800"
          >
            {title}
          </h2>
        </div>

        <div className="px-6 py-5 text-sm leading-relaxed text-ink-600">
          {children}
        </div>

        <div className="flex flex-col gap-2 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}