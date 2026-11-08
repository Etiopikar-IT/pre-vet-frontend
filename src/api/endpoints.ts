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
    notifications: "/accounts/notifications/",
    notificationsUnreadCount: "/accounts/notifications/unread_count/",
    notificationsMarkAllRead: "/accounts/notifications/mark_all_read/",
    publicTalentPool: "/accounts/public/talent-pool/",
    team: "/accounts/team/",
  },

  jobs: {
    list: "/jobs/",
    detail: (id: number | string) => `/jobs/${id}/`,
  },

  applications: {
    list: "/applications/",
    detail: (id: number | string) => `/applications/${id}/`,
  },

  news: {
    list: "/news/",
    detail: (slug: string) => `/news/${slug}/`,
  },
} as const;