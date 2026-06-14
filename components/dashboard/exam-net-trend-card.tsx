"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import type { ExamType } from "@/lib/types";

type ChartPoint = {
  date: string;
  net: number;
  examName: string;
};

export function ExamNetTrendCard() {
  const { examResults, currentUser } = useApp();
  const [examType, setExamType] = useState<ExamType>("TYT");

  const chartData = useMemo((): ChartPoint[] => {
    return examResults
      .filter((e) => e.studentId === currentUser.id && e.examType === examType)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((exam) => ({
        date: format(parseISO(exam.date), "d MMM", { locale: tr }),
        net: Number(exam.totalNet.toFixed(1)),
        examName: exam.examName ?? `${exam.examType} Denemesi`,
      }));
  }, [examResults, currentUser.id, examType]);

  const yDomain = useMemo((): [number, number] => {
    if (chartData.length === 0) return [0, 100];

    const nets = chartData.map((d) => d.net);
    const min = Math.min(...nets);
    const max = Math.max(...nets);
    const padding = Math.max((max - min) * 0.15, 5);

    return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Deneme Net Grafiği
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentUser.name.split(" ")[0]} — {examType} net grafiği
          </p>
        </div>
        <Tabs
          value={examType}
          onValueChange={(value) => setExamType(value as ExamType)}
        >
          <TabsList className="h-8">
            <TabsTrigger value="TYT" className="px-3 text-xs">
              TYT
            </TabsTrigger>
            <TabsTrigger value="AYT" className="px-3 text-xs">
              AYT
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {examType} için henüz deneme sonucu yok.
          </p>
        ) : (
          <div className="h-[260px] w-full">
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
                  tickFormatter={(value) => value.toFixed(0)}
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
                  formatter={(value: number) => [
                    `${value.toFixed(1)} net`,
                    "Net",
                  ]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.examName ?? ""
                  }
                />
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
