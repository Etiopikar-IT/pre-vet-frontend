import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import StatusBanner from "../../components/common/StatusBanner";

interface LoginLocationState {
  message?: string;
  from?: string;
}

const STEPS = ["Email", "Password"] as const;

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LoginLocationState | null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(state?.message || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const destination = state?.from ?? "/dashboard";
    navigate(destination, { replace: true });
  }, [user, navigate, state?.from]);

  const isLast = step === STEPS.length - 1;

  const validateStep = (): string => {
    if (step === 0) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) return "Enter your email address.";
      if (!emailPattern.test(email)) return "Enter a valid email address.";
    }
    if (step === 1) {
      if (!password) return "Enter your password.";
    }
    return "";
  };

  const goNext = () => {
    const msg = validateStep();
    if (msg) {
      setStepError(msg);
      return;
    }
    setStepError("");
    setError("");
    setStep(1);
  };

  const goBack = () => {
    setStepError("");
    setError("");
    setStep(0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const msg = validateStep();
    if (msg) {
      setStepError(msg);
      return;
    }

    setStepError("");
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
          <div className="mb-6 text-center">
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

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              {STEPS.map((label, i) => (
                <span
                  key={label}
                  className={
                    i === step
                      ? "text-brand-600"
                      : i < step
                        ? "text-ink-700"
                        : "text-ink-400"
                  }
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-300"
                style={{
                  width: `${((step + 1) / STEPS.length) * 100}%`,
                }}
              />
            </div>
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
            {/* Step 0: Email */}
            {step === 0 && (
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            )}

            {/* Step 1: Password (with eye toggle) */}
            {step === 1 && (
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

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-400 hover:text-ink-700 focus:outline-none"
                  >
                    {showPassword ? (
                      // Eye-off (password is visible — click to hide)
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
                      // Eye (password is hidden — click to reveal)
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
                </div>
              </div>
            )}

            {/* Per-step error */}
            {stepError && (
              <div className="min-h-[16px] text-xs text-red-600">
                {stepError}
              </div>
            )}

            {/* Navigation + Reset password */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={loading}
                    className="rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Back
                  </button>
                )}

                {!isLast ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex-1 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                )}
              </div>

              {/* Reset password button — always visible */}
              <Link
                to="/forgot-password"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500 bg-surface px-4 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Reset password
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 border-t border-line pt-6 text-center">
            <p className="text-sm text-ink-500">
              Don't have an account?
            </p>

            <div className="mt-3 flex flex-col justify-center gap-2 sm:flex-row sm:gap-4">
              

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