import { useEffect, useRef, useState } from "react";

import FilterPill from "./FilterPill";

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full time" },
  { value: "PART_TIME", label: "Part time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
];

interface FilterPillGroupProps {
  employmentType: string;
  onEmploymentTypeChange: (value: string) => void;
  salaryCurrency: string;
  onSalaryCurrencyChange: (value: string) => void;
}

export default function FilterPillGroup({
  employmentType,
  onEmploymentTypeChange,
  salaryCurrency,
  onSalaryCurrencyChange,
}: FilterPillGroupProps) {
  const [openMenu, setOpenMenu] = useState<"type" | "currency" | null>(null);

  const typeRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!openMenu) return;

    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      const insideType = typeRef.current?.contains(target);
      const insideCurrency = currencyRef.current?.contains(target);

      if (!insideType && !insideCurrency) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openMenu]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (menu: "type" | "currency") => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const currentTypeLabel =
    EMPLOYMENT_TYPES.find((t) => t.value === employmentType)?.label ??
    "Employment type";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Employment type dropdown */}
      <div ref={typeRef} className="relative">
        <FilterPill
          label={currentTypeLabel}
          active={!!employmentType}
          onClick={() => toggle("type")}
        />

        {openMenu === "type" && (
          <div className="absolute left-0 top-full z-30 mt-2 w-52 rounded-xl border border-line bg-surface p-2 shadow-lg">
            <button
              type="button"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-100"
              onClick={() => {
                onEmploymentTypeChange("");
                setOpenMenu(null);
              }}
            >
              All types
            </button>

            {EMPLOYMENT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  employmentType === t.value
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-700 hover:bg-ink-100"
                }`}
                onClick={() => {
                  onEmploymentTypeChange(t.value);
                  setOpenMenu(null);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Currency dropdown */}
      <div ref={currencyRef} className="relative">
        <FilterPill
          label={salaryCurrency || "Currency"}
          active={!!salaryCurrency}
          onClick={() => toggle("currency")}
        />

        {openMenu === "currency" && (
          <div className="absolute left-0 top-full z-30 mt-2 w-44 rounded-xl border border-line bg-surface p-2 shadow-lg">
            {[
              { value: "", label: "Any currency" },
              { value: "ETB", label: "ETB" },
              { value: "USD", label: "USD" },
              { value: "EUR", label: "EUR" },
              { value: "GBP", label: "GBP" },
            ].map((c) => (
              <button
                key={c.value || "any"}
                type="button"
                className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  salaryCurrency === c.value
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-700 hover:bg-ink-100"
                }`}
                onClick={() => {
                  onSalaryCurrencyChange(c.value);
                  setOpenMenu(null);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Standalone toggle row — kept as you asked */}
      {EMPLOYMENT_TYPES.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() =>
            onEmploymentTypeChange(employmentType === t.value ? "" : t.value)
          }
          className={[
            "rounded-full border px-4 py-2 text-sm font-medium transition",
            employmentType === t.value
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-line bg-surface text-ink-700 hover:border-brand-300 hover:text-brand-600",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}