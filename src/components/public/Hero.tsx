import { useEffect, useRef, useState } from "react";

import { CONFIG } from "./config";
import Reveal from "./Reveal";
import { useApplyModal } from "../apply/ApplyModalContext";
import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";
import type { PublicStats } from "../../types";

interface HeroProps {
  onProcessClick: () => void;
}

/* ---------------------------------------------------------------
   Count-up with ease-out cubic. Respects reduced motion.
   --------------------------------------------------------------- */
function useCountUp(target: number | null, duration = 1300) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (target === null) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }

    start.current = null;
    const tick = (ts: number) => {
      if (start.current === null) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);

  return value;
}

/* ---------------------------------------------------------------
   A single stat — big number, hairline rule, small label.
   --------------------------------------------------------------- */
function StatBlock({
  value,
  label,
  loading,
  delay = 0,
}: {
  value: number | null;
  label: string;
  loading: boolean;
  delay?: number;
}) {
  const animated = useCountUp(loading ? null : value);
  const isReady = !loading && value !== null;

  return (
    <div
      className="group relative flex flex-col justify-between"
      style={{
        animation: `statReveal 700ms ${delay}ms cubic-bezier(.22,.61,.36,1) both`,
      }}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="text-[clamp(40px,5vw,56px)] leading-[0.9] tabular-nums"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 500,
            color: "var(--public-teal)",
            letterSpacing: "-0.02em",
            transition: "transform 300ms ease",
            display: "inline-block",
          }}
        >
          {isReady ? (
            <span
              className="inline-block transition-transform duration-300 group-hover:-translate-y-1"
              style={{ willChange: "transform" }}
            >
              {animated.toLocaleString()}
            </span>
          ) : (
            <span style={{ opacity: 0.3 }}>—</span>
          )}
        </span>

        {/* small animated dot that pulses when data is ready */}
        {isReady && (
          <span
            aria-hidden="true"
            className="inline-block h-[6px] w-[6px] rounded-full"
            style={{
              background: "var(--public-teal)",
              animation: "dotPulse 2.4s ease-in-out infinite",
            }}
          />
        )}
      </div>

      <div
        className="mt-4 h-px w-full origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
        style={{ background: "var(--public-teal)", opacity: 0.5 }}
        aria-hidden="true"
      />

      <span
        className="mt-3 text-[11.5px] uppercase tracking-[0.14em]"
        style={{ color: "rgba(24,26,22,0.55)" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Hero({ onProcessClick }: HeroProps) {
  const { open: openApply } = useApplyModal();

  const names = CONFIG.sectors.map((s) => s.name);
  const joined =
    names.length > 1
      ? `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`
      : names[0] ?? "";

  const { data: stats, loading: statsLoading } = useData<PublicStats>(
    endpoints.accounts.publicStats,
  );

  return (
    <div
      className="mx-auto grid max-w-[1120px] gap-14 border-b px-8 py-24 md:grid-cols-[1.3fr_1fr] md:items-end"
      style={{ borderColor: "var(--public-line)" }}
    >
      <style>{`
        @keyframes statReveal {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.6); }
        }
        @keyframes softFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-hero-anim] *, [data-hero-anim] { animation: none !important; }
        }
      `}</style>

      <Reveal>
        <h1
          className="text-[clamp(38px,5.4vw,68px)] leading-[1.04]"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          Get on our radar,
          <br />
          before the role exists.
        </h1>

        <p
          className="mt-6 max-w-[44ch] text-[18px] leading-relaxed"
          style={{ color: "rgba(24,26,22,0.78)" }}
        >
          {CONFIG.companyName} is building a standing pool of strong
          external candidates across {joined} — so that when the right
          opening appears, we already know exactly who to call.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={openApply}
            className="group relative inline-block overflow-hidden rounded-sm px-7 py-3.5 text-[15px] font-medium transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--public-teal)",
              color: "var(--public-paper)",
              boxShadow: "0 0 0 rgba(31,74,68,0)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(31,74,68,0.28)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 0 rgba(31,74,68,0)")
            }
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(246,243,236,0.35), transparent)",
                animation: "shineSweep 3.8s ease-in-out infinite",
              }}
            />
            <span className="relative">Join the talent pool</span>
          </button>

          <button
            type="button"
            onClick={onProcessClick}
            className="rounded-sm border px-7 py-3.5 text-[15px] transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: "var(--public-ink)",
              color: "var(--public-ink)",
            }}
          >
            See how vetting works
          </button>
        </div>
      </Reveal>

      {/* ---------- Totally restyled right column ---------- */}
      <Reveal>
        <div
          data-hero-anim
          className="relative"
          style={{
            animation: "softFloat 8s ease-in-out infinite",
          }}
        >
          {/* Editorial label above the board */}
          <div
            className="mb-5 flex items-center gap-3 text-[11px] uppercase"
            style={{
              color: "rgba(24,26,22,0.5)",
              letterSpacing: "0.16em",
            }}
          >
            <span
              className="h-px flex-1"
              style={{ background: "var(--public-line)" }}
            />
            Live on the platform
            <span
              className="h-px flex-1"
              style={{ background: "var(--public-line)" }}
            />
          </div>

          {/* The stat board */}
          <div
            className="border px-7 py-8 transition-shadow duration-500"
            style={{
              background: "var(--public-paper-raised)",
              borderColor: "var(--public-line)",
              boxShadow: "0 1px 0 rgba(31,74,68,0.04)",
            }}
          >
            <div className="grid grid-cols-2 gap-10">
              <StatBlock
                value={stats?.companies ?? null}
                label="Companies hiring"
                loading={statsLoading}
                delay={0}
              />
              <StatBlock
                value={stats?.candidates ?? null}
                label="Candidates on file"
                loading={statsLoading}
                delay={140}
              />
            </div>

            <div
              className="mt-8 border-t pt-5 text-[12.5px] leading-relaxed"
              style={{
                borderColor: "var(--public-line)",
                color: "rgba(24,26,22,0.55)",
              }}
            >
              Across{" "}
              <span style={{ color: "rgba(24,26,22,0.8)" }}>
                {CONFIG.sectors.length} sectors
              </span>{" "}
              — {names.join(", ")}.
            </div>
          </div>

          {/* Small floating attribution — like a magazine byline */}
          <p
            className="mt-4 text-right text-[11px] uppercase"
            style={{
              color: "rgba(24,26,22,0.4)",
              letterSpacing: "0.14em",
            }}
          >
            Updated continuously
          </p>
        </div>
      </Reveal>
    </div>
  );
}