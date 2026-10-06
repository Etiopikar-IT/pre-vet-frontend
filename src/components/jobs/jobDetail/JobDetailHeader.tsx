import type { ReactNode } from "react";

import CompanyAvatar from "../CompanyAvatar";
import JobStatusBadge from "./JobStatusBadge";
import EmploymentTypeBadge from "./EmploymentTypeBadge";
import JobMetaList from "./JobMetaList";

interface JobDetailHeaderProps {
  companyName: string;
  companyLogo?: string | null;
  title: string;
  location?: string;
  employmentType: string;
  status: string;
  salary: string;
  deadline: string;
  posted: string;
  rejectionReason?: string;
  /** Actions rendered below the header (Apply button, owner actions, etc.) */
  actions?: ReactNode;
}

export default function JobDetailHeader({
  companyName,
  companyLogo,
  title,
  location,
  employmentType,
  status,
  salary,
  deadline,
  posted,
  rejectionReason,
  actions,
}: JobDetailHeaderProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <CompanyAvatar name={companyName} logo={companyLogo} size="md" />

          <div>
            <h1 className="text-2xl font-bold text-ink-800">{title}</h1>

            <p className="mt-1 text-sm text-ink-500">
              {companyName}
              {location && ` · ${location}`}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <EmploymentTypeBadge type={employmentType} />

              {status !== "PUBLISHED" && <JobStatusBadge status={status} />}
            </div>
          </div>
        </div>

        <JobMetaList
          salary={salary}
          deadline={deadline}
          posted={posted}
          className="w-full shrink-0 sm:w-56"
        />
      </div>

      {rejectionReason && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span className="font-medium">Rejection reason:</span>{" "}
          {rejectionReason}
        </div>
      )}

      {actions && (
        <div className="mt-6 border-t border-line pt-6">{actions}</div>
      )}
    </div>
  );
}