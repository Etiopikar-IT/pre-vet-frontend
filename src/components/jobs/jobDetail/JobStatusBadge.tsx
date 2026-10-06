interface JobStatusBadgeProps {
  status: string;
  className?: string;
}

function classesFor(status: string): string {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700";
    case "PUBLISHED":
      return "bg-brand-50 text-brand-700";
    case "REJECTED":
      return "bg-red-50 text-red-600";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function labelFor(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function JobStatusBadge({
  status,
  className = "",
}: JobStatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${classesFor(
        status,
      )} ${className}`}
    >
      {labelFor(status)}
    </span>
  );
}