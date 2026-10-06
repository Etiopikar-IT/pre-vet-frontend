import { useData } from "../../hooks/useData";
import { endpoints } from "../../api/endpoints";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBanner from "../../components/common/StatusBanner";
import NewsCard, {
  type NewsItem,
} from "../../components/news/NewsCard";

export default function NewsListPage() {
  const {
    data: articles,
    loading,
    error,
  } = useData<NewsItem[]>(endpoints.news.list);

  if (loading) return <LoadingSpinner label="Loading news..." />;

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <StatusBanner variant="error">{error}</StatusBanner>
        </div>
      </div>
    );
  }

  const list = articles ?? [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="News &amp; tips"
          subtitle={
            list.length > 0
              ? `${list.length} ${
                  list.length === 1 ? "article" : "articles"
                }`
              : "Career advice, hiring trends, and product updates."
          }
        />

        {list.length === 0 ? (
          <EmptyState
            title="No news yet"
            message="Check back soon — we'll post career tips, hiring trends, and product updates here."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8" />
                <path d="M15 18h-5" />
                <path d="M10 6h8v4h-8V6Z" />
              </svg>
            }
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((article) => (
              <li key={article.id}>
                <NewsCard article={article} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}