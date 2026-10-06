import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const ITEMS = [
  "Priority consideration when a matching role opens — you're contacted before the posting goes public.",
  "Periodic check-ins to reconfirm your interest and availability, so your profile stays accurate.",
  "Invitations to events, networking sessions, and culture immersions.",
  "Occasional updates and development content, so the relationship stays warm between openings.",
];

export default function AfterYouJoinSection() {
  return (
    <section
      id="after"
      className="border-b"
      style={{
        background: "var(--public-ink)",
        color: "var(--public-paper)",
        borderColor: "var(--public-line)",
      }}
    >
      <div className="mx-auto max-w-[1120px] px-8 py-20">
        <SectionHead
          light
          title="What happens after you join"
          subtitle="Being on the bench comes with an actual relationship, not silence."
        />

        <Reveal className="grid gap-x-12 gap-y-5 md:grid-cols-2">
          {ITEMS.map((item) => (
            <div
              key={item}
              className="flex gap-4 border-t py-5 transition-[padding] hover:pl-2"
              style={{ borderColor: "rgba(246,243,236,0.18)" }}
            >
              <div
                className="shrink-0 text-[18px]"
                style={{
                  fontFamily: "'Fraunces', serif",
                  color: "var(--public-gold)",
                }}
              >
                ＋
              </div>
              <p
                className="text-[14.5px] leading-relaxed"
                style={{ color: "rgba(246,243,236,0.82)" }}
              >
                {item}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}