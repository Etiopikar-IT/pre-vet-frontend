import type { ReactNode } from "react";

import PageHeader from "../common/PageHeader";
import StatusBanner from "../common/StatusBanner";
import ProfileStatusBanner from "./ProfileStatusBanner";

interface ProfileFormShellProps {
  title: string;
  subtitle?: string;
  approvalStatus?: string;
  rejectionReason?: string;
  error?: string | null;
  success?: string;
  children: ReactNode;
}

export default function ProfileFormShell({
  title,
  subtitle,
  approvalStatus,
  rejectionReason,
  error,
  success,
  children,
}: ProfileFormShellProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <PageHeader title={title} subtitle={subtitle} />

        <ProfileStatusBanner
          status={approvalStatus}
          rejectionReason={rejectionReason}
          className="mb-5"
        />

        {error && (
          <StatusBanner variant="error" className="mb-5">
            {error}
          </StatusBanner>
        )}

        {success && (
          <StatusBanner variant="success" className="mb-5">
            {success}
          </StatusBanner>
        )}

        {children}
      </div>
    </div>
  );
}