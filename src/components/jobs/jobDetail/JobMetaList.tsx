interface JobMetaListProps {
  salary: string;
  deadline: string;
  posted: string;
  className?: string;
}

export default function JobMetaList({
  salary,
  deadline,
  posted,
  className = "",
}: JobMetaListProps) {
  return (
    <div className={`rounded-xl bg-page p-4 ${className}`}>
      <dl className="space-y-3">
        <MetaItem label="Salary" value={salary} />
        <MetaItem label="Deadline" value={deadline} />
        <MetaItem label="Posted" value={posted} />
      </dl>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-ink-800">{value}</dd>
    </div>
  );
}