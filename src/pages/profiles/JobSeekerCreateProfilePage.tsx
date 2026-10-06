import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCreate } from "../../hooks/useCreate";
import { useAuth } from "../../context/AuthContext";
import { endpoints } from "../../api/endpoints";

import StatusBanner from "../../components/common/StatusBanner";
import ConsentModal from "../../components/common/ConsentModal";

interface JobSeekerProfileData {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  banner: string | null;
  phone: string;
  location: string;
  professional_title: string;
  about: string;
  skills: string;
  education: string;
  experience: string;
  cv: string | null;
  cv_consent_given_at?: string | null;
  approval_status?: string;
  rejection_reason?: string;
}

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

const labelClass =
  "mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500";

type SectionId =
  | "basic"
  | "banner"
  | "about"
  | "experience"
  | "education"
  | "files";

export default function JobSeekerCreateProfilePage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const { create, loading, error } = useCreate<JobSeekerProfileData>();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    professional_title: "",
    about: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [openSection, setOpenSection] = useState<SectionId | null>("basic");

  const [showConsent, setShowConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const toggleSection = (sid: SectionId) => {
    setOpenSection((prev) => (prev === sid ? null : sid));
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleProfilePhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setProfilePhoto(event.target.files?.[0] ?? null);
  };

  const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBanner(event.target.files?.[0] ?? null);
  };

  const handleCvChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCv(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // First submission attempt: open the consent modal instead.
    if (!hasConsented) {
      setShowConsent(true);
      return;
    }

    void submitProfile();
  };

  const submitProfile = async () => {
    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    data.append("professional_title", formData.professional_title);
    data.append("about", formData.about);
    data.append("skills", formData.skills);
    data.append("education", formData.education);
    data.append("experience", formData.experience);

    if (profilePhoto) data.append("profile_photo", profilePhoto);
    if (banner) data.append("banner", banner);
    if (cv) data.append("cv", cv);

    // Consent flag for the backend to record.
    data.append("cv_consent", "true");

    const result = await create(endpoints.accounts.jobSeeker, data);

    if (result) {
      await refreshUser();
      navigate("/job-seeker/profile", {
        state: { message: "Profile created." },
      });
    }
  };

  const handleConfirmConsent = () => {
    setHasConsented(true);
    setShowConsent(false);
    // Continue the submit immediately after consent.
    void submitProfile();
  };

  const handleCancelConsent = () => {
    setShowConsent(false);
  };

  const fullName = [formData.first_name, formData.last_name]
    .filter(Boolean)
    .join(" ");

  const summaries: Record<SectionId, string> = {
    basic: fullName
      ? [fullName, formData.professional_title, formData.location]
          .filter(Boolean)
          .join(" · ")
      : "Name, contact info and professional title",
    banner: banner
      ? "Banner selected"
      : "No banner — default will be used",
    about:
      formData.about || formData.skills
        ? "Bio and skills added"
        : "Short bio and list of skills",
    experience: formData.experience
      ? "Work history added"
      : "Work history — one role per blank-line-separated block",
    education: formData.education
      ? "Education added"
      : "Degrees, diplomas and certifications",
    files:
      profilePhoto || cv
        ? [profilePhoto && "Photo", cv && "CV"]
            .filter(Boolean)
            .join(" · ")
        : "Profile photo and CV",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
          <Link to="/job-seeker/profile" className="hover:text-brand-600">
            My profile
          </Link>
          <span>/</span>
          <span className="text-ink-700">Create</span>
        </nav>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-800">
              Create your profile
            </h1>
            <p className="mt-1.5 text-sm text-ink-500">
              Help employers find you. You can update these details
              anytime.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>

        {error && (
          <StatusBanner variant="error" className="mb-5">
            {error}
          </StatusBanner>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              {/* Section 1: Basic */}
              <CollapsibleSection
                id="basic"
                number={1}
                title="Basic information"
                description="Name, contact and professional title."
                summary={summaries.basic}
                isOpen={openSection === "basic"}
                onToggle={toggleSection}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first_name" className={labelClass}>
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Jane"
                      onInvalid={() => setOpenSection("basic")}
                    />
                  </div>

                  <div>
                    <label htmlFor="last_name" className={labelClass}>
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Doe"
                      onInvalid={() => setOpenSection("basic")}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="+251 ..."
                    />
                  </div>

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

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="professional_title"
                      className={labelClass}
                    >
                      Professional title
                    </label>
                    <input
                      id="professional_title"
                      name="professional_title"
                      type="text"
                      value={formData.professional_title}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. Software Developer"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Section 2: Banner */}
              <CollapsibleSection
                id="banner"
                number={2}
                title="Cover banner"
                description="Shown at the top of your public profile."
                summary={summaries.banner}
                isOpen={openSection === "banner"}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {banner ? (
                      <img
                        src={URL.createObjectURL(banner)}
                        alt="Banner preview"
                        className="h-16 w-28 shrink-0 rounded-xl border border-line object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-[11px] text-ink-500">
                        No banner
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <input
                        id="banner"
                        name="banner"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none file:mr-4 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                      />
                    </div>
                  </div>

                  {banner && (
                    <p className="text-xs text-emerald-600">
                      Banner selected. It will be uploaded when you save.
                    </p>
                  )}

                  <p className="text-xs text-ink-500">
                    Recommended: 1600×400 pixels or wider. Landscape
                    orientation works best.
                  </p>
                </div>
              </CollapsibleSection>

              {/* Section 3: About */}
              <CollapsibleSection
                id="about"
                number={3}
                title="About you"
                description="Short bio and skills."
                summary={summaries.about}
                isOpen={openSection === "about"}
                onToggle={toggleSection}
              >
                <div className="space-y-5">
                  <div>
                    <label htmlFor="about" className={labelClass}>
                      About
                    </label>
                    <textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      rows={5}
                      className={inputClass}
                      placeholder="Tell employers about yourself..."
                    />
                  </div>

                  <div>
                    <label htmlFor="skills" className={labelClass}>
                      Skills
                    </label>
                    <textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      rows={4}
                      className={inputClass}
                      placeholder="e.g. Python, Django, React, TypeScript"
                    />
                    <p className="mt-1.5 text-xs text-ink-500">
                      Separate skills with commas.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Section 4: Experience */}
              <CollapsibleSection
                id="experience"
                number={4}
                title="Experience"
                description="Your work history."
                summary={summaries.experience}
                isOpen={openSection === "experience"}
                onToggle={toggleSection}
              >
                <div>
                  <label htmlFor="experience" className={labelClass}>
                    Experience
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={8}
                    className={inputClass}
                    placeholder={`Software Developer at Acme, 2023–Present\nBuilt and shipped several production apps.\n\nJunior Developer at Foo, 2021–2023\nWorked on the internal tools team.`}
                  />
                  <p className="mt-1.5 text-xs text-ink-500">
                    Separate each role with a blank line. The first line
                    becomes the header.
                  </p>
                </div>
              </CollapsibleSection>

              {/* Section 5: Education */}
              <CollapsibleSection
                id="education"
                number={5}
                title="Education"
                description="Degrees, diplomas and certifications."
                summary={summaries.education}
                isOpen={openSection === "education"}
                onToggle={toggleSection}
              >
                <div>
                  <label htmlFor="education" className={labelClass}>
                    Education
                  </label>
                  <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={6}
                    className={inputClass}
                    placeholder={`BSc in Computer Science, Addis Ababa University, 2019–2023\n\nAWS Solutions Architect Certification, 2024`}
                  />
                  <p className="mt-1.5 text-xs text-ink-500">
                    Separate each entry with a blank line.
                  </p>
                </div>
              </CollapsibleSection>

              {/* Section 6: Files */}
              <CollapsibleSection
                id="files"
                number={6}
                title="Files"
                description="Profile photo and CV."
                summary={summaries.files}
                isOpen={openSection === "files"}
                onToggle={toggleSection}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="profile_photo"
                      className={labelClass}
                    >
                      Profile photo
                    </label>
                    <input
                      id="profile_photo"
                      name="profile_photo"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                      className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition file:mr-4 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                    />
                    {profilePhoto && (
                      <p className="mt-1.5 text-xs text-emerald-600">
                        Photo selected.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cv" className={labelClass}>
                      CV / Resume
                    </label>
                    <input
                      id="cv"
                      name="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvChange}
                      className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition file:mr-4 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                    />
                    {cv && (
                      <p className="mt-1.5 text-xs text-emerald-600">
                        CV selected.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                  <p className="font-medium">
                    Heads up — you'll be asked to consent
                  </p>
                  <p className="mt-1 leading-relaxed text-amber-800/80">
                    Before your profile is submitted, you'll be asked
                    whether companies on Pre-Vet may view and download
                    your CV. You can withdraw this consent later at any
                    time.
                  </p>
                </div>
              </CollapsibleSection>

              <div className="hidden items-center justify-end gap-3 border-t border-line pt-6 lg:flex">
                <Link
                  to="/dashboard"
                  className="rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create profile"}
                </button>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Profile preview
                </h3>

                <div className="space-y-3">
                  <PreviewRow
                    label="Name"
                    value={fullName || "Unnamed user"}
                  />
                  <PreviewRow
                    label="Title"
                    value={
                      formData.professional_title || "Not specified"
                    }
                  />
                  <PreviewRow
                    label="Location"
                    value={formData.location || "Not specified"}
                  />
                  <PreviewRow
                    label="Banner"
                    value={banner ? "New file ready" : "Using default"}
                  />
                  <PreviewRow
                    label="CV"
                    value={cv ? "New file ready" : "Not uploaded"}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                    i
                  </span>
                  <h3 className="text-sm font-semibold text-brand-700">
                    Tips
                  </h3>
                </div>
                <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-brand-700/80">
                  <li>
                    Pick a <strong>landscape banner</strong> (1600×400 or
                    wider).
                  </li>
                  <li>
                    Keep your <strong>professional title</strong> focused.
                  </li>
                  <li>
                    List <strong>5–10 skills</strong> separated by commas.
                  </li>
                  <li>
                    Upload an up-to-date <strong>CV</strong>.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                  Review process
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-amber-800/80">
                  Once you create your profile, an admin will review it.
                  You'll be notified when it's approved and can start
                  applying to jobs.
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-6 lg:hidden">
            <Link
              to="/dashboard"
              className="rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Consent modal */}
      <ConsentModal
        open={showConsent}
        title="Share your CV with companies?"
        onCancel={handleCancelConsent}
        onConfirm={handleConfirmConsent}
        confirmLabel="Yes, I agree"
        cancelLabel="Not now"
      >
        <p>
          By creating your profile, you agree that companies on Pre-Vet
          may view and download your CV and profile information for the
          purpose of evaluating you for job opportunities.
        </p>

        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs text-ink-500">
          <li>
            Your CV will only be visible to companies with approved
            accounts.
          </li>
          <li>
            You can remove your CV or delete your profile at any time.
          </li>
          <li>
            We never share your data with third parties without your
            consent.
          </li>
        </ul>

        <p className="mt-4 text-xs text-ink-500">
          You can withdraw this consent later from your profile settings.
        </p>
      </ConsentModal>
    </div>
  );
}

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