import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  WeeklyAnalyticsDTO,
  MonthlyAnalyticsDTO,
  DashboardOverviewDTO,
} from "@/modules/analytics/types/analytics.types";

export const analyticsService = {
  async weekly(
    studentId: string,
    weekStart: string
  ): Promise<WeeklyAnalyticsDTO> {
    const res = await apiClient.get(endpoints.analytics.weekly, {
      params: { studentId, weekStart },
    });
    return res.data.data;
  },

  async monthly(
    studentId: string,
    year: number,
    month: number
  ): Promise<MonthlyAnalyticsDTO> {
    const res = await apiClient.get(endpoints.analytics.monthly, {
      params: { studentId, year, month },
    });
    return res.data.data;
  },

  async yearly(
    studentId: string,
    year: number
  ): Promise<MonthlyAnalyticsDTO> {
    const res = await apiClient.get(endpoints.analytics.yearly, {
      params: { studentId, year },
    });
    return res.data.data;
  },

  async dashboard(studentId: string): Promise<DashboardOverviewDTO> {
    const res = await apiClient.get(endpoints.analytics.dashboard, {
      params: { studentId },
    });
    return res.data.data;
  },
};
