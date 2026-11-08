import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { api } from "../../api/api";
import { endpoints } from "../../api/endpoints";
import StatusBanner from "../../components/common/StatusBanner";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRe, setShowRe] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }
    if (!newPassword) {
      setError("Enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== rePassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must differ from the current one.");
      return;
    }

    setLoading(true);
    try {
      await api.post(endpoints.auth.changePassword, {
        current_password: currentPassword,
        new_password: newPassword,
        re_new_password: rePassword,
      });

      setMessage("Your password has been updated.");
      setCurrentPassword("");
      setNewPassword("");
      setRePassword("");
    } catch (err: any) {
      const data = err?.response?.data;
      const msg =
        data?.current_password?.[0] ??
        data?.new_password?.[0] ??
        data?.re_new_password?.[0] ??
        data?.non_field_errors?.[0] ??
        data?.detail ??
        "Could not change your password. Please try again.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 pr-12 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500";

  const EyeToggle = ({
    shown,
    onToggle,
    label,
  }: {
    shown: boolean;
    onToggle: () => void;
    label: string;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={shown}
      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-400 hover:text-ink-700 focus:outline-none"
    >
      {shown ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.9 18.9 0 0 1 4.22-5.22" />
          <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.9 18.9 0 0 1-3.12 4.19" />
          <path d="M1 1l22 22" />
          <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-line bg-surface p-8">
          <div className="mb-6 text-center">
            <h1
              className="text-2xl font-bold text-ink-800"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              Change your password
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Confirm your current password, then choose a new one.
            </p>
          </div>

          {message && (
            <StatusBanner variant="success" className="mb-5">
              {message}
            </StatusBanner>
          )}
          {error && (
            <StatusBanner variant="error" className="mb-5">
              {error}
            </StatusBanner>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className={labelClass}>
                Current password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Your current password"
                  className={inputClass}
                />
                <EyeToggle
                  shown={showCurrent}
                  onToggle={() => setShowCurrent((v) => !v)}
                  label="current password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className={labelClass}>
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
                <EyeToggle
                  shown={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                  label="new password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rePassword" className={labelClass}>
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="rePassword"
                  type={showRe ? "text" : "password"}
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Confirm the new password"
                  className={inputClass}
                />
                <EyeToggle
                  shown={showRe}
                  onToggle={() => setShowRe((v) => !v)}
                  label="password confirmation"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-500">
            <Link to="/dashboard" className="font-semibold text-brand-600 hover:underline">
              Back to dashboard
            </Link>
            {" · "}
            <Link to="/forgot-password" className="font-semibold text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}