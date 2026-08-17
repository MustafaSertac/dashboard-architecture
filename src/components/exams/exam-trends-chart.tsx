"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useExamTrends } from "@/modules/exams/hooks/useExams";
import { examTypeToExamCode } from "@/types/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import type { ExamType } from "@/lib/types";

interface ExamTrendsChartProps {
  examType: ExamType;
  studentId?: string;
}

export function ExamTrendsChart({ examType, studentId }: ExamTrendsChartProps) {
  const { user } = useAuth();
  const targetStudentId = studentId ?? user?.id ?? "";
  const examCode = examTypeToExamCode(examType);

  const { data: exams, isLoading, isError, refetch } = useExamTrends(
    targetStudentId,
    examCode
  );

  const chartData = useMemo(() => {
    return (exams ?? [])
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        date: format(parseISO(e.date), "d MMM", { locale: tr }),
        net: Number(e.totalNet.toFixed(1)),
      }));
  }, [exams]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {examType} Net Trend Analizi
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : isError ? (
          <div className="py-8 text-center">
            <p className="text-sm text-destructive mb-2">Trend verisi yuklenemedi</p>
            <button
              onClick={() => refetch()}
              className="text-sm text-primary hover:underline"
            >
              Tekrar dene
            </button>
          </div>
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
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
