import { Link } from "react-router-dom";

export default function PublicNav() {
  return (
    <>
      <Link
        to="/register/job-seeker"
        className="hidden rounded-lg border border-brand-500 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 sm:inline-block"
      >
        Join as Job Seeker
      </Link>

      <Link
        to="/register/company"
        className="hidden rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 sm:inline-block"
      >
        Join as a Company
      </Link>

      <Link
        to="/login"
        className="rounded-lg px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
      >
        Login
      </Link>
    </>
  );
}