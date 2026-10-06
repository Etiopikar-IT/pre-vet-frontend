import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useData } from "../hooks/useData";
import { useUpdate } from "../hooks/useUpdate";
import { endpoints } from "../api/endpoints";

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

const CompanyProfile = () => {
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useData<CompanyProfileData>(
    endpoints.accounts.company
  );

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

  useEffect(() => {
    if (!profile) {
      return;
    }

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
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    setLogo(file);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const data = new FormData();

    data.append("company_name", formData.company_name);
    data.append("description", formData.description);
    data.append("industry", formData.industry);
    data.append("website", formData.website);
    data.append("phone", formData.phone);
    data.append("address", formData.address);

    if (logo) {
      data.append("logo", logo);
    }

    const result = await update(
      endpoints.accounts.company,
      data
    );

    if (result) {
      console.log(
        "Company profile updated successfully:",
        result
      );
    }
  };

  if (profileLoading) {
    return <div>Loading company profile...</div>;
  }

  if (profileError) {
    return (
      <div>
        <h1>Create Company Profile</h1>
        <p>{profileError}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Create Company Profile</h1>

      {updateError && (
        <p>{updateError}</p>
      )}

      {profile?.approval_status && (
        <p>
          Profile status:{" "}
          {profile.approval_status}
        </p>
      )}

      {profile?.rejection_reason && (
        <p>
          Rejection reason:{" "}
          {profile.rejection_reason}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="company_name">
            Company Name
          </label>

          <input
            id="company_name"
            name="company_name"
            type="text"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="logo">
            Company Logo
          </label>

          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>

        <div>
          <label htmlFor="description">
            Company Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Tell job seekers about your company..."
          />
        </div>

        <div>
          <label htmlFor="industry">
            Industry
          </label>

          <input
            id="industry"
            name="industry"
            type="text"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g. Information Technology"
          />
        </div>

        <div>
          <label htmlFor="website">
            Website
          </label>

          <input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="phone">
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="address">
            Address
          </label>

          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            placeholder="Company address"
          />
        </div>

        <button
          type="submit"
          disabled={updateLoading}
        >
          {updateLoading
            ? "Saving..."
            : "Save Company Profile"}
        </button>
      </form>
    </div>
  );
};

export default CompanyProfile;