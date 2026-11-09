import { useState } from "react";

import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";
import Reveal from "./Reveal";
import type { FAQ } from "../../types";

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const { data, loading, error } = useData<
    { results: FAQ[] } | FAQ[]
  >(endpoints.accounts.faqs);

  const faqs = Array.isArray(data) ? data : data?.results ?? [];

  return (
    <section id="faq" className="px-8 py-24">
      <div className="mx-auto max-w-[1120px]">
        <Reveal className="mb-12">
          <h2
            className="mb-4 max-w-[18ch] text-[clamp(30px,4vw,46px)] leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Questions, answered.
          </h2>
          <p
            className="max-w-[48ch] text-[16px] leading-relaxed"
            style={{ color: "rgba(24,26,22,0.75)" }}
          >
            Everything you might want to know before getting in touch —
            accounts, applications, and how we work with employers.
          </p>
        </Reveal>

        {loading && (
          <div
            className="border p-10 text-[14.5px]"
            style={{
              background: "var(--public-paper-raised)",
              borderColor: "var(--public-line)",
              color: "rgba(24,26,22,0.7)",
            }}
          >
            Loading FAQs…
          </div>
        )}

        {!loading && error && (
          <div
            className="rounded-sm border p-4 text-[13.5px]"
            style={{
              background: "rgba(220,38,38,0.06)",
              borderColor: "rgba(220,38,38,0.35)",
              color: "rgb(185,28,28)",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && faqs.length === 0 && (
          <div
            className="border p-10 text-[14.5px]"
            style={{
              background: "var(--public-paper-raised)",
              borderColor: "var(--public-line)",
              color: "rgba(24,26,22,0.7)",
            }}
          >
            No FAQs yet.
          </div>
        )}

        {faqs.length > 0 && (
          <Reveal className="grid gap-3">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border"
                  style={{
                    background: "var(--public-paper-raised)",
                    borderColor: "var(--public-line)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenId((prev) =>
                        prev === faq.id ? null : faq.id,
                      )
                    }
                    aria-expanded={isOpen}
                    aria-controls={`faq-${faq.id}`}
                    className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left"
                    style={{ color: "var(--public-ink)" }}
                  >
                    <span
                      className="text-[16px] leading-snug"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 500,
                      }}
                    >
                      {faq.question}
                    </span>
                    <span
                      className="mt-1 shrink-0 text-[18px] leading-none transition-transform"
                      style={{
                        color: "rgba(24,26,22,0.55)",
                        transform: isOpen
                          ? "rotate(45deg)"
                          : "rotate(0deg)",
                      }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-${faq.id}`}
                      className="border-t px-6 py-5 text-[14.5px] leading-relaxed"
                      style={{
                        borderColor: "var(--public-line)",
                        color: "rgba(24,26,22,0.8)",
                        background: "var(--public-paper)",
                      }}
                    >
                      {faq.answer}
                    </div>
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