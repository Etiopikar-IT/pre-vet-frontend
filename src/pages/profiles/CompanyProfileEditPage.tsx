import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { useData } from "../../hooks/useData";
import { useUpdate } from "../../hooks/useUpdate";
import { useAuth } from "../../context/AuthContext";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBanner from "../../components/common/StatusBanner";

interface CompanyProfileData {
  id?: number;
  company_name: string;
  logo: string | null;
  banner: string | null;
  description: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
  approval_status?: string;
  rejection_reason?: string;
}

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

const labelClass =
  "mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500";

type SectionId = "identity" | "banner" | "about" | "contact" | "logo";

export default function CompanyProfileEditPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useData<CompanyProfileData>(endpoints.accounts.company);

  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdate<CompanyProfileData>();

  const [formData, setFormData] = useState({
    company_name: "",
    description: "",
    industry: "",
    website: "",
    phone: "",
    address: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [success, setSuccess] = useState("");
  const [openSection, setOpenSection] = useState<SectionId | null>(
    "identity",
  );

  useEffect(() => {
    if (!profile) return;

    setFormData({
      company_name: profile.company_name || "",
      description: profile.description || "",
      industry: profile.industry || "",
      website: profile.website || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
  }, [profile]);

  const toggleSection = (sid: SectionId) => {
    setOpenSection((prev) => (prev === sid ? null : sid));
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLogo(event.target.files?.[0] ?? null);
  };

  const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBanner(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");

    const data = new FormData();
    data.append("company_name", formData.company_name);
    data.append("description", formData.description);
    data.append("industry", formData.industry);
    data.append("website", formData.website);
    data.append("phone", formData.phone);
    data.append("address", formData.address);

    if (logo) data.append("logo", logo);
    if (banner) data.append("banner", banner);

    const result = await update(endpoints.accounts.company, data);

    if (result) {
      setSuccess("Company profile saved successfully.");
      await refreshUser();

      setTimeout(() => {
        navigate("/company/profile", {
          state: { message: "Company profile updated." },
        });
      }, 900);
    }
  };

  const summaries: Record<SectionId, string> = {
    identity: formData.company_name
      ? [formData.company_name, formData.industry]
          .filter(Boolean)
          .join(" · ")
      : "Company name and industry",
    banner: banner
      ? "New banner selected"
      : profile?.banner
        ? "Current banner uploaded"
        : "No banner — default will be used",
    about: formData.description
      ? `${formData.description.length} characters`
      : "A short description of what your company does",
    contact:
      formData.website || formData.phone || formData.address
        ? [formData.website, formData.phone, formData.address]
            .filter(Boolean)
            .join(" · ")
        : "Website, phone and address",
    logo: logo
      ? "New logo selected"
      : profile?.logo
        ? "Current logo uploaded"
        : "Company logo",
  };

  if (profileLoading) {
    return <LoadingSpinner label="Loading company profile..." />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-500">
          <Link to="/company/profile" className="hover:text-brand-600">
            Company profile
          </Link>
          <span>/</span>
          <span className="text-ink-700">Edit</span>
        </nav>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-800">
              Edit company profile
            </h1>
            <p className="mt-1.5 text-sm text-ink-500">
              Update your company details to attract the right candidates.
            </p>
          </div>

          <Link
            to="/company/profile"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            ← Back to company profile
          </Link>
        </div>

        {profile?.approval_status === "REJECTED" &&
          profile.rejection_reason && (
            <StatusBanner variant="error" className="mb-5">
              <span className="font-medium">Rejection reason:</span>{" "}
              {profile.rejection_reason}
            </StatusBanner>
          )}

        {updateError && (
          <StatusBanner variant="error" className="mb-5">
            {updateError}
          </StatusBanner>
        )}

        {profileError && (
          <StatusBanner variant="error" className="mb-5">
            {profileError}
          </StatusBanner>
        )}

        {success && (
          <StatusBanner variant="success" className="mb-5">
            {success}
          </StatusBanner>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              {/* Section 1: Identity */}
              <CollapsibleSection
                id="identity"
                number={1}
                title="Company identity"
                description="Name and industry."
                summary={summaries.identity}
                isOpen={openSection === "identity"}
                onToggle={toggleSection}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="company_name"
                      className={labelClass}
                    >
                      Company name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Acme Inc."
                      onInvalid={() => setOpenSection("identity")}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="industry" className={labelClass}>
                      Industry
                    </label>
                    <input
                      id="industry"
                      name="industry"
                      type="text"
                      value={formData.industry}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. Information Technology"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Section 2: Banner */}
              <CollapsibleSection
                id="banner"
                number={2}
                title="Cover banner"
                description="Shown at the top of your public company page."
                summary={summaries.banner}
                isOpen={openSection === "banner"}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {banner ? (
                      <img
                        src={URL.createObjectURL(banner)}
                        alt="New banner preview"
                        className="h-16 w-28 shrink-0 rounded-xl border border-line object-cover"
                      />
                    ) : profile?.banner ? (
                      <img
                        src={profile.banner}
                        alt="Current banner"
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
                      New banner selected — it will replace the current
                      one when you save.
                    </p>
                  )}

                  {profile?.banner && !banner && (
                    <p className="text-xs text-ink-500">
                      Current banner shown above. Choose a new file to
                      replace it.
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
                title="About the company"
                description="A short description of what you do."
                summary={summaries.about}
                isOpen={openSection === "about"}
                onToggle={toggleSection}
              >
                <div>
                  <label htmlFor="description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={inputClass}
                    placeholder="Tell job seekers about your company — mission, culture, what you're working on..."
                  />
                  <p className="mt-1.5 text-xs text-ink-500">
                    Aim for 2–4 short paragraphs. This appears on your
                    public profile.
                  </p>
                </div>
              </CollapsibleSection>

              {/* Section 4: Contact */}
              <CollapsibleSection
                id="contact"
                number={4}
                title="Contact details"
                description="How candidates can reach you."
                summary={summaries.contact}
                isOpen={openSection === "contact"}
                onToggle={toggleSection}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="website" className={labelClass}>
                      Website
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="https://example.com"
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

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className={labelClass}>
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Addis Ababa, Ethiopia"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Section 5: Logo */}
              <CollapsibleSection
                id="logo"
                number={5}
                title="Company logo"
                description="A square logo works best."
                summary={summaries.logo}
                isOpen={openSection === "logo"}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {logo ? (
                      <img
                        src={URL.createObjectURL(logo)}
                        alt="New logo preview"
                        className="h-16 w-16 shrink-0 rounded-xl border border-line object-cover"
                      />
                    ) : profile?.logo ? (
                      <img
                        src={profile.logo}
                        alt="Current logo"
                        className="h-16 w-16 shrink-0 rounded-xl border border-line object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl font-semibold text-brand-600">
                        {formData.company_name?.charAt(0).toUpperCase() ||
                          "?"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-800 outline-none transition file:mr-4 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                      />
                    </div>
                  </div>

                  {logo && (
                    <p className="text-xs text-emerald-600">
                      New logo selected — it will replace the current one
                      when you save.
                    </p>
                  )}

                  {profile?.logo && !logo && (
                    <p className="text-xs text-ink-500">
                      Current logo shown above. Choose a new file to
                      replace it.
                    </p>
                  )}
                </div>
              </CollapsibleSection>

              <div className="hidden items-center justify-end gap-3 border-t border-line pt-6 lg:flex">
                <Link
                  to="/company/profile"
                  className="rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateLoading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Company preview
                </h3>

                <div className="flex items-start gap-3">
                  {logo ? (
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="New logo"
                      className="h-14 w-14 shrink-0 rounded-xl border border-line object-cover"
                    />
                  ) : profile?.logo ? (
                    <img
                      src={profile.logo}
                      alt="Current logo"
                      className="h-14 w-14 shrink-0 rounded-xl border border-line object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg font-semibold text-brand-600">
                      {formData.company_name?.charAt(0).toUpperCase() ||
                        "?"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-800">
                      {formData.company_name || "Unnamed company"}
                    </p>
                    {formData.industry && (
                      <p className="truncate text-xs text-ink-500">
                        {formData.industry}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-line pt-4">
                  <PreviewRow
                    label="Banner"
                    value={
                      banner
                        ? "New file ready"
                        : profile?.banner
                          ? "Uploaded"
                          : "Using default"
                    }
                  />
                  <PreviewRow
                    label="Website"
                    value={
                      formData.website
                        ? formData.website.replace(/^https?:\/\//, "")
                        : "Not set"
                    }
                  />
                  <PreviewRow
                    label="Phone"
                    value={formData.phone || "Not set"}
                  />
                  <PreviewRow
                    label="Address"
                    value={formData.address || "Not set"}
                  />
                  <PreviewRow
                    label="Description"
                    value={
                      formData.description
                        ? `${formData.description.length} chars`
                        : "Empty"
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
                    Tips
                  </h3>
                </div>
                <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-brand-700/80">
                  <li>
                    Use your <strong>legal or trading name</strong> so
                    candidates can find you.
                  </li>
                  <li>
                    Pick a <strong>landscape banner</strong> (1600×400 or
                    wider).
                  </li>
                  <li>
                    A <strong>square logo</strong> at least 200×200 px
                    looks best.
                  </li>
                  <li>
                    Keep the <strong>description</strong> friendly and
                    specific.
                  </li>
                </ul>
              </div>

              {profile?.approval_status && (
                <div
                  className={`rounded-2xl border p-5 ${
                    profile.approval_status === "APPROVED"
                      ? "border-emerald-200 bg-emerald-50"
                      : profile.approval_status === "REJECTED"
                        ? "border-red-200 bg-red-50"
                        : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      profile.approval_status === "APPROVED"
                        ? "text-emerald-700"
                        : profile.approval_status === "REJECTED"
                          ? "text-red-600"
                          : "text-amber-800"
                    }`}
                  >
                    Status
                  </h3>
                  <p
                    className={`mt-1.5 text-sm font-medium ${
                      profile.approval_status === "APPROVED"
                        ? "text-emerald-700"
                        : profile.approval_status === "REJECTED"
                          ? "text-red-600"
                          : "text-amber-800"
                    }`}
                  >
                    {profile.approval_status}
                  </p>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      profile.approval_status === "APPROVED"
                        ? "text-emerald-700/80"
                        : profile.approval_status === "REJECTED"
                          ? "text-red-600/80"
                          : "text-amber-800/80"
                    }`}
                  >
                    {profile.approval_status === "APPROVED"
                      ? "Your company is live. Jobs you post go straight to review."
                      : profile.approval_status === "REJECTED"
                        ? "Update your profile and it will be reviewed again."
                        : "An admin will review your profile soon."}
                  </p>
                </div>
              )}
            </aside>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-6 lg:hidden">
            <Link
              to="/company/profile"
              className="rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={updateLoading}
              className="rounded-xl bg-brand-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateLoading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
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