import { CONFIG } from "./config";

export default function PublicFooter() {
  return (
    <footer
      className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-3 px-8 py-7 text-[13px]"
      style={{ color: "rgba(24,26,22,0.55)" }}
    >
      <div>{CONFIG.companyName} — People &amp; Culture</div>
      <div>Pre-Vetted Talent Platform</div>
    </footer>
  );
}