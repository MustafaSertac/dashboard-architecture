"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format, subDays, parseISO, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";

export function WeeklyProgressCard() {
  const { tasks, currentUser } = useApp();
  
  const weeklyData = useMemo(() => {
    const today = startOfDay(new Date());
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayTasks = tasks.filter(
        (t) => t.studentId === currentUser.id && t.date === dateStr
      );
      
      const solved = dayTasks.reduce((sum, t) => sum + t.solvedCount, 0);
      const correct = dayTasks.reduce((sum, t) => sum + t.correctCount, 0);
      
      data.push({
        day: format(date, "EEE", { locale: tr }),
        soru: solved,
        dogru: correct,
      });
    }

    return data;
  }, [tasks, currentUser.id]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Haftalik Ilerleme</CardTitle>
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
                name="Cozulen"
              />
              <Bar 
                dataKey="dogru" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
                name="Dogru"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
