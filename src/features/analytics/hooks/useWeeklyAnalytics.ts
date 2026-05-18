import { useQuery } from "@tanstack/react-query";
import { fetchWeeklyAnalytics } from "../services/analytics.api";
import type { WeeklyAnalytics } from "../types";

export const useWeeklyAnalytics = (studentId?: string) =>
  useQuery<WeeklyAnalytics>({ queryKey: ['analytics', 'weekly', studentId], queryFn: () => fetchWeeklyAnalytics(studentId), staleTime: 1000 * 60 * 5 });
