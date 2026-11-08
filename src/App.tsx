import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/Applayout";
import { AuthProvider } from "./context/AuthContext";
import { ApplyModalProvider } from "./components/apply/ApplyModalContext";
import ApplyModal from "./components/apply/ApplyModal";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Profiles
import CompanyProfileView from "./pages/profiles/CompanyProfileView";
import JobSeekerProfileView from "./pages/profiles/JobSeekerProfileView";
import CompanyCreateProfilePage from "./pages/profiles/CompanyCreateProfilePage";
import JobSeekerCreateProfilePage from "./pages/profiles/JobSeekerCreateProfilePage";
import JobSeekerProfileEditPage from "./pages/profiles/JobSeekerProfileEditPage";
import CompanyProfileEditPage from "./pages/profiles/CompanyProfileEditPage";

// Jobs
import JobCreatePage from "./pages/job/JobCreatePage";
import JobListPage from "./pages/job/JobListPage";
import JobDetailPage from "./pages/job/JobDetailPage";
import JobApplyPage from "./pages/job/JobApplyPage";
import JobSeekerApplicationsPage from "./pages/job/JobSeekerApplicationsPage";
import JobSeekerApplicationDetailPage from "./pages/job/JobSeekerApplicationsDetailPage";
import CompanyJobsPage from "./pages/job/CompanyJobsPage";
import JobEditPage from "./pages/job/JobEditPage";

// Sidebar pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import NotificationsPage from "./pages/notification/NorificationsPage";

import HomeRoute from "./components/HomeRoute";
import NewsListPage from "./components/news/NewsListPage";
import NewsDetailPage from "./components/news/NewsDetailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ApplyModalProvider>
            <Routes>
              {/* ---------- Public ---------- */}
              <Route path="/" element={<HomeRoute />} />
              <Route path="/jobs" element={<JobListPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />

              <Route
                path="/login"
                element={
                  <>
                    <Header />
                    <LoginPage />
                  </>
                }
              />
              {/* <Route
                path="/register/job-seeker"
                element={
                  <>
                    <Header />
                    <RegisterPage userType="JOB_SEEKER" />
                  </>
                }
              /> */}
              <Route
                path="/register/company"
                element={
                  <>
                    <Header />
                    <RegisterPage userType="COMPANY" />
                  </>
                }
              />
              <Route
                path="/forgot-password"
                element={<><Header /><ForgotPasswordPage /></>}
              />

              <Route
                path="/password/reset/confirm/:uid/:token"
                element={<><Header /><ResetPasswordPage /></>}
              />

              {/* ---------- Authenticated app ---------- */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                  path="/notifications"
                  element={<NotificationsPage />}
                />

                <Route path="/news" element={<NewsListPage />} />
                <Route path="/news/:slug" element={<NewsDetailPage />} />

                

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
                  path="/company/job/job_list"
                  element={
                    <ProtectedRoute allowedType="COMPANY">
                      <JobListPage />
                    </ProtectedRoute>
                  }
                />
             
                <Route
                  path="/company/jobs/:id"
                  element={
                    <ProtectedRoute allowedType="COMPANY">
                      <JobDetailPage />
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
                  path="/company/jobs/:id/edit"
                  element={
                    <ProtectedRoute allowedType="COMPANY">
                      <JobEditPage />
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
              <Route path="/change-password" element={<ChangePasswordPage />} />

            </Routes>

            {/* Mounted once, outside <Routes>, inside the provider */}
            <ApplyModal />
          </ApplyModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}