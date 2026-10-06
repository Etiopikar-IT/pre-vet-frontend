import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionHeadProps {
  title: ReactNode;
  subtitle?: ReactNode;
  light?: boolean;
}

export default function SectionHead({
  title,
  subtitle,
  light = false,
}: SectionHeadProps) {
  return (
    <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-6">
      <h2
        className="max-w-[22ch] text-[clamp(28px,3.4vw,38px)] leading-tight"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: light ? "var(--public-paper)" : "var(--public-ink)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="max-w-[36ch] text-[15px] leading-relaxed"
          style={{
            color: light
              ? "rgba(246,243,236,0.82)"
              : "rgba(24,26,22,0.7)",
          }}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}