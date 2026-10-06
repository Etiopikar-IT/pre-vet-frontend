interface ApplicationStatusBadgeProps {
  status: string;
  className?: string;
}

function classesFor(status: string): string {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700";
    case "REJECTED":
      return "bg-red-50 text-red-600";
    case "REVIEWED":
      return "bg-brand-50 text-brand-700";
    case "SUBMITTED":
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function labelFor(status: string): string {
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "REJECTED":
      return "Rejected";
    case "REVIEWED":
      return "Reviewed";
    case "SUBMITTED":
      return "Submitted";
    default:
      return status;
  }
}

export default function ApplicationStatusBadge({
  status,
  className = "",
}: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${classesFor(
        status,
      )} ${className}`}
    >
      {labelFor(status)}
    </span>
  );
}