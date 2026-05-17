"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  getDay,
} from "date-fns";
import { tr } from "date-fns/locale";
import { useApp } from "@/lib/context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DaySummary {
  date: Date;
  totalQuestions: number;
  completedQuestions: number;
  totalHours: number;
  correctAnswers: number;
  status: "success" | "warning" | "danger" | "empty";
}

export function MonthlyTasksView({ studentId }: { studentId: string }) {
  const { tasks } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleCurrentMonth = () => setCurrentMonth(new Date());

  const calendarDays = useMemo(() => {
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    return days.map((date): DaySummary => {
      const dayTasks = tasks.filter(
        (task) =>
          task.studentId === studentId && isSameDay(new Date(task.dueDate), date)
      );

      const totalQuestions = dayTasks.reduce((sum, t) => sum + t.questionCount, 0);
      const completedQuestions = dayTasks.reduce(
        (sum, t) => sum + (t.completedQuestions || 0),
        0
      );
      const totalHours = dayTasks.reduce(
        (sum, t) => sum + (t.hoursStudied || 0),
        0
      );
      const correctAnswers = dayTasks.reduce(
        (sum, t) => sum + (t.correctAnswers || 0),
        0
      );

      let status: DaySummary["status"] = "empty";
      if (totalQuestions > 0) {
        const completionRate = completedQuestions / totalQuestions;
        if (completionRate >= 0.8) {
          status = "success";
        } else if (completionRate >= 0.5) {
          status = "warning";
        } else {
          status = "danger";
        }
      }

      return {
        date,
        totalQuestions,
        completedQuestions,
        totalHours,
        correctAnswers,
        status,
      };
    });
  }, [calendarStart, calendarEnd, tasks, studentId]);

  const weekDays = ["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"];

  const isCurrentMonth = isSameMonth(currentMonth, new Date());

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const monthDays = calendarDays.filter((d) => isSameMonth(d.date, currentMonth));
    return {
      totalQuestions: monthDays.reduce((sum, d) => sum + d.totalQuestions, 0),
      completedQuestions: monthDays.reduce((sum, d) => sum + d.completedQuestions, 0),
      totalHours: monthDays.reduce((sum, d) => sum + d.totalHours, 0),
      correctAnswers: monthDays.reduce((sum, d) => sum + d.correctAnswers, 0),
      successDays: monthDays.filter((d) => d.status === "success").length,
      warningDays: monthDays.filter((d) => d.status === "warning").length,
      dangerDays: monthDays.filter((d) => d.status === "danger").length,
    };
  }, [calendarDays, currentMonth]);

  const statusColors = {
    success: "bg-success/20 border-success/40 text-success-foreground",
    warning: "bg-warning/20 border-warning/40 text-warning-foreground",
    danger: "bg-destructive/20 border-destructive/40 text-destructive-foreground",
    empty: "bg-card",
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy", { locale: tr })}
            </span>
            {!isCurrentMonth && (
              <Button
                variant="link"
                size="sm"
                onClick={handleCurrentMonth}
                className="h-auto p-0"
              >
                Bu Aya Don
              </Button>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Monthly Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Toplam Soru</p>
            <p className="text-xl font-bold">{monthlyStats.totalQuestions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Cozulen</p>
            <p className="text-xl font-bold">{monthlyStats.completedQuestions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Toplam Saat</p>
            <p className="text-xl font-bold">{monthlyStats.totalHours.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Dogru</p>
            <p className="text-xl font-bold">{monthlyStats.correctAnswers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              {weekDays.map((day) => (
                <th key={day} className="p-3 text-center text-sm font-medium">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map(
              (_, weekIndex) => (
                <tr key={weekIndex} className="border-b last:border-b-0">
                  {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => {
                    const isToday = isSameDay(day.date, new Date());
                    const isCurrentMonthDay = isSameMonth(day.date, currentMonth);

                    return (
                      <td
                        key={day.date.toISOString()}
                        className={cn(
                          "border-r p-1 last:border-r-0",
                          !isCurrentMonthDay && "opacity-40"
                        )}
                      >
                        <div
                          className={cn(
                            "min-h-[80px] rounded-md border p-2",
                            statusColors[day.status],
                            isToday && "ring-2 ring-primary"
                          )}
                        >
                          <div
                            className={cn(
                              "text-right text-sm font-medium",
                              isToday && "text-primary"
                            )}
                          >
                            {day.date.getDate()}
                          </div>
                          {day.totalQuestions > 0 && (
                            <div className="mt-1 space-y-0.5 text-[10px]">
                              <div>
                                {day.completedQuestions}/{day.totalQuestions} soru
                              </div>
                              <div>{day.totalHours.toFixed(1)} saat</div>
                              <div>{day.correctAnswers} dogru</div>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded bg-success/30 border border-success/50" />
          <span>Hedef Tamamlandi (%80+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded bg-warning/30 border border-warning/50" />
          <span>Kismi Tamamlandi (%50-80)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded bg-destructive/30 border border-destructive/50" />
          <span>Yetersiz (%50 alti)</span>
        </div>
      </div>
    </div>
  );
}
