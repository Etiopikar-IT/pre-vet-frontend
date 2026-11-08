import { type FormEvent, useEffect, useRef, useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import { useCreate } from "../../../hooks/useCreate";
import { endpoints } from "../../../api/endpoints";

interface JobApplication {
  id: number;
  job: number;
  status: string;
  created_at: string;
}

interface ApplyModalProps {
  jobId: number;
  jobTitle: string;
  companyName: string;
  open: boolean;
  onClose: () => void;
}

export default function ApplyModal({
  jobId,
  jobTitle,
  companyName,
  open,
  onClose,
}: ApplyModalProps) {
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email ?? "");
  const [success, setSuccess] = useState(false);

  const { create, loading, error, reset } = useCreate<JobApplication>();

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      setEmail(user?.email ?? "");
      setSuccess(false);
      reset();
    }
    wasOpen.current = open;
  }, [open, user?.email, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const result = await create(endpoints.applications.list, {
      job: jobId,
      email: email.trim().toLowerCase(),
    });

    if (result) setSuccess(true);
  };

  const isTalentPoolError = error?.toLowerCase().includes("talent pool");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-line bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-line px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink-800">
              {success ? "Application received" : "Apply for this job"}
            </h2>
            <p className="mt-0.5 text-xs text-ink-500">
              {jobTitle} · {companyName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-600"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="px-6 py-6">
            <p className="text-sm text-green-700">
              Your application has been submitted. We used the CV on your
              talent-pool profile to draft a cover letter.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
            <div>
              <label
                htmlFor="apply-email"
                className="block text-sm font-medium text-ink-700"
              >
                Email address
              </label>
              <p className="mt-0.5 text-xs text-ink-500">
                We'll look up your talent-pool profile and draft a cover
                letter from the CV on file.
              </p>
              <input
                id="apply-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) reset();
                }}
                disabled={loading}
                className="mt-2 w-full rounded-lg border border-line bg-page px-3 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none disabled:opacity-60"
              />
            </div>

            {error && (
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  isTalentPoolError
                    ? "border border-blue-200 bg-blue-50 text-blue-700"
                    : "border border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {error}
                {isTalentPoolError && (
                  <>
                    {" "}
                    <a
                      href="/join"
                      className="font-medium text-brand-600 hover:underline"
                    >
                      Join the talent pool →
                    </a>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}