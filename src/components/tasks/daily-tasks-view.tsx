"use client";

import { useState } from "react";
import { format, addDays, subDays, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import { useTasksByRange, useCompleteTask, useLogStudy } from "@/modules/study-tasks/hooks/useStudyTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Clock, BookOpen, Target, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyTasksViewProps {
  studentId: string;
  role?: "student" | "teacher";
}

export function DailyTasksView({ studentId, role = "student" }: DailyTasksViewProps) {
  const isTeacher = role === "teacher";
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{
    completedQuestions: number;
    hoursStudied: number;
  }>({ completedQuestions: 0, hoursStudied: 0 });

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const { data: tasks, isLoading, isError, refetch } = useTasksByRange(
    studentId,
    dateStr,
    dateStr
  );

  const completeTask = useCompleteTask(studentId);
  const logStudy = useLogStudy(studentId);
  const dailyTasks = (tasks ?? []).map((task) => ({
    id: task.id,
    subject: task.subject,
    topic: task.topic,
    targetQuestions: task.questionCount,
    completedQuestions: task.completedQuestions || 0,
    hoursStudied: task.hoursStudied || 0,
    isCompleted: task.status === "completed",
    correctAnswers: task.correctAnswers,
    wrongAnswers: task.wrongAnswers,
  }));

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  const handleStartEdit = (task: typeof dailyTasks[number]) => {
    setEditingTaskId(task.id);
    setTempValues({
      completedQuestions: task.completedQuestions,
      hoursStudied: task.hoursStudied,
    });
  };

  const handleSaveEdit = (taskId: string) => {
    // Inline edit: kullanici cozulen soru sayisi + calisma saati girer.
    // Backend logStudy endpoint'i hours + dogru/yanlis/bos bekler ve
    // isCompleted hedefi kendisi hesaplar.
    logStudy.mutate({
      taskId,
      hours: tempValues.hoursStudied,
      correctCount: tempValues.completedQuestions,
      wrongCount: 0,
      emptyCount: 0,
    });
    setEditingTaskId(null);
  };

  const handleToggleComplete = (task: typeof dailyTasks[number]) => {
    completeTask.mutate({ taskId: task.id });
  };

  const totalTarget = dailyTasks.reduce((sum, t) => sum + t.targetQuestions, 0);
  const totalCompleted = dailyTasks.reduce((sum, t) => sum + t.completedQuestions, 0);
  const totalHours = dailyTasks.reduce((sum, t) => sum + t.hoursStudied, 0);
  const completedCount = dailyTasks.filter((t) => t.isCompleted).length;

  return (
    <div className="space-y-4">
      {/* Date Navigation */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <Button variant="outline" size="icon" onClick={handlePrevDay}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-semibold">
              {format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })}
            </span>
            {!isToday(selectedDate) && (
              <Button variant="link" size="sm" onClick={handleToday} className="h-auto p-0">
                Bugüne Dön
              </Button>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="size-4" />
              <span className="text-xs">Hedef</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalTarget}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="size-4" />
              <span className="text-xs">Çözülen</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              <span className="text-xs">Saat</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalHours.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="size-4" />
              <span className="text-xs">Tamamlanan</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {completedCount}/{dailyTasks.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : isError ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-destructive mb-2">Görevler yuklenemedi</p>
              <button
                onClick={() => refetch()}
                className="text-sm text-primary hover:underline"
              >
                Tekrar dene
              </button>
            </CardContent>
          </Card>
        ) : dailyTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <BookOpen className="size-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-4">
                Bugün için görev bulunmuyor
              </p>
            </CardContent>
          </Card>
        ) : (
          dailyTasks.map((task) => (
            <Card
              key={task.id}
              className={cn(
                "transition-colors",
                task.isCompleted && "bg-success/10 border-success/30"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => handleToggleComplete(task)}
                    className="mt-1"
                    disabled={completeTask.isPending}
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{task.subject}</h3>
                        <p className="text-sm text-muted-foreground">{task.topic}</p>
                      </div>
                      <Badge variant={task.isCompleted ? "default" : "secondary"}>
                        {task.isCompleted ? "Tamamlandi" : "Bekliyor"}
                      </Badge>
                    </div>

                    {editingTaskId === task.id ? (
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">
                            Çözülen Soru
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={tempValues.completedQuestions}
                            onChange={(e) =>
                              setTempValues((prev) => ({
                                ...prev,
                                completedQuestions: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="h-8 w-24"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">
                            Çalışma Saati
                          </label>
                          <Input
                            type="number"
                            min={0}
                            step={0.5}
                            value={tempValues.hoursStudied}
                            onChange={(e) =>
                              setTempValues((prev) => ({
                                ...prev,
                                hoursStudied: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="h-8 w-24"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(task.id)}
                            disabled={logStudy.isPending}
                          >
                            Kaydet
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTaskId(null)}
                          >
                            Iptal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Target className="size-4 text-muted-foreground" />
                          <span>Hedef: {task.targetQuestions}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <BookOpen className="size-4 text-muted-foreground" />
                          <span>Çözülen: {task.completedQuestions}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="size-4 text-muted-foreground" />
                          <span>Saat: {task.hoursStudied}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(task)}
                        >
                          Güncelle
                        </Button>
                        {isTeacher && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-success border-success/50 hover:bg-success/10"
                            onClick={() => handleToggleComplete(task)}
                            disabled={completeTask.isPending}
                          >
                            {task.isCompleted ? "Iptal Et" : "Onayla"}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
