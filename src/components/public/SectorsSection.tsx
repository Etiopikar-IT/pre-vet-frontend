import { CONFIG } from "./config";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function SectorsSection() {
  return (
    <section
      id="sectors"
      className="border-b"
      style={{ borderColor: "var(--public-line)" }}
    >
      <div className="mx-auto max-w-[1120px] px-8 py-20">
        <SectionHead
          title="Where we're building the bench"
          subtitle={`${CONFIG.sectors.length} sectors actively tracking external talent right now, and the kinds of roles we typically see within each.`}
        />

        <div
          className="border-t"
          style={{ borderColor: "var(--public-line)" }}
        >
          {CONFIG.sectors.map((sector, idx) => (
            <Reveal
              key={sector.name}
              className="-mx-5 rounded-md border-b px-5 py-6 transition-all hover:translate-x-1"
              // Note: `style` won't apply through Reveal's className-only API.
              // Wrap the inner content if you want hover bg. See note below.
            >
              <div
                className="rounded-md transition-colors"
                style={{ borderColor: "var(--public-line)" }}
              >
                <h3
                  className="mb-3 text-[22px] font-medium"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {sector.name}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {sector.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full border px-3 py-1.5 text-[13px] transition-colors hover:bg-[var(--public-teal)] hover:text-[var(--public-paper)]"
                      style={{
                        borderColor: "var(--public-line)",
                        color: "rgba(24,26,22,0.72)",
                        background: "var(--public-paper-raised)",
                      }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}