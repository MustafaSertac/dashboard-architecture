import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { analyticsService } from "@/modules/analytics/services/analytics.service";
import { mapWeeklyAnalytics, mapMonthlyAnalytics, mapDashboardOverview } from "@/modules/analytics/mappers/analytics.mapper";

export function useWeeklyAnalytics(studentId: string, weekStart: string) {
  return useQuery({
    queryKey: qk.analytics.weekly(studentId, weekStart),
    queryFn: async () => {
      const dto = await analyticsService.weekly(studentId, weekStart);
      return mapWeeklyAnalytics(dto, weekStart, 7);
    },
    enabled: !!studentId && !!weekStart,
  });
}

export function useMonthlyAnalytics(
  studentId: string,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: qk.analytics.monthly(studentId, year, month),
    queryFn: async () => {
      const dto = await analyticsService.monthly(studentId, year, month);
      return mapMonthlyAnalytics(dto);
    },
    enabled: !!studentId,
  });
}

export function useYearlyAnalytics(studentId: string, year: number) {
  return useQuery({
    queryKey: qk.analytics.yearly(studentId, year),
    queryFn: async () => {
      const dto = await analyticsService.yearly(studentId, year);
      return mapMonthlyAnalytics(dto);
    },
    enabled: !!studentId,
  });
}

export function useDashboardOverview(studentId: string) {
  return useQuery({
    queryKey: qk.analytics.dashboard(studentId),
    queryFn: async () => {
      const dto = await analyticsService.dashboard(studentId);
      return mapDashboardOverview(dto);
    },
    enabled: !!studentId,
  });
}
