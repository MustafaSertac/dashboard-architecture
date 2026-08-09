export const endpoints = {
  auth: {
    login: "/auth/login",
    registerStudent: "/auth/student",
    registerTeacher: "/auth/teachter",
    forgotPassword: "/auth/forgot-password",
    refreshToken: "/auth/refresh-token",
    logout: "/auth/logout",
    profile: (userId: string) => `/auth/profiles/${userId}`,
    updateProfile: "/auth/profiles",
  },

  lessons: {
    list: "/lessons",
    detail: (id: string) => `/lessons/${id}`,
    create: "/lessons",
    update: (id: string) => `/lessons/${id}`,
    delete: (id: string) => `/lessons/${id}`,
  },

  units: {
    listByLesson: (lessonId: string) => `/lessons/${lessonId}/units`,
    create: (lessonId: string) => `/lessons/${lessonId}/units`,
    update: (unitId: string) => `/units/${unitId}`,
    delete: (unitId: string) => `/units/${unitId}`,
  },

  topics: {
    listByUnit: (unitId: string) => `/units/${unitId}/topics`,
    create: (unitId: string) => `/units/${unitId}/topics`,
    update: (topicId: string) => `/topics/${topicId}`,
    delete: (topicId: string) => `/topics/${topicId}`,
  },

  exams: {
    list: "/exams",
    detail: (id: string) => `/exams/${id}`,
    trends: "/exams/trends",
    create: "/exams",
    update: (id: string) => `/exams/${id}`,
    delete: (id: string) => `/exams/${id}`,
  },

  studyTasks: {
    today: (studentId: string) => `/study-tasks/today/${studentId}`,
    upcoming: (studentId: string) => `/study-tasks/upcoming/${studentId}`,
    byStudentRange: (studentId: string) =>
      `/study-tasks/students/${studentId}`,
    create: "/study-tasks",
    update: "/study-tasks/update",
    delete: "/study-tasks",
    complete: "/study-tasks/complete",
    logStudy: "/study-tasks/log-study",
  },

  analytics: {
    weekly: "/analytics/weekly",
    monthly: "/analytics/monthly",
    yearly: "/analytics/yearly",
    dashboard: "/analytics/dashboard",
  },
} as const;
