"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function ExamTrendsChart({ examType, studentId }: ExamTrendsChartProps) {
  const { examResults, students } = useApp();

  // If studentId is provided, filter for single student, otherwise show all students
  const studentsToShow = studentId 
    ? students.filter((s) => s.id === studentId)
    : students;

  const chartData = useMemo(() => {
    // Get all unique dates
    const dates = Array.from(
      new Set(
        examResults
          .filter((e) => e.examType === examType)
          .map((e) => e.date)
      )
    ).sort();

    // Build data for each date with all students
    return dates.map((date) => {
      const dataPoint: Record<string, string | number> = {
        date: format(parseISO(date), "d MMM", { locale: tr }),
      };

      studentsToShow.forEach((student) => {
        const exam = examResults.find(
          (e) =>
            e.date === date &&
            e.examType === examType &&
            e.studentId === student.id
        );
        if (exam) {
          dataPoint[student.name] = exam.net;
        }
      });

      return dataPoint;
    });
  }, [examResults, examType, studentsToShow]);

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {examType} Net Trend Analizi
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
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
                <Legend />
                {studentsToShow.map((student, index) => (
                  <Line
                    key={student.id}
                    type="monotone"
                    dataKey={student.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
