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
};