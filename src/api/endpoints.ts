export const endpoints = {
  auth: {
    register: "/auth/users/",
    login: "/auth/jwt/create/",
    refresh: "/auth/jwt/refresh/",
    verify: "/auth/jwt/verify/",
    me: "/auth/users/me/",
    changePassword: "/auth/users/set_password/",
    resetPassword: "/auth/users/reset_password/",
    resetPasswordConfirm: "/auth/users/reset_password_confirm/",
  },

  accounts: {
    company: "/accounts/company/",
    jobSeeker: "/accounts/job-seeker/",
  },

  jobs: {
    list: "/jobs/",
    detail: (id: number | string) => `/jobs/${id}/`,
  },

  applications: {
    list: "/applications/",
    detail: (id: number | string) => `/applications/${id}/`,
  },
} as const;