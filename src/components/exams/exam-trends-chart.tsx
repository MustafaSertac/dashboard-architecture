"use client";

import { useMemo, useState } from "react";
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
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function ExamTrendsChart({ examType, studentId }: ExamTrendsChartProps) {
  const { user } = useAuth();
  const examCode = examTypeToExamCode(examType);
  const isAllStudents = !studentId;

  // Tek ogrenci: useExamTrends; tum ogrenciler: useExamTrendsAll (BACKEND #7).
  const single = useExamTrends(studentId ?? "__none__", examCode);
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
      }));
  }, [query.data, isAllStudents]);

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
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
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
                      />
                    ))}
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Net"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
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
