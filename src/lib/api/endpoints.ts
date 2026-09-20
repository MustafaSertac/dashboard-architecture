export const endpoints = {
  auth: {
    login: "/auth/login",
    registerStudent: "/auth/student",
    // BACKEND H-1 DUZELTILDI: /auth/teacher olarak duzeltildi.
    registerTeacher: "/auth/teacher",
    // BACKEND #9 (Dusuk) TAMAMLANDI: email dogrulamali 3-adimli sifir akisi.
    forgotPasswordRequest: "/auth/forgot-password/request",
    forgotPasswordVerify: "/auth/forgot-password/verify",
    forgotPasswordReset: "/auth/forgot-password/reset",
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
    // BACKEND #7 (Orta) TAMAMLANDI: toplu trend endpoint'i.
    trendsAll: "/exams/trends/all",
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
    // BACKEND #6 (Orta) TAMAMLANDI: toplu complete endpoint'i.
    completeBatch: "/study-tasks/complete/batch",
    logStudy: "/study-tasks/log-study",
    // BACKEND #10 (Dusuk) TAMAMLANDI: focus session tracking.
    focusSession: (taskId: string) => `/study-tasks/${taskId}/focus-session`,
    focusSessions: (taskId: string) =>
      `/study-tasks/${taskId}/focus-sessions`,
  },

  // BACKEND #2 (Yuksek) TAMAMLANDI: GET /teachers/{teacherId}/students.
  students: {
    listByTeacher: (teacherId: string) => `/teachers/${teacherId}/students`,
    add: (teacherId: string) => `/teachers/${teacherId}/students`,
    remove: (teacherId: string, studentId: string) =>
      `/teachers/${teacherId}/students/${studentId}`,
  },

  // BACKEND #5 (Orta) TAMAMLANDI: Not/Feedback endpoint'i.
  notes: {
    list: (studentId: string) => `/students/${studentId}/notes`,
    create: (studentId: string) => `/students/${studentId}/notes`,
    delete: (studentId: string, noteId: string) =>
      `/students/${studentId}/notes/${noteId}`,
  },

  analytics: {
    weekly: "/analytics/weekly",
    monthly: "/analytics/monthly",
    yearly: "/analytics/yearly",
    dashboard: "/analytics/dashboard",
  },
} as const;
