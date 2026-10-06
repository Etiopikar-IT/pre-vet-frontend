import SectionCard from "../common/SectionCard";

interface ProfileContactProps {
  phone?: string;
  location?: string;
  cvUrl?: string | null;
  heading?: string;
}

export default function ProfileContact({
  phone,
  location,
  cvUrl,
  heading = "Contact & files",
}: ProfileContactProps) {
  const hasAny = phone || location || cvUrl;
  if (!hasAny) return null;

  return (
    <SectionCard title={heading}>
      <dl className="grid gap-6 sm:grid-cols-2">
        {phone && <DetailRow label="Phone" value={phone} />}
        {location && <DetailRow label="Location" value={location} />}

        <div className="sm:col-span-2">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
            CV
          </dt>
          <dd className="mt-1 text-sm text-ink-800">
            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-600 hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CV
              </a>
            ) : (
              <span className="italic text-ink-400">Not uploaded</span>
            )}
          </dd>
        </div>
      </dl>
    </SectionCard>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink-800">{value}</dd>
    </div>
  );
}