import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { CONFIG } from "./config";
import Reveal from "./Reveal";
import { endpoints } from "../../api/endpoints";
import { useCreate } from "../../hooks/useCreate";

interface TalentPoolResponse {
  detail: string;
  created: boolean;
}

export default function ApplySection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [role, setRole] = useState("");
  const [link, setLink] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const {
    create,
    loading: submitting,
    error: serverError,
    reset: resetCreate,
  } = useCreate<TalentPoolResponse>();

  const sectorRoles =
    CONFIG.sectors.find((s) => s.name === sector)?.roles ?? [];

  const MAX_CV_BYTES = 5 * 1024 * 1024;
  const ACCEPTED_CV_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setCvFile(null);
      setErrors((prev) => ({ ...prev, cv: "" }));
      return;
    }
    if (!ACCEPTED_CV_TYPES.includes(file.type)) {
      setCvFile(null);
      setErrors((prev) => ({
        ...prev,
        cv: "Upload a PDF, DOC, or DOCX file.",
      }));
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setCvFile(null);
      setErrors((prev) => ({
        ...prev,
        cv: "File is too large (max 5 MB).",
      }));
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
    if (!sector) next.sector = "Choose a sector.";
    if (!role) next.role = "Choose the closest role.";
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
    formData.append("sector", sector);
    formData.append("role", role);
    if (link) formData.append("link", link.trim());
    if (message) formData.append("message", message.trim());
    if (cvFile) formData.append("cv", cvFile);

    const result = await create(
      endpoints.accounts.publicTalentPool,
      formData,
    );

    if (result) setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    resetCreate();
  };

  const inputClass =
    "rounded-sm border px-3.5 py-3 text-[15px] outline-none transition focus:border-[var(--public-teal)] focus:ring-[3px] focus:ring-[rgba(31,74,68,0.14)]";

  const inputStyle = {
    background: "var(--public-paper)",
    color: "var(--public-ink)",
    borderColor: "rgba(24,26,22,0.25)",
  };

  const labelClass = "text-[13px] font-medium text-[rgba(24,26,22,0.85)]";

  return (
    <section id="apply" className="px-8 py-24">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mb-12">
          <h2
            className="mb-4 max-w-[18ch] text-[clamp(30px,4vw,46px)] leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Ready to be on our radar?
          </h2>
          <p
            className="max-w-[48ch] text-[16px] leading-relaxed"
            style={{ color: "rgba(24,26,22,0.75)" }}
          >
            Fill this in and we'll create your account automatically —
            we'll email your login details so you can track your
            application.
          </p>
        </Reveal>

        {submitted ? (
          <div
            className="p-10"
            style={{
              background: "var(--public-teal)",
              color: "var(--public-paper)",
            }}
          >
            <h3
              className="mb-2.5 text-[22px]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              You're on our radar.
            </h3>
            <p
              className="text-[14.5px] leading-relaxed"
              style={{ color: "rgba(246,243,236,0.85)" }}
            >
              Your details were saved and we've emailed your login
              credentials to <strong>{email}</strong>. You can now log in
              to track your application and update your profile. Didn't
              get the email? Check your spam folder, or use the{" "}
              <Link to="/forgot-password" className="underline">
                forgot password
              </Link>{" "}
              flow.{" "}
              <button
                type="button"
                onClick={handleReset}
                className="underline"
              >
                Submit another
              </button>
              .
            </p>
          </div>
        ) : (
          <Reveal className="grid gap-6 border p-10 md:grid-cols-2">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="grid gap-6 md:col-span-2 md:grid-cols-2"
            >
              <div
                className="md:col-span-2 grid gap-6 border p-10 md:grid-cols-2"
                style={{
                  background: "var(--public-paper-raised)",
                  borderColor: "var(--public-line)",
                }}
              >
                <Field
                  label="Full name"
                  id="fullName"
                  value={fullName}
                  onChange={setFullName}
                  error={errors.fullName}
                  autoComplete="name"
                  inputClass={inputClass}
                  inputStyle={inputStyle}
                  labelClass={labelClass}
                />

                <Field
                  label="Email address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  error={errors.email}
                  autoComplete="email"
                  inputClass={inputClass}
                  inputStyle={inputStyle}
                  labelClass={labelClass}
                />

                <div className="flex flex-col gap-2">
                  <label htmlFor="sector" className={labelClass}>
                    Sector
                  </label>
                  <select
                    id="sector"
                    value={sector}
                    onChange={(e) => {
                      setSector(e.target.value);
                      setRole("");
                    }}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Select a sector</option>
                    {CONFIG.sectors.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <div className="min-h-[15px] text-[12.5px] text-[var(--public-error)]">
                    {errors.sector ?? ""}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="role" className={labelClass}>
                    Closest role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={!sector}
                    className={inputClass}
                    style={{
                      ...inputStyle,
                      opacity: sector ? 1 : 0.5,
                    }}
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
                  <div className="min-h-[15px] text-[12.5px] text-[var(--public-error)]">
                    {errors.role ?? ""}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="link" className={labelClass}>
                    LinkedIn or portfolio link{" "}
                    <span
                      className="font-normal"
                      style={{ color: "rgba(24,26,22,0.45)" }}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    id="link"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://"
                    autoComplete="url"
                    className={inputClass}
                    style={inputStyle}
                  />
                  <div className="min-h-[15px] text-[12.5px] text-[var(--public-error)]">
                    {errors.link ?? ""}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="cv" className={labelClass}>
                    Upload your CV{" "}
                    <span
                      className="font-normal"
                      style={{ color: "rgba(24,26,22,0.45)" }}
                    >
                      (optional — PDF, DOC, or DOCX, max 5 MB)
                    </span>
                  </label>

                  <div
                    className="flex flex-wrap items-center gap-3 rounded-sm border px-3.5 py-3"
                    style={{
                      background: "var(--public-paper)",
                      borderColor: errors.cv
                        ? "var(--public-error)"
                        : "rgba(24,26,22,0.25)",
                    }}
                  >
                    <label
                      htmlFor="cv"
                      className="cursor-pointer rounded-sm px-4 py-2 text-[13.5px] font-medium"
                      style={{
                        background: "var(--public-teal)",
                        color: "var(--public-paper)",
                      }}
                    >
                      Choose file
                    </label>
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleCvChange}
                      className="sr-only"
                    />
                    <span
                      className="truncate text-[13.5px]"
                      style={{ color: "rgba(24,26,22,0.75)" }}
                    >
                      {cvFile
                        ? `${cvFile.name} (${(cvFile.size / 1024).toFixed(0)} KB)`
                        : "No file selected"}
                    </span>
                    {cvFile && (
                      <button
                        type="button"
                        onClick={() => setCvFile(null)}
                        className="ml-auto text-[12.5px] underline"
                        style={{ color: "rgba(24,26,22,0.65)" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="min-h-[15px] text-[12.5px] text-[var(--public-error)]">
                    {errors.cv ?? ""}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="message" className={labelClass}>
                    Anything you'd like us to know{" "}
                    <span
                      className="font-normal"
                      style={{ color: "rgba(24,26,22,0.45)" }}
                    >
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Current role, notice period, what you're looking for next..."
                    className={inputClass}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: 96,
                    }}
                  />
                </div>

                {serverError && (
                  <div
                    className="md:col-span-2 rounded-sm border p-3 text-[13px]"
                    style={{
                      background: "rgba(220,38,38,0.06)",
                      borderColor: "rgba(220,38,38,0.35)",
                      color: "rgb(185,28,28)",
                    }}
                  >
                    {serverError}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-5 md:col-span-2 md:mt-2">
                  <div
                    className="max-w-[36ch] text-[12.5px]"
                    style={{ color: "rgba(24,26,22,0.55)" }}
                  >
                    We'll only use this to consider you for future roles
                    in your sector — see the privacy note above.
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-sm px-7 py-3.5 text-[15px] font-medium transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: "var(--public-teal)",
                      color: "var(--public-paper)",
                    }}
                  >
                    {submitting ? "Sending..." : "Send my profile"}
                  </button>
                </div>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputClass: string;
  inputStyle: React.CSSProperties;
  labelClass: string;
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
  inputStyle,
  labelClass,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={inputClass}
        style={{
          ...inputStyle,
          borderColor: error ? "var(--public-error)" : inputStyle.borderColor,
        }}
      />
      <div className="min-h-[15px] text-[12.5px] text-[var(--public-error)]">
        {error ?? ""}
      </div>
    </div>
  );
}