export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  linkedin?: string;
}

export interface Sector {
  name: string;
  roles: string[];
}

export interface Category {
  name: string;
  sectors: string[];
}

export const CONFIG = {
  companyName: "Pre-Vet",
  contactEmail: "talent@prevet.com",
  team: [] as TeamMember[],

  sectors: [
    { name: "Technology", roles: ["Software Engineer", "Product Manager", "Data Analyst", "QA Engineer"] },
    { name: "Construction & Engineering", roles: ["Site Engineer", "Project Manager", "Quantity Surveyor", "Architect", "Civil Engineer"] },
    { name: "Real Estate", roles: ["Property Manager", "Leasing Officer", "Facilities Manager", "Sales Consultant"] },
    { name: "Media & Communications", roles: ["Content Writer", "Video Editor", "PR Specialist", "Social Media Manager"] },
    { name: "Commercial & Sales", roles: ["Business Development", "Account Manager", "Sales Representative"] },
    { name: "Finance & Operations", roles: ["Accountant", "Financial Analyst", "Operations Manager"] },
    { name: "Creative & Brand", roles: ["Graphic Designer", "Brand Strategist", "Art Director"] },
    { name: "People & HR", roles: ["Talent Acquisition", "People Operations", "L&D Specialist"] },
    { name: "Legal & Compliance", roles: ["Legal Counsel", "Compliance Officer", "Contracts Administrator"] },
    { name: "Logistics & Supply Chain", roles: ["Procurement Officer", "Warehouse Manager", "Logistics Coordinator"] },
    { name: "Manufacturing & Industrial", roles: ["Production Supervisor", "Quality Control Inspector", "Maintenance Technician"] },
    { name: "Healthcare", roles: ["Nurse", "Medical Officer", "Health Administrator"] },
    { name: "Hospitality & Tourism", roles: ["Hotel Manager", "Guest Relations Officer", "Chef"] },
    { name: "Education & Training", roles: ["Instructor", "Curriculum Developer", "Training Coordinator"] },
    { name: "Agriculture & Agribusiness", roles: ["Agronomist", "Farm Operations Manager", "Supply Chain Analyst"] },
    { name: "Energy & Utilities", roles: ["Electrical Engineer", "Field Technician", "Energy Analyst"] },
  ] as Sector[],

  /**
   * Higher-level groupings for the category → sector cascade.
   * Every sector name here MUST exist in `sectors` above.
   */
  categories: [
    {
      name: "Technology & Product",
      sectors: ["Technology"],
    },
    {
      name: "Engineering & Built Environment",
      sectors: ["Construction & Engineering", "Real Estate", "Energy & Utilities"],
    },
    {
      name: "Creative & Media",
      sectors: ["Media & Communications", "Creative & Brand"],
    },
    {
      name: "Commercial",
      sectors: ["Commercial & Sales", "Finance & Operations"],
    },
    {
      name: "People & Legal",
      sectors: ["People & HR", "Legal & Compliance"],
    },
    {
      name: "Operations & Industry",
      sectors: [
        "Logistics & Supply Chain",
        "Manufacturing & Industrial",
        "Agriculture & Agribusiness",
      ],
    },
    {
      name: "Services",
      sectors: ["Healthcare", "Hospitality & Tourism", "Education & Training"],
    },
  ] as Category[],

 /** Seniority bands for the experience-level filter. */
experienceLevels: [
  { value: "INTERN",    label: "Intern" },
  { value: "JUNIOR",    label: "Junior (0–2 yrs)" },
  { value: "MID",       label: "Mid-level (3–5 yrs)" },
  { value: "SENIOR",    label: "Senior (5–8 yrs)" },
  { value: "LEAD",      label: "Lead / Staff (8+ yrs)" },
  { value: "PRINCIPAL", label: "Principal / Head" },
] as const,

/** Current situation for the career-status filter. */
careerStatuses: [
  { value: "ACTIVELY_LOOKING", label: "Actively looking" },
  { value: "OPEN",             label: "Open to opportunities" },
  { value: "EXPLORING",        label: "Exploring options" },
  { value: "NOT_LOOKING",      label: "Not looking right now" },
  { value: "LAID_OFF",         label: "Recently laid off" },
  { value: "RETURNING",        label: "Returning to the workforce" },
] as const,

/** How candidates want to work. Rendered as chips. */
workModes: [
  { value: "ON_SITE", label: "On-site" },
  { value: "HYBRID",  label: "Hybrid" },
  { value: "REMOTE",  label: "Remote" },
] as const,

  /** Locations — swap or extend for your market. */
  locations: [
  "Addis Ababa",
  "Adama",
  "Bahir Dar",
  "Dire Dawa",
  "Gondar",
  "Hawassa",
  "Jimma",
  "Mekelle",
  "Dessie",
  "Jijiga",
  "Remote — Ethiopia",
] as const,
} as const;