import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

export default function OverviewSection() {
  return (
    <section
      id="overview"
      className="border-b"
      style={{ borderColor: "var(--public-line)" }}
    >
      <div className="mx-auto max-w-[1120px] px-8 py-20">
        <SectionHead title="Most hiring starts after a role opens. Ours starts earlier." />

        <Reveal className="grid gap-14 md:grid-cols-2">
          <p className="text-[16.5px] leading-[1.7] text-[rgba(24,26,22,0.82)]">
            Traditional hiring is reactive: a seat opens, and the search
            begins from zero. The Pre-Vetted Talent Platform flips that
            order. We identify and evaluate strong professionals and
            high-potential graduates ahead of need, so the pipeline is
            ready before the vacancy is.
          </p>
          <p className="text-[16.5px] leading-[1.7] text-[rgba(24,26,22,0.82)]">
            Being part of the pool doesn't mean joining our payroll
            today. It means your profile, skills, and interests are on
            file with the people who make hiring decisions — and that
            when a matching opportunity comes up, you're one of the
            first calls we make, not one of hundreds of applications we
            sort through.
          </p>
        </Reveal>
      </div>
    </section>
  );
}