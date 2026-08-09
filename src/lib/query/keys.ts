export const qk = {
  auth: {
    profile: (userId: string) => ["auth", "profile", userId] as const,
  },

  lessons: {
    list: (examType?: number) => ["lessons", "list", examType] as const,
    detail: (id: string) => ["lessons", id] as const,
  },

  units: {
    list: (lessonId: string) => ["units", lessonId] as const,
  },

  topics: {
    list: (unitId: string) => ["topics", unitId] as const,
  },

  exams: {
    list: (studentId: string, page?: number) =>
      ["exams", "list", studentId, page] as const,
    detail: (id: string, detailed: boolean = false) =>
      ["exams", id, detailed] as const,
    trends: (studentId: string, examCode: number, limit?: number) =>
      ["exams", "trends", studentId, examCode, limit] as const,
  },

  tasks: {
    today: (studentId: string) => ["tasks", "today", studentId] as const,
    upcoming: (studentId: string) => ["tasks", "upcoming", studentId] as const,
    byRange: (studentId: string, startDate?: string, endDate?: string) =>
      ["tasks", "range", studentId, startDate, endDate] as const,
  },

  analytics: {
    weekly: (studentId: string, weekStart: string) =>
      ["analytics", "weekly", studentId, weekStart] as const,
    monthly: (studentId: string, year: number, month: number) =>
      ["analytics", "monthly", studentId, year, month] as const,
    yearly: (studentId: string, year: number) =>
      ["analytics", "yearly", studentId, year] as const,
    dashboard: (studentId: string) =>
      ["analytics", "dashboard", studentId] as const,
  },
} as const;
