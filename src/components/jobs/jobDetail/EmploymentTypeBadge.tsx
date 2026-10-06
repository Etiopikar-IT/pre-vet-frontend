interface EmploymentTypeBadgeProps {
  type: string;
  className?: string;
}

function classesFor(type: string): string {
  switch (type) {
    case "FULL_TIME":
      return "bg-brand-50 text-brand-700";
    case "PART_TIME":
      return "bg-amber-50 text-amber-700";
    case "CONTRACT":
      return "bg-emerald-50 text-emerald-700";
    case "INTERNSHIP":
      return "bg-pink-50 text-pink-700";
    case "REMOTE":
      return "bg-purple-50 text-purple-700";
    default:
      return "bg-ink-100 text-ink-700";
  }
}

export default function EmploymentTypeBadge({
  type,
  className = "",
}: EmploymentTypeBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${classesFor(
        type,
      )} ${className}`}
    >
      {type.replace("_", " ")}
    </span>
  );
}