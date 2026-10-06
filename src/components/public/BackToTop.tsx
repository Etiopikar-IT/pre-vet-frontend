import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      className={`fixed bottom-7 right-7 z-40 flex h-11 w-11 items-center justify-center rounded-full text-lg text-[#F6F3EC] transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
      style={{ background: "var(--public-ink)" }}
    >
      ↑
    </button>
  );
}