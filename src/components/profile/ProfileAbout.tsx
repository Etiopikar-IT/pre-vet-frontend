import SectionCard from "../common/SectionCard";

interface ProfileAboutProps {
  about?: string;
  heading?: string | null;
}

export default function ProfileAbout({
  about,
  heading = "About",
}: ProfileAboutProps) {
  if (!about) return null;

  const content = (
    <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">
      {about}
    </p>
  );

  if (heading === null) return content;
  return <SectionCard title={heading}>{content}</SectionCard>;
}