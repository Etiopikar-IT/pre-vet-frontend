// ----------------------------
// FAQ
// ----------------------------

export type FAQCategory =
  | "general"
  | "job_seekers"
  | "employers"
  | "account"
  | "other";

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: FAQCategory;
  /** Human-readable label, e.g. "Job Seekers". Provided by the API. */
  category_label: string;
  display_order: number;
}

/** Raw DRF list response when pagination is enabled. */
export interface FAQListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FAQ[];
}