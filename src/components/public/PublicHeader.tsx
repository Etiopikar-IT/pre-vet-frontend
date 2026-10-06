import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "sectors", label: "Sectors" },
  { id: "process", label: "How it works" },
  { id: "team", label: "Team" },
  { id: "after", label: "After you join" },
];

interface PublicHeaderProps {
  companyName: string;
}

export default function PublicHeader({ companyName }: PublicHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = SECTIONS.map((s) =>
      document.getElementById(s.id),
    ).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0_6px_24px_rgba(24,26,22,0.08)]" : ""
      }`}
      style={{
        background: "rgba(246,243,236,0.92)",
        borderColor: "var(--public-line)",
      }}
    >
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-8 py-5">
        <div
          className="text-[22px] font-semibold tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {companyName}
          <span style={{ color: "var(--public-gold)" }}>
            {" "}
            · Talent
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-[15px] md:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className="group relative pb-1 transition-opacity hover:opacity-100"
              style={{
                opacity: active === s.id ? 1 : 0.75,
              }}
            >
              {s.label}
              <span
                className="absolute bottom-0 left-0 h-[1.5px] transition-all"
                style={{
                  width: active === s.id ? "100%" : "0",
                  background: "var(--public-gold)",
                }}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/register/job-seeker"
            className="hidden rounded-sm px-5 py-2.5 text-sm transition-transform hover:-translate-y-px md:inline-block"
            style={{
                background: "var(--public-ink)",
                color: "var(--public-paper)",
            }}
            >
            Join the pool
            </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-6 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-[2px] w-full transition ${
                menuOpen ? "translate-y-[8px] rotate-45" : ""
              }`}
              style={{ background: "var(--public-ink)" }}
            />
            <span
              className={`block h-[2px] w-full transition ${
                menuOpen ? "opacity-0" : ""
              }`}
              style={{ background: "var(--public-ink)" }}
            />
            <span
              className={`block h-[2px] w-full transition ${
                menuOpen ? "-translate-y-[8px] -rotate-45" : ""
              }`}
              style={{ background: "var(--public-ink)" }}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="border-t md:hidden"
          style={{ borderColor: "var(--public-line)" }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className="block w-full border-t px-5 py-4 text-left text-[15px] first:border-t-0"
              style={{ borderColor: "var(--public-line)" }}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => scrollTo("apply")}
            className="block w-full border-t px-5 py-4 text-left text-[15px] font-medium"
            style={{ borderColor: "var(--public-line)" }}
          >
            Join the pool
          </button>
        </div>
      )}
    </header>
  );
}