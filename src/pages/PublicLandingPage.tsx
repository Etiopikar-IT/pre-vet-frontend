import { useEffect } from "react";

import { CONFIG } from "../components/public/config";
import ScrollProgress from "../components/public/ScrollProgress";
import BackToTop from "../components/public/BackToTop";
import PublicHeader from "../components/public/PublicHeader";
import Hero from "../components/public/Hero";
import OverviewSection from "../components/public/OverviewSection";
import SectorsSection from "../components/public/SectorsSection";
import ProcessSection from "../components/public/ProcessSection";
import TeamSection from "../components/public/TeamSection";
import AfterYouJoinSection from "../components/public/AfterYouJoinSection";
import NoteSection from "../components/public/NoteSection";
import ApplySection from "../components/public/ApplySection";
import PublicFooter from "../components/public/PublicFooter";
import { FAQSection } from "../components/public/faq";

export default function PublicLandingPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = `Talent Pool — Get on ${CONFIG.companyName}'s radar`;
    return () => {
      document.title = previous;
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--public-paper)",
        color: "var(--public-ink)",
      }}
    >
      <ScrollProgress />
      <PublicHeader 
      // companyName={CONFIG.companyName} 
      />

      <Hero
        // onJoinClick={() => scrollTo("apply")}
        onProcessClick={() => scrollTo("process")}
      />

      <OverviewSection />
      <SectorsSection />
      <ProcessSection />
      <TeamSection />
      <AfterYouJoinSection />
      <NoteSection />
      <ApplySection />

      <FAQSection />
      <PublicFooter />
      <BackToTop />
    </div>
  );
}