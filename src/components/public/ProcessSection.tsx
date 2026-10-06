import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const STEPS = [
  {
    num: "01",
    title: "Sourcing & nomination",
    body: "You come to us through our network, an event, a referral, or a direct application — no role needs to be open.",
  },
  {
    num: "02",
    title: "Assessment & screening",
    body: "Role-specific skill assessments, a behavioral interview, and — for creative and technical tracks — a portfolio or project review.",
  },
  {
    num: "03",
    title: "Tagging & categorization",
    body: "We record your sector fit, readiness (immediate, near-term, long-term), core strengths, and current engagement status.",
  },
  {
    num: "04",
    title: "Standing consideration",
    body: "Your profile stays active in a centralized system, visible to hiring managers as roles come open.",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="border-b"
      style={{ borderColor: "var(--public-line)" }}
    >
      <div className="mx-auto max-w-[1120px] px-8 py-20">
        <SectionHead
          title="How the vetting works"
          subtitle="Four stages, from first contact to a place on the bench."
        />

        <Reveal
          className="grid border-l border-t sm:grid-cols-2 lg:grid-cols-4"
          // Note: `style` on Reveal is className only. Use a wrapper below
          // if you want the border color from the theme.
        >
          <div
            className="col-span-full grid border-l border-t sm:grid-cols-2 lg:grid-cols-4"
            style={{ borderColor: "var(--public-line)" }}
          >
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="border-b border-r p-7 transition-colors hover:bg-[var(--public-paper-raised)]"
                style={{ borderColor: "var(--public-line)" }}
              >
                <div
                  className="mb-4 text-[15px]"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    color: "var(--public-gold)",
                  }}
                >
                  {step.num}
                </div>

                <h3 className="mb-2.5 text-[19px] leading-tight">
                  {step.title}
                </h3>

                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "rgba(24,26,22,0.68)" }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}