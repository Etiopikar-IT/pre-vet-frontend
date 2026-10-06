import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Header from "./components/Header";        // your existing header — see note below
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/Applayout";
import { AuthProvider } from "./context/AuthContext";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Profiles
import CompanyProfileView from "./pages/profiles/CompanyProfileView";
import CompanyProfile from "./components/CompanyProfile";
import JobSeekerProfile from "./components/jobs/jobList/JobSeekerProfile";
import JobSeekerProfileView from "./pages/profiles/JobSeekerProfileView";
import CompanyCreateProfilePage from "./pages/profiles/CompanyCreateProfilePage";
import JobSeekerCreateProfilePage from "./pages/profiles/JobSeekerCreateProfilePage";

// Jobs
import JobCreatePage from "./pages/job/JobCreatePage";
import JobListPage from "./pages/job/JobListPage";
import JobDetailPage from "./pages/job/JobDetailPage";
import JobApplyPage from "./pages/job/JobApplyPage";
import JobSeekerApplicationsPage from "./pages/job/JobSeekerApplicationsPage";
import JobSeekerApplicationDetailPage from "./pages/job/JobSeekerApplicationsDetailPage";
import CompanyJobsPage from "./pages/job/CompanyJobsPage";

// Sidebar pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import NotificationsPage from "./pages/notification/NorificationsPage";
import NewsPage from "./pages/news/NewsPage";
import JobEditPage from "./pages/job/JobEditPage";
import JobSeekerProfileEditPage from "./pages/profiles/JobSeekerProfileEditPage";
import CompanyProfileEditPage from "./pages/profiles/CompanyProfileEditPage";
import PublicLandingPage from "./pages/PublicLandingPage";
import HomeRoute from "./components/HomeRoute";

function HomePage() {
  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-ink-800">
          Find Your Next Opportunity
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-600">
          Connect talented people with companies looking for great candidates.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/register/job-seeker"
            className="rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600"
          >
            Join as Job Seeker
          </a>
          <a
            href="/register/company"
            className="rounded-lg border border-brand-500 px-6 py-3 font-semibold text-brand-500 hover:bg-brand-50"
          >
            Join as a Company
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
       
        <Routes>
          {/* ---------- Public (with your existing Header) ---------- */}
          <Route path="/" element={<HomeRoute />} />
          <Route
            path="/login"
            element={
              <>
                <Header />
                <LoginPage />
              </>
            }
          />
          <Route
            path="/register/job-seeker"
            element={
              <>
                <Header />
                <RegisterPage userType="JOB_SEEKER" />
              </>
            }
          />
          <Route
            path="/register/company"
            element={
              <>
                <Header />
                <RegisterPage userType="COMPANY" />
              </>
            }
          />

          {/* ---------- Authenticated app with sidebar ---------- */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/news" element={<NewsPage />} />

            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* Company only */}
            <Route
              path="/company/profile"
              element={
                <ProtectedRoute allowedType="COMPANY">
                  <CompanyProfileView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/profile/edit"
              element={
                <ProtectedRoute allowedType="COMPANY">
                  <CompanyProfileEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/jobs"
              element={
                <ProtectedRoute allowedType="COMPANY">
                  <CompanyJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/jobs/new"
              element={
                <ProtectedRoute allowedType="COMPANY">
                  <JobCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/create-profile"
              element={
                <ProtectedRoute allowedType="COMPANY">
                  <CompanyCreateProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Job seeker only */}
            <Route
              path="/job-seeker/profile"
              element={
                <ProtectedRoute allowedType="JOB_SEEKER">
                  <JobSeekerProfileView />
                </ProtectedRoute>
              }
            />
            

            <Route
              path="/job-seeker/profile/edit"
              element={
                <ProtectedRoute allowedType="JOB_SEEKER">
                  <JobSeekerProfileEditPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/job-seeker/create-profile"
              element={
                <ProtectedRoute allowedType="JOB_SEEKER">
                  <JobSeekerCreateProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id/apply"
              element={
                <ProtectedRoute allowedType="JOB_SEEKER">
                  <JobApplyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/jobs/:id/edit"
              element={
                <ProtectedRoute allowedType="COMPANY">
                  <JobEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedType="JOB_SEEKER">
                  <JobSeekerApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ProtectedRoute allowedType="JOB_SEEKER">
                  <JobSeekerApplicationDetailPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}