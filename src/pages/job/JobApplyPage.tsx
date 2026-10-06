import { type FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useDetail } from "../../hooks/useDetail";
import { useCreate } from "../../hooks/useCreate";
import { endpoints } from "../../api/endpoints";

import BackLink from "../../components/jobs/BackLink";
import ApplyPageHeader from "../../components/jobs/jobApply/ApplyPageHeader";
import CoverLetterField from "../../components/jobs/jobApply/CoverLetterField";
import ApplyActions from "../../components/jobs/jobApply/ApplyActions";
import StatusBanner from "../../components/common/StatusBanner";

interface JobDetail {
  id: number;
  company_name: string;
  title: string;
  location: string;
  employment_type: string;
  status: string;
}

interface JobApplication {
  id: number;
  job: number;
  status: string;
  created_at: string;
}

export default function JobApplyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: job,
    loading: jobLoading,
    error: jobError,
  } = useDetail<JobDetail>(endpoints.jobs.list, id);

  const {
    create,
    loading: submitLoading,
    error: submitError,
    reset,
  } = useCreate<JobApplication>();

  const [coverLetter, setCoverLetter] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    reset();

    if (!job) return;

    const result = await create(endpoints.applications.list, {
      job: job.id,
      cover_letter: coverLetter,
    });

    if (result) {
      setSuccess("Your application has been submitted.");

      setTimeout(() => {
        navigate("/applications", {
          state: { message: "Application submitted successfully." },
        });
      }, 1200);
    }
  };

  if (jobLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-page">
        <div className="flex items-center gap-3 text-ink-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand-500" />
          Loading job...
        </div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <StatusBanner variant="error">{jobError}</StatusBanner>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-line bg-surface p-12 text-center">
            <h2 className="text-lg font-semibold text-ink-800">
              Job not found
            </h2>
            <div className="mt-5">
              <BackLink to="/jobs" label="Back to jobs" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (job.status !== "PUBLISHED") {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-line bg-surface p-8">
            <h2 className="text-lg font-semibold text-ink-800">
              This job is not accepting applications
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Only published jobs can be applied to.
            </p>
            <div className="mt-5">
              <Link
                to={`/jobs/${job.id}`}
                className="inline-block rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-ink-100"
              >
                Back to job
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-page px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <BackLink to={`/jobs/${job.id}`} label="Back to job" />
        </div>

        <ApplyPageHeader
          title="Apply for this job"
          jobTitle={job.title}
          companyName={job.company_name}
          location={job.location}
        />

        {submitError && (
          <StatusBanner variant="error" className="mb-5">
            {submitError}
          </StatusBanner>
        )}

        {success && (
          <StatusBanner variant="success" className="mb-5">
            {success}
          </StatusBanner>
        )}

        <div className="rounded-2xl border border-line bg-surface p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <CoverLetterField
              value={coverLetter}
              onChange={setCoverLetter}
            />

            <ApplyActions
              cancelTo={`/jobs/${job.id}`}
              submitting={submitLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}