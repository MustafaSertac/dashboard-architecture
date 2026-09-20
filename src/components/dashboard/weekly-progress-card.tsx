"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useWeeklyAnalytics } from "@/modules/analytics/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format, startOfDay, startOfWeek, subDays } from "date-fns";
import { tr } from "date-fns/locale";

export function WeeklyProgressCard() {
  const { user } = useAuth();

  // Bu haftanin baslangic (Pazartesi) tarihini hesapla
  const weekStart = useMemo(() => {
    const today = startOfDay(new Date());
    return format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
  }, []);

  const { data: days, isLoading, isError, error, refetch } = useWeeklyAnalytics(
    user?.id ?? "",
    weekStart
  );

  // Backend'den gelen gun bazli kirilimi son 7 gun icin yeniden sekillendir
  const weeklyData = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const day = (days ?? []).find((d) => d.date === dateStr);
      return {
        day: format(date, "EEE", { locale: tr }),
        soru: day?.questionCount ?? 0,
        dogru: day?.correctCount ?? 0,
      };
    });
  }, [days]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Haftalık İlerleme</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <ErrorState error={error} title="Veri yuklenemedi" onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Haftalık İlerleme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar
                dataKey="soru"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
                name="Çözülen"
              />
              <Bar
                dataKey="dogru"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
                name="Doğru"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
