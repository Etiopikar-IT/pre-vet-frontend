import { Link } from "react-router-dom";
import { CONFIG } from "./config";
import Reveal from "./Reveal";

interface HeroProps {
  onJoinClick: () => void;
  onProcessClick: () => void;
}

export default function Hero({
 
  onProcessClick,
}: HeroProps) {
  const names = CONFIG.sectors.map((s) => s.name);
  const joined =
    names.length > 1
      ? `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`
      : names[0] ?? "";

  return (
    <div className="mx-auto grid max-w-[1120px] gap-14 border-b px-8 py-24 md:grid-cols-[1.3fr_1fr] md:items-end"
      style={{ borderColor: "var(--public-line)" }}
    >
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
         <Link
            to="/register/job-seeker"
            className="inline-block rounded-sm px-7 py-3.5 text-[15px] font-medium transition-transform hover:-translate-y-0.5"
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
            Join the talent pool
        </Link>

          <button
            type="button"
            onClick={onProcessClick}
            className="rounded-sm border px-7 py-3.5 text-[15px] transition"
            style={{
              borderColor: "var(--public-ink)",
              color: "var(--public-ink)",
            }}
          >
            See how vetting works
          </button>
        </div>
      </Reveal>

      <Reveal>
        <div
          className="border p-7 transition-transform hover:-translate-y-1"
          style={{
            background: "var(--public-paper-raised)",
            borderColor: "var(--public-line)",
          }}
        >
          <p
            className="mb-3.5 text-[14.5px] leading-relaxed"
            style={{ color: "rgba(24,26,22,0.75)" }}
          >
            This isn't a job posting. It's an invitation to be evaluated
            once, and considered continuously — for roles that haven't
            opened yet.
          </p>

          <hr
            className="my-4 border-t"
            style={{ borderColor: "var(--public-line)" }}
          />

          <div
            className="text-[40px] leading-none"
            style={{
              fontFamily: "'Fraunces', serif",
              color: "var(--public-teal)",
            }}
          >
            {CONFIG.sectors.length}
          </div>

          <div
            className="mt-1.5 text-[13px]"
            style={{ color: "rgba(24,26,22,0.6)" }}
          >
            sectors actively building their bench: {names.join(", ")}.
          </div>
        </div>
      </Reveal>
    </div>
  );
}