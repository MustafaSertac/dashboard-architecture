"use client";

import {
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  isToday,
  isTomorrow,
  isPast,
} from "date-fns";
import { tr } from "date-fns/locale";
import { useTasksByRange, useDeleteTask } from "@/modules/study-tasks/hooks/useStudyTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import type { FilterStatus, Task } from "@/lib/types";

interface TaskListProps {
  studentId: string;
  filterStatus: FilterStatus;
  onEditTask: (taskId: string) => void;
}

export function TaskList({ studentId, filterStatus, onEditTask }: TaskListProps) {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  // Bu ayin tam range'ini cek (backend dueDate donmeyebilir ama range query yine de calisir)
  const now = new Date();
  const startDate = format(startOfMonth(now), "yyyy-MM-dd");
  const endDate = format(endOfMonth(now), "yyyy-MM-dd");

  const { data: tasks, isLoading, isError, refetch } = useTasksByRange(
    studentId,
    startDate,
    endDate
  );

  const deleteTask = useDeleteTask(studentId);

  const filteredTasks = (tasks ?? [])
    .filter((task) => {
      if (filterStatus === "completed") return task.status === "completed";
      if (filterStatus === "pending") return task.status !== "completed";
      return true;
    })
    .sort((a, b) => {
      const dateCompare = (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
      if (dateCompare !== 0) return dateCompare;
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      return 0;
    });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const key = task.dueDate ?? "Tarih yok";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const getDateLabel = (dateStr: string) => {
    if (dateStr === "Tarih yok") return "Tarih yok";
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return "Bugun";
      if (isTomorrow(date)) return "Yarin";
      return format(date, "d MMMM EEEE", { locale: tr });
    } catch {
      return dateStr;
    }
  };

  const getDateBadge = (dateStr: string) => {
    if (dateStr === "Tarih yok") return "secondary" as const;
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return "default" as const;
      if (isPast(date)) return "destructive" as const;
      return "secondary" as const;
    } catch {
      return "secondary" as const;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-destructive mb-2">Görevler yuklenemedi</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-primary hover:underline"
          >
            Tekrar dene
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.keys(groupedTasks).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Görev bulunamadi.</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedTasks).map(([date, dateTasks]) => (
          <Card key={date}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  {getDateLabel(date)}
                </CardTitle>
                <Badge variant={getDateBadge(date)}>
                  {dateTasks.length} görev
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dateTasks.map((task) => {
                const progress =
                  task.questionCount > 0
                    ? (task.completedQuestions / task.questionCount) * 100
                    : 0;

                return (
                  <div
                    key={task.id}
                    className={cn(
                      "flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between",
                      task.status === "completed" && "bg-green-500/5 border-green-500/20"
                    )}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {task.status === "completed" ? (
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                      ) : (
                        <Clock className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{task.subject}</span>
                          <Badge variant="outline" className="text-xs">
                            {task.topic}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {task.completedQuestions}/{task.questionCount} soru
                          </span>
                          {task.status === "completed" && (
                            <>
                              <span>D: {task.correctAnswers}</span>
                              <span>Y: {task.wrongAnswers}</span>
                              <span>{task.hoursStudied}s</span>
                            </>
                          )}
                        </div>
                        <Progress value={progress} className="mt-2 h-1.5" />
                      </div>
                    </div>

                    {isTeacher && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Islemler</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditTask(task.id)}>
                            <Pencil className="mr-2 size-4" />
                            Duzenle
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 size-4" />
                                Sil
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Gorevi Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu gorevi silmek istediginize emin misiniz? Bu
                                  islem geri alinamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Iptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteTask.mutate({ taskId: task.id })}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
