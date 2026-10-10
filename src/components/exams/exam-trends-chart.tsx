"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useExamTrends, useExamTrendsAll } from "@/modules/exams/hooks/useExams";
import { examTypeToExamCode } from "@/types/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import type { ExamType } from "@/lib/types";

interface ExamTrendsChartProps {
  examType: ExamType;
  studentId?: string;
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ExamTrendsChart({ examType, studentId }: ExamTrendsChartProps) {
  const { user } = useAuth();
  const examCode = examTypeToExamCode(examType);
  const isAllStudents = !studentId;

  // Tek ogrenci: useExamTrends; tum ogrenciler: useExamTrendsAll (BACKEND #7).
  // Iki hook da kosulsuz cagrilir (rules of hooks) ancak `enabled` ile yalnizca
  // aktif modun sorgusu calisir; boylece gereksiz istek atilmaz.
  const single = useExamTrends(studentId ?? "", examCode);
  const all = useExamTrendsAll(examCode, isAllStudents ? user?.id : undefined);

  const query = isAllStudents ? all : single;

  const chartData = useMemo(() => {
    if (isAllStudents) {
      // Cok-ogrenci: her ogrenci bir cizgi. Tarihler birlesik eksende.
      const trends = (query.data as ReturnType<typeof useExamTrendsAll>["data"]) ?? [];
      const dates = Array.from(
        new Set(
          trends.flatMap((t) =>
            t.exams.map((e) => e.date)
          )
        )
      ).sort();

      return dates.map((date) => {
        const point: Record<string, string | number> = {
          date: format(parseISO(date), "d MMM", { locale: tr }),
        };
        trends.forEach((t) => {
          const exam = t.exams.find((e) => e.date === date);
          if (exam) point[t.studentName] = Number(exam.totalNet.toFixed(1));
        });
        return point;
      });
    }

    return ((query.data as ReturnType<typeof useExamTrends>["data"]) ?? [])
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: format(parseISO(e.date), "d MMM", { locale: tr }),
        net: Number(e.totalNet.toFixed(1)),
        examName: e.examName ?? `${e.examType} Denemesi`,
      }));
  }, [query.data, isAllStudents]);

  const yDomain = useMemo((): [number | "auto", number | "auto"] => {
    if (isAllStudents || chartData.length === 0) return ["auto", "auto"];
    const nets = chartData.map((d) => Number((d as { net: number }).net));
    const min = Math.min(...nets);
    const max = Math.max(...nets);
    const padding = Math.max((max - min) * 0.15, 5);
    return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
  }, [chartData, isAllStudents]);

  const studentNames = useMemo(() => {
    if (!isAllStudents) return [];
    const trends = (query.data as ReturnType<typeof useExamTrendsAll>["data"]) ?? [];
    return trends.map((t) => t.studentName);
  }, [query.data, isAllStudents]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {examType} Net Trend Analizi
        </CardTitle>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : query.isError ? (
          <ErrorState
            error={query.error}
            title="Trend verisi yuklenemedi"
            onRetry={() => query.refetch()}
          />
        ) : chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Henuz yeterli veri yok.
          </p>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={yDomain}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) => Number(value).toFixed(0)}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                  labelStyle={{ color: "var(--muted-foreground)" }}
                />
                {isAllStudents ? (
                  <>
                    <Legend />
                    {studentNames.map((name, index) => (
                      <Line
                        key={name}
                        type="monotone"
                        dataKey={name}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        connectNulls
                      />
                    ))}
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Net"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: "var(--chart-1)",
                      stroke: "var(--card)",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "var(--chart-1)",
                      stroke: "var(--card)",
                      strokeWidth: 2,
                    }}
                    connectNulls
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
