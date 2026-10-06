import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCreate } from "../../hooks/useCreate";
import { endpoints } from "../../api/endpoints";

import StatusBanner from "../../components/common/StatusBanner";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  employment_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  application_deadline: string;
  status: string;
}

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full time" },
  { value: "PART_TIME", label: "Part time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
];

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

const labelClass =
  "mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500";

type SectionId = "role" | "description" | "compensation";

export default function JobCreatePage() {
  const navigate = useNavigate();
  const { create, loading, error, reset } = useCreate<Job>();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    location: "",
    employment_type: "FULL_TIME",
    salary_min: "",
    salary_max: "",
    salary_currency: "ETB",
    application_deadline: "",
  });

  const [success, setSuccess] = useState("");
  const [openSection, setOpenSection] = useState<SectionId | null>("role");

  const toggleSection = (id: SectionId) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    reset();

    const payload = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
      location: formData.location,
      employment_type: formData.employment_type,
      salary_min:
        formData.salary_min === "" ? null : Number(formData.salary_min),
      salary_max:
        formData.salary_max === "" ? null : Number(formData.salary_max),
      salary_currency: formData.salary_currency,
      application_deadline: formData.application_deadline || null,
    };

    const result = await create(endpoints.jobs.list, payload);

    if (result) {
      setSuccess("Job submitted for review.");
      setTimeout(() => {
        navigate("/company/jobs", {
          state: { message: "Job posted and awaiting approval." },
        });
      }, 900);
    }
  };

  /* -------- Section summaries (shown when collapsed) -------- */

  const summaries: Record<SectionId, string> = {
    role:
      formData.title || formData.location
        ? [formData.title, formData.location].filter(Boolean).join(" · ")
        : "Job title, location and employment type",
    description:
      formData.description || formData.responsibilities || formData.requirements
        ? "Content added"
        : "About the role, responsibilities and requirements",
    compensation:
      formData.salary_min || formData.salary_max
        ? `${formData.salary_currency || "ETB"} ${
            formData.salary_min || "0"
          }–${formData.salary_max || "0"}`
        : "Salary range and application deadline",
  };

  /* -------- salary preview -------- */
  const salaryPreview = (() => {
    const min = formData.salary_min ? Number(formData.salary_min) : null;
    const max = formData.salary_max ? Number(formData.salary_max) : null;
    const cur = formData.salary_currency || "ETB";
    const fmt = (n: number) => new Intl.NumberFormat().format(n);
    if (min != null && max != null) return `${cur} ${fmt(min)} – ${fmt(max)}`;
    if (min != null) return `${cur} ${fmt(min)}+`;
    if (max != null) return `Up to ${cur} ${fmt(max)}`;
    return "Not specified";
  })();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
          <Link to="/company/jobs" className="hover:text-brand-600">
            My jobs
          </Link>
          <span>/</span>
          <span className="text-ink-700">Post a new job</span>
        </nav>

        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-800">
              Post a new job
            </h1>
            <p className="mt-1.5 text-sm text-ink-500">
              Your posting will be reviewed before it goes live.
            </p>
          </div>

          <Link
            to="/company/jobs"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            ← Back to my jobs
          </Link>
        </div>

        {/* Banners */}
        {error && (
          <StatusBanner variant="error" className="mb-5">
            {error}
          </StatusBanner>
        )}

        {success && (
          <StatusBanner variant="success" className="mb-5">
            {success}
          </StatusBanner>
        )}

        {/* Two-column layout: form + preview */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* ---------- LEFT: collapsible sections ---------- */}
            <div className="space-y-4">
              {/* Section 1: Role */}
              <CollapsibleSection
                id="role"
                number={1}
                title="Role"
                description="Basic details about the position."
                summary={summaries.role}
                isOpen={openSection === "role"}
                onToggle={toggleSection}
              >
                <div className="grid gap-5">
                  <div>
                    <label htmlFor="title" className={labelClass}>
                      Job title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="e.g. Senior Backend Engineer"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="location" className={labelClass}>
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Addis Ababa, Ethiopia"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="employment_type"
                        className={labelClass}
                      >
                        Employment type
                      </label>
                      <select
                        id="employment_type"
                        name="employment_type"
                        value={formData.employment_type}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        {EMPLOYMENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Section 2: Description */}
              <CollapsibleSection
                id="description"
                number={2}
                title="Description"
                description="Help candidates understand the role."
                summary={summaries.description}
                isOpen={openSection === "description"}
                onToggle={toggleSection}
              >
                <div className="space-y-5">
                  <div>
                    <label htmlFor="description" className={labelClass}>
                      About the role <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={inputClass}
                      placeholder="Give a high-level summary of the position..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="responsibilities"
                      className={labelClass}
                    >
                      Responsibilities
                    </label>
                    <textarea
                      id="responsibilities"
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleChange}
                      rows={5}
                      className={inputClass}
                      placeholder="What will this person do day-to-day?"
                    />
                  </div>

                  <div>
                    <label htmlFor="requirements" className={labelClass}>
                      Requirements
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={5}
                      className={inputClass}
                      placeholder="Skills, experience, qualifications..."
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Section 3: Compensation */}
              <CollapsibleSection
                id="compensation"
                number={3}
                title="Compensation & deadline"
                description="Optional, but helps candidates self-qualify."
                summary={summaries.compensation}
                isOpen={openSection === "compensation"}
                onToggle={toggleSection}
              >
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="salary_min" className={labelClass}>
                      Salary min
                    </label>
                    <input
                      id="salary_min"
                      name="salary_min"
                      type="number"
                      min={0}
                      value={formData.salary_min}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="salary_max" className={labelClass}>
                      Salary max
                    </label>
                    <input
                      id="salary_max"
                      name="salary_max"
                      type="number"
                      min={0}
                      value={formData.salary_max}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="salary_currency"
                      className={labelClass}
                    >
                      Currency
                    </label>
                    <input
                      id="salary_currency"
                      name="salary_currency"
                      type="text"
                      value={formData.salary_currency}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="ETB"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="application_deadline"
                      className={labelClass}
                    >
                      Application deadline
                    </label>
                    <input
                      id="application_deadline"
                      name="application_deadline"
                      type="date"
                      value={formData.application_deadline}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <p className="mt-1.5 text-xs text-ink-500">
                      Leave blank for open-ended applications.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Actions - desktop */}
              <div className="hidden items-center justify-end gap-3 border-t border-line pt-6 lg:flex">
                <Link
                  to="/company/jobs"
                  className="rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit for review"}
                </button>
              </div>
            </div>

            {/* ---------- RIGHT: live preview ---------- */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Preview
                </h3>

                <div className="space-y-3">
                  <PreviewRow
                    label="Title"
                    value={formData.title || "Untitled role"}
                  />
                  <PreviewRow
                    label="Location"
                    value={formData.location || "Not specified"}
                  />
                  <PreviewRow
                    label="Type"
                    value={formData.employment_type.replace("_", " ")}
                  />
                  <PreviewRow label="Salary" value={salaryPreview} />
                  <PreviewRow
                    label="Deadline"
                    value={
                      formData.application_deadline
                        ? new Date(
                            formData.application_deadline,
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Open until filled"
                    }
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                    i
                  </span>
                  <h3 className="text-sm font-semibold text-brand-700">
                    Review process
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-brand-700/80">
                  Once submitted, your job goes to an admin for review.
                  You'll see its status on the <strong>My jobs</strong>{" "}
                  page. You can edit and resubmit at any time.
                </p>
              </div>
            </aside>
          </div>

          {/* Actions - mobile */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-6 lg:hidden">
            <Link
              to="/company/jobs"
              className="rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit for review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Local components ---------- */

interface CollapsibleSectionProps {
  id: SectionId;
  number: number;
  title: string;
  description?: string;
  summary: string;
  isOpen: boolean;
  onToggle: (id: SectionId) => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  id,
  number,
  title,
  description,
  summary,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-surface transition ${
        isOpen ? "border-brand-300 shadow-sm" : "border-line"
      }`}
    >
      {/* Header (clickable) */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition hover:bg-ink-100/40 sm:p-6"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-4">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
              isOpen
                ? "bg-brand-500 text-white"
                : "bg-brand-50 text-brand-600"
            }`}
          >
            {number}
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-ink-800">{title}</h2>

            {/* Subtitle / summary */}
            <p className="mt-0.5 truncate text-xs text-ink-500">
              {isOpen ? description : summary}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full bg-ink-100 p-2 text-ink-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
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
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Body (only when open) */}
      {isOpen && (
        <div className="border-t border-line bg-page/40 p-5 sm:p-6">
          {children}
        </div>
      )}
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
        {label}
      </span>
      <span className="max-w-[60%] truncate text-right font-medium text-ink-800">
        {value}
      </span>
    </div>
  );
}