import { Link } from "react-router-dom";

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_display: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  external_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface NewsCardProps {
  article: NewsItem;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function categoryClasses(category: string): string {
  switch (category) {
    case "CAREER":
      return "bg-brand-50 text-brand-700";
    case "HIRING":
      return "bg-emerald-50 text-emerald-700";
    case "TRENDS":
      return "bg-purple-50 text-purple-700";
    case "PRODUCT":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-ink-100 text-ink-600";
  }
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
      to={`/news/${article.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-brand-300 hover:shadow-sm"
    >
      {article.cover_image && (
        <div className="aspect-video w-full overflow-hidden bg-ink-100">
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryClasses(
              article.category,
            )}`}
          >
            {article.category_display}
          </span>

          <span className="text-xs text-ink-400">
            {formatDate(article.created_at)}
          </span>
        </div>

        <h3 className="mt-3 text-base font-semibold leading-snug text-ink-800 group-hover:text-brand-600">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {article.excerpt}
          </p>
        )}

        <span className="mt-3 inline-block text-xs font-semibold text-brand-600">
          Read more →
        </span>
      </div>
    </Link>
  );
}