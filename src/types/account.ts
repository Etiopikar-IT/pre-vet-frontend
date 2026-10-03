export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface CompanyProfile {
  id: number;
  company_name: string;
  logo: string | null;
  description: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
  approval_status: ApprovalStatus;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
}

export interface JobSeekerProfile {
  id: number;
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
  approval_status: ApprovalStatus;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
}