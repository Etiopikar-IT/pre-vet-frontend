import SectionCard from "../common/SectionCard";

interface ProfileExperienceProps {
  experience?: string;
  heading?: string | null;
}

export default function ProfileExperience({
  experience,
  heading = "Experience",
}: ProfileExperienceProps) {
  if (!experience) return null;

  const entries = experience
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const content = (
    <ol className="relative space-y-6 border-l border-line pl-6">
      {entries.map((block, index) => {
        const [firstLine, ...rest] = block.split("\n");
        const body = rest.join("\n").trim();

        return (
          <li key={index} className="relative">
            <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-surface" />
            <h3 className="text-sm font-semibold text-ink-800">
              {firstLine}
            </h3>
            {body && (
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-600">
                {body}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );

  if (heading === null) {
    return content;
  }

  return <SectionCard title={heading}>{content}</SectionCard>;
}