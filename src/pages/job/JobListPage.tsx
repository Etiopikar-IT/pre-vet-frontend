import { useEffect, useMemo, useState } from "react";

import { api } from "../../api/api";
import { endpoints } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../../components/jobs/jobList/SearchBar";
import LocationPicker from "../../components/jobs/jobList/LocationPicker";
import FilterPillGroup from "../../components/jobs/jobList/FilterPillGroup";
import SortDropdown from "../../components/jobs/jobList/SortDropdown";
import ViewToggle from "../../components/jobs/jobList/ViewToggle";
import ResultsHeader from "../../components/jobs/jobList/ResultsHeader";
import JobCardList from "../../components/jobs/jobList/JobCardList";
import type { JobCardData } from "../../components/jobs/jobList/JobCard";
import PublicHeader from "../../components/public/PublicHeader";

export default function JobListPage() {
  const { user } = useAuth();
  const isGuest = user == null;

  // Raw input
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("");
  const [ordering, setOrdering] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Debounced query
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Build URL params
  const url = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedQuery) {
      params.set("company_name", debouncedQuery);
    }
    if (location) params.set("location", location);
    if (employmentType) params.set("employment_type", employmentType);
    if (salaryCurrency) params.set("salary_currency", salaryCurrency);
    if (ordering) params.set("ordering", ordering);

    const qs = params.toString();
    return qs ? `${endpoints.jobs.list}?${qs}` : endpoints.jobs.list;
  }, [debouncedQuery, location, employmentType, salaryCurrency, ordering]);

  // Fetch
  const [jobs, setJobs] = useState<JobCardData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get<JobCardData[]>(url);
        if (!cancelled) setJobs(res.data);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.detail ??
              "Failed to load jobs. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <>
      {isGuest && <PublicHeader />}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Top search bar */}
        <SearchBar value={query} onChange={setQuery} />

        {/* Filters row */}
        <div className="mt-5 rounded-2xl border border-line bg-surface p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <LocationPicker value={location} onChange={setLocation} />

            <div className="hidden h-6 w-px bg-line lg:block" />

            <div className="flex-1">
              <FilterPillGroup
                employmentType={employmentType}
                onEmploymentTypeChange={setEmploymentType}
                salaryCurrency={salaryCurrency}
                onSalaryCurrencyChange={setSalaryCurrency}
              />
            </div>
          </div>
        </div>

        {/* Results header + controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ResultsHeader count={jobs?.length ?? 0} loading={loading} />

          <div className="flex items-center gap-3">
            <SortDropdown value={ordering} onChange={setOrdering} />
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="mt-5">
          <JobCardList
            jobs={jobs ?? []}
            loading={loading}
            emptyMessage="No jobs match your search. Try adjusting your filters."
          />
        </div>
      </div>
    </>
  );
}