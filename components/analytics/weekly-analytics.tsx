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

  // Daily (today) summary
  const today = new Date();
  const todayData = useMemo(() => {
    const day = weekDays.find((d) => isSameDay(d.date, today));
    if (day) return day;
    // if today is outside the current week, compute from tasks directly
    const dayTasks = tasks.filter(
      (task) => task.studentId === studentId && isSameDay(new Date(task.dueDate), today)
    );
    const subjectMap = new Map<string, { questions: number; correct: number; hours: number }>();
    dayTasks.forEach((task) => {
      const existing = subjectMap.get(task.subject) || { questions: 0, correct: 0, hours: 0 };
      subjectMap.set(task.subject, {
        questions: existing.questions + (task.completedQuestions || 0),
        correct: existing.correct + (task.correctAnswers || 0),
        hours: existing.hours + (task.hoursStudied || 0),
      });
    });
    const subjects = Array.from(subjectMap.entries()).map(([name, data]) => ({ name, ...data }));
    return {
      date: today,
      dayName: format(today, "EEEE", { locale: tr }),
      subjects,
      totalQuestions: subjects.reduce((sum, s) => sum + s.questions, 0),
      totalCorrect: subjects.reduce((sum, s) => sum + s.correct, 0),
      totalHours: subjects.reduce((sum, s) => sum + s.hours, 0),
    } as DayAnalytics;
  }, [weekDays, tasks, studentId]);

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

  const tableColSpan = weekDays.length + 1; // Ders + days

  // Weekly comparison for the last 6 weeks (including current)
  const comparisonWeeks = useMemo(() => {
    const weeks = [] as {
      start: Date;
      end: Date;
      label: string;
      questions: number;
      correct: number;
      target: number;
      hours: number;
    }[];

    for (let i = 5; i >= 0; i--) {
      const start = startOfWeek(subWeeks(currentWeekStart, i), { weekStartsOn: 1 });
      const end = endOfWeek(start, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start, end });
      const totals = days.reduce(
        (acc, day) => {
          const dayTasks = tasks.filter(
            (task) => task.studentId === studentId && isSameDay(new Date(task.dueDate), day)
          );

          const d = weekDays.find((w) => isSameDay(w.date, day));
          if (d) {
            acc.questions += d.totalQuestions;
            acc.correct += d.totalCorrect;
            acc.hours += d.totalHours;
          } else {
            dayTasks.forEach((t) => {
              acc.questions += t.completedQuestions || 0;
              acc.correct += t.correctAnswers || 0;
              acc.hours += t.hoursStudied || 0;
            });
          }

          // Sum target/assigned questions from tasks for every day
          dayTasks.forEach((t) => {
            acc.target += t.questionCount || 0;
          });

          return acc;
        },
        { questions: 0, correct: 0, hours: 0, target: 0 }
      );

      weeks.push({
        start,
        end,
        label: `${format(start, "d MMM")}-${format(end, "d MMM")}`,
        questions: totals.questions,
        correct: totals.correct,
        target: totals.target,
        hours: Number(totals.hours.toFixed(1)),
      });
    }

    return weeks;
  }, [currentWeekStart, weekDays, tasks, studentId]);

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
      {/* Daily Summary (Today) */}
      
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
              <span className="text-xs">Doğru</span>
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
              <span className="text-xs">Başarı Oranı</span>
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
          <CardTitle>Haftalık Ders Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 border-collapse">
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
                  {/* removed aggregate side columns - totals now in footer per day */}
                </tr>
              </thead>
              <tbody>
                {allSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={tableColSpan} className="p-8 text-center text-muted-foreground">
                      Bu hafta için veri bulunmuyor
                    </td>
                  </tr>
                ) : (
                  allSubjects.map((subject) => {
                    const subjectTotal = weekDays.reduce((sum, day) => {
                      const s = day.subjects.find((s) => s.name === subject);
                      return sum + (s?.questions || 0);
                    }, 0);
                    const subjectCorrect = weekDays.reduce((sum, day) => {
                      const s = day.subjects.find((s) => s.name === subject);
                      return sum + (s?.correct || 0);
                    }, 0);
                    const subjectHours = weekDays.reduce((sum, day) => {
                      const s = day.subjects.find((s) => s.name === subject);
                      return sum + (s?.hours || 0);
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
                                  <div className="font-medium">{s.questions +"/"+ s.correct}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {s.hours.toFixed(1)} saat
                                  </div>
                                  <div> </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          );
                        })}
                        {/* side totals removed - only per-day cells shown for each subject */}
                      </tr>
                    );
                  })
                )}
              </tbody>
              {allSubjects.length > 0 && (
                <tfoot>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3 font-bold">Toplam Soru</td>
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
                    {/* removed weekly aggregate columns */}
                  </tr>

                  <tr className="border-t bg-muted/10">
                    <td className="p-3 font-bold">Çözülen</td>
                    {weekDays.map((day) => (
                      <td
                        key={day.date.toISOString()}
                        className="p-3 text-center"
                      >
                        {day.totalCorrect}
                      </td>
                    ))}
                    {/* removed weekly aggregate columns */}
                  </tr>

                  <tr className="border-t bg-muted/10">
                    <td className="p-3 font-bold">Toplam Saat</td>
                    {weekDays.map((day) => (
                      <td
                        key={day.date.toISOString()}
                        className="p-3 text-center"
                      >
                        {day.totalHours.toFixed(1)}
                      </td>
                    ))}
                    {/* removed weekly aggregate columns */}
                  </tr>

                  <tr className="border-t bg-muted/30">
                    <td className="p-3 font-bold">Başarı %</td>
                    {weekDays.map((day) => (
                      <td
                        key={day.date.toISOString()}
                        className="p-3 text-center font-bold"
                      >
                        {day.totalQuestions > 0 ? Math.round((day.totalCorrect / day.totalQuestions) * 100) : 0}%
                      </td>
                    ))}
                    {/* removed weekly aggregate columns */}
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
          <CardTitle>Haftalar Arasında Karşılaştırma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Hafta</th>
                  <th className="p-3 text-center font-medium">Toplam Hedef Soru</th>
                  <th className="p-3 text-center font-medium">Çözülen Soru</th>
                  <th className="p-3 text-center font-medium">Doğru</th>
                  <th className="p-3 text-center font-medium">Çalışma Saati</th>
                  <th className="p-3 text-center font-medium">Başarı %</th>
                </tr>
              </thead>
              <tbody>
                {comparisonWeeks.map((w) => (
                  <tr key={w.label} className="border-b last:border-b-0">
                    <td className="p-3 font-medium">{w.label}</td>
                    <td className="p-3 text-center">{w.target}</td>
                    <td className="p-3 text-center">{w.questions}</td>
                    <td className="p-3 text-center">{w.correct}</td>
                    <td className="p-3 text-center">{w.hours.toFixed(1)}</td>
                    <td className="p-3 text-center font-bold">
                      {w.questions > 0 ? Math.round((w.correct / w.questions) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
