import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useData } from "../../../hooks/useData";
import { useUpdate } from "../../../hooks/useUpdate";
import { endpoints } from "../../../api/endpoints";

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
  } = useData<JobSeekerProfileData>(
    endpoints.accounts.jobSeeker
  );

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

  /*
   * Populate the form when the profile
   * is loaded from the backend.
   */
  useEffect(() => {
    if (!profile) {
      return;
    }

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

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfilePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    setProfilePhoto(file);
  };

  const handleCvChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    setCv(file);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const data = new FormData();

    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    data.append(
      "professional_title",
      formData.professional_title
    );
    data.append("about", formData.about);
    data.append("skills", formData.skills);
    data.append("education", formData.education);
    data.append("experience", formData.experience);

    if (profilePhoto) {
      data.append("profile_photo", profilePhoto);
    }

    if (cv) {
      data.append("cv", cv);
    }

    const result = await update(
      endpoints.accounts.jobSeeker,
      data
    );

    if (result) {
      console.log("Profile updated successfully:", result);
    }
  };

  if (profileLoading) {
    return <div>Loading profile...</div>;
  }

  if (profileError) {
    return (
      <div>
        <h1>Create Job Seeker Profile</h1>
        <p>{profileError}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Create Job Seeker Profile</h1>

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
          <label htmlFor="first_name">
            First Name
          </label>

          <input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="last_name">
            Last Name
          </label>

          <input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="profile_photo">
            Profile Photo
          </label>

          <input
            id="profile_photo"
            name="profile_photo"
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
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
          <label htmlFor="location">
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="professional_title">
            Professional Title
          </label>

          <input
            id="professional_title"
            name="professional_title"
            type="text"
            value={formData.professional_title}
            onChange={handleChange}
            placeholder="e.g. Software Developer"
          />
        </div>

        <div>
          <label htmlFor="about">
            About
          </label>

          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows={5}
            placeholder="Tell employers about yourself..."
          />
        </div>

        <div>
          <label htmlFor="skills">
            Skills
          </label>

          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows={4}
            placeholder="e.g. Python, Django, React, TypeScript"
          />
        </div>

        <div>
          <label htmlFor="education">
            Education
          </label>

          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            rows={5}
            placeholder="Enter your education..."
          />
        </div>

        <div>
          <label htmlFor="experience">
            Experience
          </label>

          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows={6}
            placeholder="Describe your work experience..."
          />
        </div>

        <div>
          <label htmlFor="cv">
            CV / Resume
          </label>

          <input
            id="cv"
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCvChange}
          />
        </div>

        <button
          type="submit"
          disabled={updateLoading}
        >
          {updateLoading
            ? "Saving..."
            : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default JobSeekerProfile;