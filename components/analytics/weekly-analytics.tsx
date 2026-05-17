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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, TrendingUp, Clock, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayAnalytics {
  date: Date;
  dayName: string;
  subjects: {
    name: string;
    questions: number;
    correct: number;
    hours: number;
  }[];
  totalQuestions: number;
  totalCorrect: number;
  totalHours: number;
}

interface WeeklyAnalyticsProps {
  studentId?: string;
}

export function WeeklyAnalytics({ studentId: propStudentId }: WeeklyAnalyticsProps) {
  const { tasks, currentUser, students } = useApp();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const studentId = propStudentId || (currentUser.role === "student" ? currentUser.id : students[0]?.id);
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const handleCurrentWeek = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = useMemo(() => {
    const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
    return days.map((date): DayAnalytics => {
      const dayTasks = tasks.filter(
        (task) =>
          task.studentId === studentId && isSameDay(new Date(task.dueDate), date)
      );

      const subjectMap = new Map<
        string,
        { questions: number; correct: number; hours: number }
      >();

      dayTasks.forEach((task) => {
        const existing = subjectMap.get(task.subject) || {
          questions: 0,
          correct: 0,
          hours: 0,
        };
        subjectMap.set(task.subject, {
          questions: existing.questions + (task.completedQuestions || 0),
          correct: existing.correct + (task.correctAnswers || 0),
          hours: existing.hours + (task.hoursStudied || 0),
        });
      });

      const subjects = Array.from(subjectMap.entries()).map(([name, data]) => ({
        name,
        ...data,
      }));

      return {
        date,
        dayName: format(date, "EEEE", { locale: tr }),
        subjects,
        totalQuestions: subjects.reduce((sum, s) => sum + s.questions, 0),
        totalCorrect: subjects.reduce((sum, s) => sum + s.correct, 0),
        totalHours: subjects.reduce((sum, s) => sum + s.hours, 0),
      };
    });
  }, [currentWeekStart, weekEnd, tasks, studentId]);

  const weeklyTotals = useMemo(() => {
    return weekDays.reduce(
      (acc, day) => ({
        questions: acc.questions + day.totalQuestions,
        correct: acc.correct + day.totalCorrect,
        hours: acc.hours + day.totalHours,
      }),
      { questions: 0, correct: 0, hours: 0 }
    );
  }, [weekDays]);

  const isCurrentWeek = isSameDay(
    currentWeekStart,
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const allSubjects = useMemo(() => {
    const subjectSet = new Set<string>();
    weekDays.forEach((day) => {
      day.subjects.forEach((s) => subjectSet.add(s.name));
    });
    return Array.from(subjectSet);
  }, [weekDays]);

  return (
    <div className="space-y-6">
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

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="size-4" />
              <span className="text-xs">Toplam Soru</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{weeklyTotals.questions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="size-4" />
              <span className="text-xs">Dogru</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{weeklyTotals.correct}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              <span className="text-xs">Toplam Saat</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{weeklyTotals.hours.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="size-4" />
              <span className="text-xs">Basari Orani</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {weeklyTotals.questions > 0
                ? ((weeklyTotals.correct / weeklyTotals.questions) * 100).toFixed(0)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Haftalik Ders Analizi</CardTitle>ss
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Ders</th>
                  {weekDays.map((day) => (
                    <th
                      key={day.date.toISOString()}
                      className={cn(
                        "p-3 text-center font-medium",
                        isSameDay(day.date, new Date()) && "bg-primary/10"
                      )}
                    >
                      <div className="text-xs text-muted-foreground">
                        {day.dayName.slice(0, 3)}
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-sm",
                          isSameDay(day.date, new Date()) && "text-primary font-bold"
                        )}
                      >
                        {day.date.getDate()}
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-center font-medium">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {allSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">
                      Bu hafta icin veri bulunmuyor
                    </td>
                  </tr>
                ) : (
                  allSubjects.map((subject) => {
                    const subjectTotal = weekDays.reduce((sum, day) => {
                      const s = day.subjects.find((s) => s.name === subject);
                      return sum + (s?.questions || 0);
                    }, 0);

                    return (
                      <tr key={subject} className="border-b last:border-b-0">
                        <td className="p-3 font-medium">{subject}</td>
                        {weekDays.map((day) => {
                          const s = day.subjects.find((s) => s.name === subject);
                          return (
                            <td
                              key={day.date.toISOString()}
                              className={cn(
                                "p-3 text-center",
                                isSameDay(day.date, new Date()) && "bg-primary/5"
                              )}
                            >
                              {s ? (
                                <div className="space-y-1">
                                  <div className="font-medium">{s.questions}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {s.correct} dogru
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3 text-center font-bold">{subjectTotal}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {allSubjects.length > 0 && (
                <tfoot>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3 font-bold">Gunluk Toplam</td>
                    {weekDays.map((day) => (
                      <td
                        key={day.date.toISOString()}
                        className={cn(
                          "p-3 text-center font-bold",
                          isSameDay(day.date, new Date()) && "bg-primary/10"
                        )}
                      >
                        {day.totalQuestions}
                      </td>
                    ))}
                    <td className="p-3 text-center font-bold text-primary">
                      {weeklyTotals.questions}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Haftalik Ders Dagilimi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allSubjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Veri bulunmuyor</p>
          ) : (
            allSubjects.map((subject) => {
              const total = weekDays.reduce((sum, day) => {
                const s = day.subjects.find((s) => s.name === subject);
                return sum + (s?.questions || 0);
              }, 0);
              const percentage =
                weeklyTotals.questions > 0
                  ? (total / weeklyTotals.questions) * 100
                  : 0;

              return (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{subject}</span>
                    <span className="text-muted-foreground">
                      {total} soru ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
