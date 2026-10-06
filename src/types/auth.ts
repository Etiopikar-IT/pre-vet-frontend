export type UserType = "COMPANY" | "JOB_SEEKER";

export interface User {
  id: number;
  email: string;
  user_type: UserType;
  is_active: boolean;
  has_profile: boolean;   
  company_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  user_type: UserType;
  password: string;
  re_password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}