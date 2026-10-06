import SectionCard from "../common/SectionCard";

interface ProfileSkillsProps {
  skills?: string;
  heading?: string;
}

export default function ProfileSkills({
  skills,
  heading = "Skills",
}: ProfileSkillsProps) {
  if (!skills) return null;

  const items = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <SectionCard title={heading}>
      <div className="flex flex-wrap gap-2">
        {items.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}