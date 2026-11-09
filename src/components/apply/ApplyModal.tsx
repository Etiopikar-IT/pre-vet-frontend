import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { CONFIG } from "../public/config";
import { endpoints } from "../../api/endpoints";
import { useCreate } from "../../hooks/useCreate";
import { useApplyModal } from "./ApplyModalContext";

interface TalentPoolResponse {
  detail: string;
  created: boolean;
}

export default function ApplyModal() {
  const { isOpen, close } = useApplyModal();

  // Existing
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // New — taxonomy + filters
  const [category, setCategory] = useState("");
  const [sector, setSector] = useState("");
  const [role, setRole] = useState("");
  const [careerStatus, setCareerStatus] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const {
    create,
    loading: submitting,
    error: serverError,
  } = useCreate<TalentPoolResponse>();

  /* Cascades derived from config */
  const categorySectors =
    CONFIG.categories.find((c) => c.name === category)?.sectors ?? [];

  const sectorRoles =
    CONFIG.sectors.find((s) => s.name === sector)?.roles ?? [];

  const MAX_CV_BYTES = 5 * 1024 * 1024;
  const ACCEPTED_CV_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  /* Scroll lock + Escape */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  /* Reset on close */
  useEffect(() => {
    if (isOpen) return;
    setFullName("");
    setEmail("");
    setLink("");
    setCvFile(null);
    setMessage("");
    setCategory("");
    setSector("");
    setRole("");
    setCareerStatus("");
    setExperienceLevel("");
    setLocation("");
    setWorkMode("");
    setErrors({});
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setCvFile(null);
      setErrors((prev) => ({ ...prev, cv: "" }));
      return;
    }
    if (!ACCEPTED_CV_TYPES.includes(file.type)) {
      setCvFile(null);
      setErrors((prev) => ({ ...prev, cv: "Upload a PDF, DOC, or DOCX file." }));
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setCvFile(null);
      setErrors((prev) => ({ ...prev, cv: "File is too large (max 5 MB)." }));
      return;
    }
    setCvFile(file);
    setErrors((prev) => ({ ...prev, cv: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) next.fullName = "Enter your full name.";
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!emailPattern.test(email))
      next.email = "Enter a valid email address.";
    if (!category) next.category = "Choose a category.";
    if (!sector) next.sector = "Choose a sector.";
    if (!role) next.role = "Choose the closest role.";
    if (!experienceLevel) next.experienceLevel = "Pick your level.";
    if (!location) next.location = "Choose a location.";
    if (careerStatus && careerStatus === "" /* optional → skip */) {
      // career status is optional; no error
    }
    if (link && !/^https?:\/\/.+/.test(link))
      next.link = "Include https:// at the start of the link.";

    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("full_name", fullName.trim());
    formData.append("email", email.trim());
    formData.append("category", category);
    formData.append("sector", sector);
    formData.append("role", role);
    formData.append("career_status", careerStatus);
    formData.append("experience_level", experienceLevel);
    formData.append("location", location);
    if (workMode) formData.append("work_mode", workMode);
    if (link) formData.append("link", link.trim());
    if (message) formData.append("message", message.trim());
    if (cvFile) formData.append("cv", cvFile);

    const result = await create(
      endpoints.accounts.publicTalentPool,
      formData,
    );

    if (result) setSubmitted(true);
  };

  const inputClass =
    "w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60";
  const labelClass = "text-sm font-medium text-ink-700";
  const errorClass = "min-h-[16px] text-xs text-red-600";
  const chipBase =
    "rounded-full border px-3 py-1.5 text-xs font-medium transition";
  const chipIdle =
    "border-line bg-surface text-ink-700 hover:border-brand-300 hover:bg-brand-50";
  const chipActive =
    "border-brand-500 bg-brand-500 text-white";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div className="fixed inset-0 bg-black/50" onClick={close} />

      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-line bg-surface shadow-xl">
        <div className="flex items-start justify-between gap-6 border-b border-line p-6">
          <div>
            <h2
              id="apply-modal-title"
              className="mb-1 text-xl font-semibold text-ink-900"
            >
              Join the talent pool
            </h2>
            <p className="max-w-md text-sm text-ink-600">
              Fill this in and we'll create your account automatically —
              we'll email your login details so you can track your
              application.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="rounded-lg p-2 text-lg text-ink-600 hover:bg-ink-100"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-6">
            <div className="rounded-xl bg-brand-50 p-6 text-brand-700">
              <h3 className="mb-2 text-lg font-semibold">
                You're on our radar.
              </h3>
              <p className="text-sm">
                Your details were saved and we've emailed your login
                credentials to <strong>{email}</strong>. Log in any time to
                update your profile.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName("");
                    setEmail("");
                    setLink("");
                    setCvFile(null);
                    setMessage("");
                    setCategory("");
                    setSector("");
                    setRole("");
                    setCareerStatus("");
                    setExperienceLevel("");
                    setLocation("");
                    setWorkMode("");
                    setErrors({});
                  }}
                  className="rounded-lg border border-brand-500 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
                >
                  Submit another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid gap-4 p-6 md:grid-cols-2"
          >
            <Field
              label="Full name"
              id="m-fullName"
              value={fullName}
              onChange={setFullName}
              error={errors.fullName}
              autoComplete="name"
              inputClass={inputClass}
              labelClass={labelClass}
              errorClass={errorClass}
            />

            <Field
              label="Email address"
              id="m-email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              autoComplete="email"
              inputClass={inputClass}
              labelClass={labelClass}
              errorClass={errorClass}
            />

            {/* Category → Sector → Role cascade */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="m-category" className={labelClass}>
                Category
              </label>
              <select
                id="m-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSector("");
                  setRole("");
                }}
                className={inputClass}
              >
                <option value="">Select a category</option>
                {CONFIG.categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className={errorClass}>{errors.category ?? ""}</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="m-sector" className={labelClass}>
                Sector
              </label>
              <select
                id="m-sector"
                value={sector}
                onChange={(e) => {
                  setSector(e.target.value);
                  setRole("");
                }}
                disabled={!category}
                className={inputClass}
              >
                {!category ? (
                  <option value="">Select a category first</option>
                ) : (
                  <>
                    <option value="">Select a sector</option>
                    {categorySectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <div className={errorClass}>{errors.sector ?? ""}</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="m-role" className={labelClass}>
                Closest role
              </label>
              <select
                id="m-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!sector}
                className={inputClass}
              >
                {!sector ? (
                  <option value="">Select a sector first</option>
                ) : (
                  <>
                    <option value="">Select the closest role</option>
                    {sectorRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                    <option value="Other">Other / not listed</option>
                  </>
                )}
              </select>
              <div className={errorClass}>{errors.role ?? ""}</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="m-experience" className={labelClass}>
                Experience level
              </label>
              <select
          id="m-experience"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className={inputClass}
        >
          <option value="">Select your level</option>
          {CONFIG.experienceLevels.map((lvl) => (
            <option key={lvl.value} value={lvl.value}>
              {lvl.label}
            </option>
          ))}
        </select>
              <div className={errorClass}>
                {errors.experienceLevel ?? ""}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="m-career" className={labelClass}>
                Career status{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </label>
             <select
  id="m-career"
  value={careerStatus}
  onChange={(e) => setCareerStatus(e.target.value)}
  className={inputClass}
>
  <option value="">Select your status</option>
  {CONFIG.careerStatuses.map((s) => (
    <option key={s.value} value={s.value}>
      {s.label}
    </option>
  ))}
</select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="m-location" className={labelClass}>
                Location
              </label>
              <select
                id="m-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              >
                <option value="">Select a location</option>
                {CONFIG.locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <div className={errorClass}>{errors.location ?? ""}</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>
                Work mode{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </span>
              <div className="flex flex-wrap gap-2">
  {CONFIG.workModes.map((mode) => {
    const active = workMode === mode.value;
    return (
      <button
        key={mode.value}
        type="button"
        onClick={() =>
          setWorkMode((prev) => (prev === mode.value ? "" : mode.value))
        }
        className={`${chipBase} ${active ? chipActive : chipIdle}`}
        aria-pressed={active}
      >
        {mode.label}
      </button>
    );
  })}
</div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="m-link" className={labelClass}>
                LinkedIn or portfolio link{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </label>
              <input
                id="m-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://"
                autoComplete="url"
                className={inputClass}
              />
              <div className={errorClass}>{errors.link ?? ""}</div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="m-cv" className={labelClass}>
                Upload your CV{" "}
                <span className="font-normal text-ink-400">
                  (optional — PDF, DOC, or DOCX, max 5 MB)
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-2.5">
                <label
                  htmlFor="m-cv"
                  className="cursor-pointer rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
                >
                  Choose file
                </label>
                <input
                  id="m-cv"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleCvChange}
                  className="sr-only"
                />
                <span className="truncate text-sm text-ink-600">
                  {cvFile
                    ? `${cvFile.name} (${(cvFile.size / 1024).toFixed(0)} KB)`
                    : "No file selected"}
                </span>
                {cvFile && (
                  <button
                    type="button"
                    onClick={() => setCvFile(null)}
                    className="ml-auto text-xs text-ink-600 underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className={errorClass}>{errors.cv ?? ""}</div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="m-message" className={labelClass}>
                Anything you'd like us to know{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </label>
              <textarea
                id="m-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Current role, notice period, what you're looking for next..."
                className={`${inputClass} min-h-[96px] resize-y`}
              />
            </div>

            {serverError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 md:col-span-2">
                {serverError}
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-end gap-3 md:col-span-2">
              <button
                type="button"
                onClick={close}
                disabled={submitting}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send my profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------------ Field ------------------------ */

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputClass: string;
  labelClass: string;
  errorClass: string;
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  inputClass,
  labelClass,
  errorClass,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`${inputClass} ${error ? "border-red-500" : ""}`}
      />
      <div className={errorClass}>{error ?? ""}</div>
    </div>
  );
}