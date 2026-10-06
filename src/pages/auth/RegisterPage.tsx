import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { UserType } from "../../types";
import { useAuth } from "../../context/AuthContext";
import StatusBanner from "../../components/common/StatusBanner";

interface RegisterPageProps {
  userType: UserType;
}

export default function RegisterPage({ userType }: RegisterPageProps) {
  const navigate = useNavigate();
  const { register } = useAuth();

  const isCompany = userType === "COMPANY";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

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
        {/* Card */}
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
                  <rect
                    x="2"
                    y="7"
                    width="20"
                    height="14"
                    rx="2"
                    ry="2"
                  />
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
          <div className="mb-8 text-center">
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

          {/* Error */}
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
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Enter your password"
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
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : isCompany
                  ? "Create Company Account"
                  : "Create Job Seeker Account"}
            </button>
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
              to={
                isCompany
                  ? "/register/job-seeker"
                  : "/register/company"
              }
              className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline"
            >
              {isCompany
                ? "Join as a Job Seeker"
                : "Join as a Company"}
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-ink-400">
          By creating an account, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}