import { Link, useParams } from "react-router-dom";

import { useDetail } from "../../hooks/useDetail";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBanner from "../../components/common/StatusBanner";
import BackLink from "../../components/jobs/BackLink";
import type { NewsItem } from "../../components/news/NewsCard";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: article,
    loading,
    error,
  } = useDetail<NewsItem>(endpoints.news.list, slug);

  if (loading) return <LoadingSpinner label="Loading article..." />;

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <StatusBanner variant="error">{error}</StatusBanner>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <EmptyState
            title="Article not found"
            message="This article may have been removed or unpublished."
            actionLabel="Back to news"
            actionTo="/news"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <BackLink to="/news" label="Back to news" />
        </div>

        {article.cover_image && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-line">
            <img
              src={article.cover_image}
              alt={article.title}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}

        <div className="rounded-2xl border border-line bg-surface p-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
              {article.category_display}
            </span>

            <span className="text-xs text-ink-500">
              {formatDate(article.created_at)}
            </span>
          </div>

          <h1
            className="mt-4 text-3xl font-bold leading-tight text-ink-800 sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-4 border-l-2 border-brand-200 pl-4 text-base italic leading-relaxed text-ink-500">
              {article.excerpt}
            </p>
          )}

          <div className="mt-8 whitespace-pre-line text-[15px] leading-[1.75] text-ink-700">
            {article.body}
          </div>

          {article.external_url && (
            <div className="mt-8 border-t border-line pt-6">
              <a
                href={article.external_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Read the full article →
              </a>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/news"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            ← See more articles
          </Link>
        </div>
      </div>
    </div>
  );
}