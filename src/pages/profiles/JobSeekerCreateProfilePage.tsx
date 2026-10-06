import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useData } from "../../hooks/useData";
import { useUpdate } from "../../hooks/useUpdate";
import { endpoints } from "../../api/endpoints";

interface JobSeekerProfileData {
  id?: number;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  phone: string;
  location: string;
  professional_title: string;
  about: string;
  skills: string;
  education: string;
  experience: string;
  cv: string | null;
  approval_status?: string;
  rejection_reason?: string;
}

const JobSeekerProfile = () => {
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useData<JobSeekerProfileData>(endpoints.accounts.jobSeeker);

  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdate<JobSeekerProfileData>();

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
  const [cv, setCv] = useState<File | null>(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!profile) return;

    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone: profile.phone || "",
      location: profile.location || "",
      professional_title: profile.professional_title || "",
      about: profile.about || "",
      skills: profile.skills || "",
      education: profile.education || "",
      experience: profile.experience || "",
    });
  }, [profile]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleProfilePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setProfilePhoto(event.target.files?.[0] ?? null);
  };

  const handleCvChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCv(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");

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
    if (cv) data.append("cv", cv);

    const result = await update(endpoints.accounts.jobSeeker, data);

    if (result) {
      setSuccess("Profile saved successfully.");
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {profileError}
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Job Seeker Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Keep your profile up to date so employers can find you.
          </p>
        </div>

        {/* Status banners */}
        {profile?.approval_status && (
          <div
            className={`mb-5 rounded-lg px-4 py-3 text-sm ${
              profile.approval_status === "APPROVED"
                ? "border border-green-200 bg-green-50 text-green-700"
                : profile.approval_status === "REJECTED"
                  ? "border border-red-200 bg-red-50 text-red-600"
                  : "border border-yellow-200 bg-yellow-50 text-yellow-700"
            }`}
          >
            <span className="font-medium">Profile status:</span>{" "}
            {profile.approval_status}
          </div>
        )}

        {profile?.rejection_reason && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span className="font-medium">Rejection reason:</span>{" "}
            {profile.rejection_reason}
          </div>
        )}

        {updateError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {updateError}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Basic info */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Basic information
              </h2>

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
                  <label htmlFor="professional_title" className={labelClass}>
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
            </section>

            {/* Section: About */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                About you
              </h2>

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
                </div>
              </div>
            </section>

            {/* Section: Background */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Background
              </h2>

              <div className="space-y-5">
                <div>
                  <label htmlFor="education" className={labelClass}>
                    Education
                  </label>
                  <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={5}
                    className={inputClass}
                    placeholder="Enter your education..."
                  />
                </div>

                <div>
                  <label htmlFor="experience" className={labelClass}>
                    Experience
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={6}
                    className={inputClass}
                    placeholder="Describe your work experience..."
                  />
                </div>
              </div>
            </section>

            {/* Section: Files */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Files
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile_photo" className={labelClass}>
                    Profile photo
                  </label>
                  <input
                    id="profile_photo"
                    name="profile_photo"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {profile?.profile_photo && !profilePhoto && (
                    <p className="mt-2 text-xs text-gray-500">
                      Current file uploaded.
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {profile?.cv && !cv && (
                    <p className="mt-2 text-xs text-gray-500">
                      Current file uploaded.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t pt-6">
              <button
                type="submit"
                disabled={updateLoading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;