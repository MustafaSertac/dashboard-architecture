"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { tr } from "date-fns/locale";
import { useApp } from "@/lib/context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekTask {
  id: string;
  subject: string;
  topic: string;
  targetQuestions: number;
  completedQuestions: number;
  isCompleted: boolean;
}

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  tasks: WeekTask[];
}

interface WeeklyTasksViewProps {
  studentId: string;
  role?: "student" | "teacher";
}

export function WeeklyTasksView({ studentId, role = "student" }: WeeklyTasksViewProps) {
  const isTeacher = role === "teacher";
  const { tasks } = useApp();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const handleCurrentWeek = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = useMemo(() => {
    const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
    return days.map((date): DayData => {
      const dayTasks = tasks
        .filter(
          (task) =>
            task.studentId === studentId && isSameDay(new Date(task.dueDate), date)
        )
        .map((task) => ({
          id: task.id,
          subject: task.subject,
          topic: task.topic,
          targetQuestions: task.questionCount,
          completedQuestions: task.completedQuestions || 0,
          isCompleted: task.status === "completed",
        }));

      return {
        date,
        dayName: format(date, "EEEE", { locale: tr }),
        dayNumber: date.getDate(),
        tasks: dayTasks,
      };
    });
  }, [currentWeekStart, weekEnd, tasks, studentId]);

  const isCurrentWeek =
    isSameDay(currentWeekStart, startOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-semibold">
              {format(currentWeekStart, "d MMM", { locale: tr })} -{" "}
              {format(weekEnd, "d MMM yyyy", { locale: tr })}
            </span>
            {!isCurrentWeek && (
              <Button
                variant="link"
                size="sm"
                onClick={handleCurrentWeek}
                className="h-auto p-0"
              >
                Bu Haftaya Don
              </Button>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              {weekDays.map((day) => (
                <th
                  key={day.date.toISOString()}
                  className={cn(
                    "border-r p-3 text-center last:border-r-0",
                    isSameDay(day.date, new Date()) && "bg-primary/10"
                  )}
                >
                  <div className="text-sm font-medium text-muted-foreground">
                    {day.dayName}
                  </div>
                  <div
                    className={cn(
                      "mt-1 inline-flex size-8 items-center justify-center rounded-full text-lg font-bold",
                      isSameDay(day.date, new Date()) &&
                        "bg-primary text-primary-foreground"
                    )}
                  >
                    {day.dayNumber}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {weekDays.map((day) => (
                <td
                  key={day.date.toISOString()}
                  className={cn(
                    "border-r p-2 align-top last:border-r-0",
                    isSameDay(day.date, new Date()) && "bg-primary/5"
                  )}
                  style={{ minHeight: "200px", verticalAlign: "top" }}
                >
                  <div className="flex min-h-[250px] flex-col gap-2">
                    {day.tasks.length === 0 ? (
                      <p className="text-center text-xs text-muted-foreground py-4">
                        Gorev yok
                      </p>
                    ) : (
                      day.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "rounded-md border p-2 text-xs",
                            task.isCompleted
                              ? "bg-success/10 border-success/30"
                              : "bg-card"
                          )}
                        >
                          <div className="font-semibold text-foreground">
                            {task.subject}
                          </div>
                          <div className="mt-0.5 text-muted-foreground">
                            {task.topic}
                          </div>
                          <div className="mt-1.5 flex items-center justify-between">
                            <Badge
                              variant={task.isCompleted ? "default" : "outline"}
                              className="text-[10px] px-1.5 py-0"
                            >
                              {task.targetQuestions} soru
                            </Badge>
                            {task.isCompleted && (
                              <span className="text-success text-[10px]">✓</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded bg-success/30 border border-success/50" />
          <span>Tamamlandi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded bg-card border" />
          <span>Bekliyor</span>
        </div>
      </div>
    </div>
  );
}
