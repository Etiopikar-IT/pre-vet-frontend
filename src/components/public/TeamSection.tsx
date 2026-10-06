import { CONFIG } from "./config";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export default function TeamSection() {
  return (
    <section
      id="team"
      className="border-b"
      style={{ borderColor: "var(--public-line)" }}
    >
      <div className="mx-auto max-w-[1120px] px-8 py-20">
        <SectionHead
          title="Who's behind this"
          subtitle="The people reviewing your profile and making the call when a role opens."
        />

        <Reveal className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {CONFIG.team.map((person) => (
            <div
              key={person.name}
              className="border p-6 transition-transform hover:-translate-y-1"
              style={{
                background: "var(--public-paper-raised)",
                borderColor: "var(--public-line)",
              }}
            >
              <div
                className="mb-4 flex h-13 w-13 items-center justify-center overflow-hidden rounded-full text-[18px]"
                style={{
                  width: 52,
                  height: 52,
                  background: "var(--public-teal)",
                  color: "var(--public-paper)",
                  fontFamily: "'Fraunces', serif",
                }}
              >
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initialsOf(person.name)
                )}
              </div>

              <h3 className="text-[18px] font-medium">
                {person.linkedin ? (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-transparent transition-colors hover:border-[var(--public-teal)] hover:text-[var(--public-teal)]"
                  >
                    {person.name}
                  </a>
                ) : (
                  person.name
                )}
              </h3>

              <div
                className="mt-1 mb-3 text-[13px]"
                style={{ color: "var(--public-gold)" }}
              >
                {person.role}
              </div>

              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "rgba(24,26,22,0.68)" }}
              >
                {person.bio}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}