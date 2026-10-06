import SectionCard from "../common/SectionCard";

interface ProfileEducationProps {
  education?: string;
  heading?: string;
}

export default function ProfileEducation({
  education,
  heading = "Education",
}: ProfileEducationProps) {
  if (!education) return null;

  const entries = education
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <SectionCard title={heading}>
      <ol className="relative space-y-6 border-l border-line pl-6">
        {entries.map((block, index) => {
          const [firstLine, ...rest] = block.split("\n");
          const body = rest.join("\n").trim();

          return (
            <li key={index} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-ink-300 ring-4 ring-surface" />

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
    </SectionCard>
  );
}