import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

interface TeamMember {
  id: string;
  image: string | null;
  image_url: string | null;
  first_name: string;
  last_name: string;
  role: string;
  description: string;
}

function initialsOf(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export default function TeamSection() {
  const { data, loading, error } = useData<TeamMember[]>(
    endpoints.accounts.team,
  );

  const members = data ?? [];

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

        {error && (
          <div
            className="mt-8 border px-4 py-3 text-[14px]"
            style={{
              borderColor: "#fecaca",
              background: "#fef2f2",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div
            className="mt-10 flex items-center justify-center gap-3 text-[14px]"
            style={{ color: "rgba(24,26,22,0.6)" }}
          >
            <span
              className="h-5 w-5 animate-spin rounded-full border-2"
              style={{
                borderColor: "var(--public-line)",
                borderTopColor: "var(--public-teal)",
              }}
            />
            Loading team...
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <p
            className="mt-10 text-center text-[14px]"
            style={{ color: "rgba(24,26,22,0.6)" }}
          >
            No team members to show yet.
          </p>
        )}

        {!loading && members.length > 0 && (
          <Reveal className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((person) => {
              const fullName = `${person.first_name} ${person.last_name}`.trim();
              const avatarSrc = person.image_url || person.image;

              return (
                <div
                  key={person.id}
                  className="border p-6 transition-transform hover:-translate-y-1"
                  style={{
                    background: "var(--public-paper-raised)",
                    borderColor: "var(--public-line)",
                  }}
                >
                  <div
                    className="mb-4 flex items-center justify-center overflow-hidden rounded-full text-[18px]"
                    style={{
                      width: 52,
                      height: 52,
                      background: "var(--public-teal)",
                      color: "var(--public-paper)",
                      fontFamily: "'Fraunces', serif",
                    }}
                  >
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initialsOf(person.first_name, person.last_name)
                    )}
                  </div>

                  <h3 className="text-[18px] font-medium">
                    {fullName}
                  </h3>

                  <div
                    className="mt-1 mb-3 text-[13px]"
                    style={{ color: "var(--public-gold)" }}
                  >
                    {person.role}
                  </div>

                  {person.description && (
                    <p
                      className="text-[14px] leading-relaxed"
                      style={{ color: "rgba(24,26,22,0.68)" }}
                    >
                      {person.description}
                    </p>
                  )}
                </div>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
}