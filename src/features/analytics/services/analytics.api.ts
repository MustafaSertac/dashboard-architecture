import { fetchJson } from "../../../config/api";
import type { WeeklyAnalytics } from "../types";

export const fetchWeeklyAnalytics = async (studentId?: string): Promise<WeeklyAnalytics> => {
  const url = studentId ? `/api/analytics/weekly?studentId=${encodeURIComponent(studentId)}` : '/api/analytics/weekly';
  return fetchJson(url);
};
