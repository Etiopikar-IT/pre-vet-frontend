import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import { useData } from "../../hooks/useData";
import { useUpdate } from "../../hooks/useUpdate";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormField from "../../components/common/FormField";
import FileField from "../../components/common/FileField";
import FormSection from "../../components/common/FormSection";
import FormActions from "../../components/common/FormActions";
import ProfileFormShell from "../../components/profile/ProfileFormShell";

interface CompanyProfileData {
  id?: number;
  company_name: string;
  logo: string | null;
  description: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
  approval_status?: string;
  rejection_reason?: string;
}

export default function CompanyProfile() {
  const navigate = useNavigate();

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
  const [success, setSuccess] = useState("");

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

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLogo(event.target.files?.[0] ?? null);
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

    const result = await update(endpoints.accounts.company, data);

    if (result) {
      setSuccess("Company profile saved successfully.");

      setTimeout(() => {
        navigate("/company/profile");
      }, 900);
    }
  };

  if (profileLoading) {
    return <LoadingSpinner label="Loading company profile..." />;
  }

  return (
    <ProfileFormShell
      title="Company Profile"
      subtitle="Update your company details to attract the right candidates."
      approvalStatus={profile?.approval_status}
      rejectionReason={profile?.rejection_reason}
      error={updateError || profileError}
      success={success}
    >
      <div className="rounded-2xl border border-line bg-surface p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Company identity */}
          <FormSection title="Company identity">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="company_name"
                name="company_name"
                label="Company name"
                value={formData.company_name}
                onChange={handleChange}
                required
                placeholder="Acme Inc."
                colSpan={2}
              />

              <FileField
                id="logo"
                name="logo"
                label="Company logo"
                accept="image/*"
                onChange={handleLogoChange}
                hasExistingFile={!!profile?.logo}
                hasNewFile={!!logo}
                className="sm:col-span-2"
              />

              <FormField
                id="industry"
                name="industry"
                label="Industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Information Technology"
              />

              <FormField
                id="phone"
                name="phone"
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+251 ..."
              />

              <FormField
                id="website"
                name="website"
                label="Website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                colSpan={2}
              />
            </div>
          </FormSection>

          {/* Section: About the company */}
          <FormSection title="About the company">
            <div className="space-y-5">
              <FormField
                id="description"
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={6}
                placeholder="Tell job seekers about your company..."
              />

              <FormField
                id="address"
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Company address"
              />
            </div>
          </FormSection>

          <FormActions
            submitLabel="Save company profile"
            submittingLabel="Saving..."
            submitting={updateLoading}
            cancelTo="/company/profile"
          />
        </form>
      </div>
    </ProfileFormShell>
  );
}