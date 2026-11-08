import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../../api/api";
import { endpoints } from "../../api/endpoints";
import StatusBanner from "../../components/common/StatusBanner";

export default function ResetPasswordPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!uid || !token) {
      setError("This reset link is invalid or incomplete.");
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
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post(endpoints.auth.resetPasswordConfirm, {
        uid,
        token,
        new_password: newPassword,
        re_password: rePassword,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Your password was reset successfully. Please log in with your new password.",
        },
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const msg =
        data?.new_password?.[0] ??
        data?.token?.[0] ??
        data?.uid?.[0] ??
        data?.detail ??
        "This reset link may have expired. Please request a new one.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-line bg-surface p-8">
          <div className="mb-6 text-center">
            <h1
              className="text-2xl font-bold text-ink-800"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Choose a new password for your account.
            </p>
          </div>

          {error && (
            <StatusBanner variant="error" className="mb-5">
              {error}
            </StatusBanner>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="newPassword" className={labelClass}>
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="rePassword" className={labelClass}>
                Confirm password
              </label>
              <input
                id="rePassword"
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm your new password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-500">
            <Link
              to="/forgot-password"
              className="font-semibold text-brand-600 hover:underline"
            >
              Request a new link
            </Link>
            {" · "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}