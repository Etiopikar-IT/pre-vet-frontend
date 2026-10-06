export interface CompanyProfileData {
  id: string;
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

const ALL_REQUIRED: string[] = [
  "company name",
  "industry",
  "description",
  "address",
  "phone",
];

export function missingProfileFields(
  profile: CompanyProfileData | null | undefined,
): string[] {
  if (!profile) return ALL_REQUIRED;

  const missing: string[] = [];
  if (!profile.company_name?.trim()) missing.push("company name");
  if (!profile.industry?.trim()) missing.push("industry");
  if (!profile.description?.trim()) missing.push("description");
  if (!profile.address?.trim()) missing.push("address");
  if (!profile.phone?.trim()) missing.push("phone");
  return missing;
}

export function isProfileComplete(
  profile: CompanyProfileData | null | undefined,
): boolean {
  return missingProfileFields(profile).length === 0;
}