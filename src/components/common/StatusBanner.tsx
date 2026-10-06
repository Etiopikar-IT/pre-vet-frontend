import type { ReactNode } from "react";

type BannerVariant = "success" | "error" | "info" | "warning";

interface StatusBannerProps {
  variant: BannerVariant;
  children: ReactNode;
  className?: string;
}

const STYLES: Record<BannerVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-700",
  error: "border-red-200 bg-red-50 text-red-600",
  info: "border-brand-200 bg-brand-50 text-brand-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function StatusBanner({
  variant,
  children,
  className = "",
}: StatusBannerProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${STYLES[variant]} ${className}`}
    >
      {children}
    </div>
  );
}