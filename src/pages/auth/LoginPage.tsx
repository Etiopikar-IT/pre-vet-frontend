import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import StatusBanner from "../../components/common/StatusBanner";

interface LoginLocationState {
  message?: string;
  from?: string;
}

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LoginLocationState | null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(state?.message || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const destination = state?.from ?? "/dashboard";
    navigate(destination, { replace: true });
  }, [user, navigate, state?.from]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const success = await login({ email, password });

    setLoading(false);

    if (!success) {
      setError("Invalid email or password.");
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
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </span>
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1
              className="text-2xl font-bold text-ink-800"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Log in to your account to continue.
            </p>
          </div>

          {/* Banners */}
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

          {/* Form */}
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
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 border-t border-line pt-6 text-center">
            <p className="text-sm text-ink-500">
              Don't have an account?
            </p>

            <div className="mt-3 flex flex-col justify-center gap-2 sm:flex-row sm:gap-4">
              <Link
                to="/register/job-seeker"
                className="text-sm font-semibold text-brand-600 hover:underline"
              >
                Join as Job Seeker
              </Link>

              <Link
                to="/register/company"
                className="text-sm font-semibold text-brand-600 hover:underline"
              >
                Join as Company
              </Link>
            </div>
          </div>
        </div>

        {/* Back to public */}
        <p className="mt-6 text-center text-xs text-ink-400">
          <Link to="/" className="hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}