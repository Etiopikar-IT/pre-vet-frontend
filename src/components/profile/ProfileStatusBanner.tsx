import StatusBanner from "../common/StatusBanner";

interface ProfileStatusBannerProps {
  status?: string;
  rejectionReason?: string;
  className?: string;
}

export default function ProfileStatusBanner({
  status,
  rejectionReason,
  className = "",
}: ProfileStatusBannerProps) {
  if (!status) return null;

  if (status === "REJECTED") {
    return (
      <StatusBanner variant="error" className={className}>
        <span className="font-medium">Rejection reason:</span>{" "}
        {rejectionReason || "No reason was provided."}
      </StatusBanner>
    );
  }

  if (status !== "APPROVED") {
    return (
      <StatusBanner variant="warning" className={className}>
        Your profile is <span className="font-medium">pending approval</span>.
        You'll be able to apply to jobs once it's reviewed.
      </StatusBanner>
    );
  }

  return null;
}