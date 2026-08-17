"use client";

import { useAuth } from "@/lib/auth-context";
import { useUpcomingTasks } from "@/modules/study-tasks/hooks/useStudyTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

export function UpcomingTasksCard() {
  const { user } = useAuth();
  const { data: tasks, isLoading, isError, refetch } = useUpcomingTasks(user?.id ?? "");

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Eksik Görevler</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-destructive mb-2">Yaklasan görevler yuklenemedi</p>
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

  const upcomingTasks = (tasks ?? []).slice(0, 5);

  // BACKEND EKSIK #1 (Kritik): dueDate backend'den donmuyor; fallback olarak
  // bugunun tarihi ataniyor. Bu nedenle gruplama duzgun calismayabilir.
  // Backend #1 tamamlaninca burada ek degisiklik gerekmez.
  const groupedTasks = upcomingTasks.reduce((acc, task) => {
    if (!acc[task.dueDate]) {
      acc[task.dueDate] = [];
    }
    acc[task.dueDate].push(task);
    return acc;
  }, {} as Record<string, typeof upcomingTasks>);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Eksik Görevler</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tamamlanmayan görev yok.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTasks).map(([date, dateTasks]) => (
              <div key={date}>
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {format(parseISO(date), "d MMMM EEEE", { locale: tr })}
                </p>
                <div className="space-y-2">
                  {dateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{task.subject}</p>
                        <p className="text-xs text-muted-foreground">{task.topic}</p>
                      </div>
                      <Badge variant="secondary">{task.questionCount} soru</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
