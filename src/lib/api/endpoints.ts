export const endpoints = {
  auth: {
    login: "/auth/login",
    registerStudent: "/auth/student",
    // BACKEND HATA H-1: "teachter" yazimi backend kaynak kodunda boyle.
    // Backend /auth/teacher olarak duzeltilene kadar bu URL kullanilir.
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
    // BACKEND EKSIK #7 (Orta): Toplu trend endpoint'i YOK.
    // Tek tek /exams/trends cagrilmaya devam eder (N+1 kabul).
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
    // BACKEND EKSIK #6 (Orta): Toplu complete endpoint'i YOK.
    // Stub: hizmet hook'u once bunu cagistir, 404/405 gelirse per-task complete'e duser.
    completeBatch: "/study-tasks/complete/batch",
    logStudy: "/study-tasks/log-study",
  },

  // BACKEND EKSIK #2 (Yuksek): Ogretmen-Ogrenci liste endpoint'i YOK.
  // Stub: once /students?teacherId= denenir, 404 gelirse mock fallback'e duser.
  students: {
    listByTeacher: "/students",
  },

  // BACKEND EKSIK #5 (Orta): Not/Feedback endpoint'i YOK.
  // Stub: once /students/{id}/notes denenir, 404 gelirse simulated setTimeout fallback.
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
