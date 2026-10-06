interface ApplyPageHeaderProps {
  title: string;
  jobTitle: string;
  companyName: string;
  location?: string;
}

export default function ApplyPageHeader({
  title,
  jobTitle,
  companyName,
  location,
}: ApplyPageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-ink-800">{title}</h1>
      <p className="mt-2 text-sm text-ink-500">
        {jobTitle} at {companyName}
        {location && ` · ${location}`}
      </p>
    </div>
  );
}