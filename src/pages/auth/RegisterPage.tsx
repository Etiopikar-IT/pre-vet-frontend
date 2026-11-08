import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { UserType } from "../../types";
import { useAuth } from "../../context/AuthContext";
import StatusBanner from "../../components/common/StatusBanner";

interface RegisterPageProps {
  userType: UserType;
}

const STEPS = ["Email", "Password", "Confirm"] as const;

export default function RegisterPage({ userType }: RegisterPageProps) {
  const navigate = useNavigate();
  const { register } = useAuth();

  const isCompany = userType === "COMPANY";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [stepError, setStepError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLast = step === STEPS.length - 1;

  const validateStep = (): string => {
    if (step === 0) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) return "Enter your email address.";
      if (!emailPattern.test(email)) return "Enter a valid email address.";
    }
    if (step === 1) {
      if (!password) return "Enter a password.";
      if (password.length < 8)
        return "Password must be at least 8 characters.";
    }
    if (step === 2) {
      if (!rePassword) return "Confirm your password.";
      if (password !== rePassword) return "Passwords do not match.";
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
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepError("");
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // Validate every step before submitting
    for (let i = 0; i < STEPS.length; i++) {
      if (i === 1 && password.length < 8) {
        setStepError("Password must be at least 8 characters.");
        setStep(1);
        return;
      }
      if (i === 2 && password !== rePassword) {
        setStepError("Passwords do not match.");
        setStep(2);
        return;
      }
    }

    if (password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        email,
        user_type: userType,
        password,
        re_password: rePassword,
      });

      if (!success) {
        setError(
          "Registration failed. Please check your information and try again.",
        );
        return;
      }

      navigate("/login", {
        state: {
          message:
            "Your account has been created successfully. Please log in to continue.",
        },
      });
    } catch {
      setError("Something went wrong. Please try again.");
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
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              {isCompany ? (
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
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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
                  className="h-7 w-7"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </span>
          </div>

          {/* Title */}
          <div className="mb-6 text-center">
            <h1
              className="text-2xl font-bold text-ink-800"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {isCompany
                ? "Create a Company Account"
                : "Create a Job Seeker Account"}
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {isCompany
                ? "Create your company account and start finding talented people."
                : "Create your account and find your next career opportunity."}
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

          {/* Error */}
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

            {/* Step 1: Password */}
            {step === 1 && (
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-ink-400">
                  At least 8 characters.
                </p>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div>
                <label htmlFor="rePassword" className={labelClass}>
                  Confirm password
                </label>
                <input
                  id="rePassword"
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  autoFocus
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className={inputClass}
                />
              </div>
            )}

            {/* Per-step error */}
            {stepError && (
              <div className="min-h-[16px] text-xs text-red-600">
                {stepError}
              </div>
            )}

            {/* Navigation */}
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
                  {loading
                    ? "Creating account..."
                    : isCompany
                      ? "Create Company Account"
                      : "Create Job Seeker Account"}
                </button>
              )}
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:underline"
            >
              Login
            </Link>
          </div>

          {/* Switch account type */}
          <div className="mt-6 border-t border-line pt-6 text-center">
            <p className="text-sm text-ink-500">
              {isCompany
                ? "Are you looking for a job?"
                : "Are you a company looking for talent?"}
            </p>

            <Link
              to={isCompany ? "/register/job-seeker" : "/register/company"}
              className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline"
            >
              {isCompany ? "Join as a Job Seeker" : "Join as a Company"}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">
          By creating an account, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}