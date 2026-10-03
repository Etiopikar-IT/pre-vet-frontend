export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "TEMPORARY"
  | "INTERNSHIP";

export type JobStatus =
  | "DRAFT"
  | "PENDING"
  | "PUBLISHED"
  | "CLOSED"
  | "REJECTED";

export interface Job {
  id: number;
  company: number;
  company_name: string;

  title: string;
  description: string;
  requirements: string;
  responsibilities: string;

  location: string;
  employment_type: EmploymentType;

  salary_min: string | null;
  salary_max: string | null;
  salary_currency: string;

  application_deadline: string | null;

  status: JobStatus;
  rejection_reason: string;

  created_at: string;
  updated_at: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  location?: string;
  employment_type: EmploymentType;
  salary_min?: string | null;
  salary_max?: string | null;
  salary_currency?: string;
  application_deadline?: string | null;
}

export interface JobApplication {
  id: number;

  job: number;
  job_title: string;
  company_name: string;
  job_seeker_name: string;

  cover_letter: string;

  status:
    | "SUBMITTED"
    | "REVIEWING"
    | "SHORTLISTED"
    | "INTERVIEW"
    | "ACCEPTED"
    | "REJECTED";

  created_at: string;
  updated_at: string;
}

export interface CreateApplicationRequest {
  job: number;
  cover_letter?: string;
}