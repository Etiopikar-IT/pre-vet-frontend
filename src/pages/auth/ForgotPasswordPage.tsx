import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { api } from "../../api/api";
import { endpoints } from "../../api/endpoints";
import StatusBanner from "../../components/common/StatusBanner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await api.post(endpoints.auth.resetPassword, {
        email: email.trim().toLowerCase(),
      });
      setMessage(
        "If an account with that email exists, a reset link has been sent. Check your inbox and spam folder.",
      );
      setEmail("");
    } catch {
      // Djoser deliberately returns 204 whether or not the email exists
      // (to prevent account enumeration). We mirror that behaviour.
      setMessage(
        "If an account with that email exists, a reset link has been sent. Check your inbox and spam folder.",
      );
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
              Forgot password
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              Enter your account email and we'll send you a link to reset
              your password.
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
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-500">
            Remembered it?{" "}
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