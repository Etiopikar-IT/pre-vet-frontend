import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function FormSection({
  title,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section className={className}>
      <h2 className="mb-4 text-lg font-semibold text-ink-800">{title}</h2>
      {children}
    </section>
  );
}