"use client";

import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isAfter } from "date-fns";
import { tr } from "date-fns/locale";

export function UpcomingTasksCard() {
  const { tasks, currentUser } = useApp();
  const today = new Date().toISOString().split("T")[0];
  
  const upcomingTasks = tasks
    .filter((task) => {
      // guard: ensure we have a logged-in user and a valid date string
      if (!currentUser?.id) return false;
      if (!task?.dueDate   || typeof task.dueDate !== "string") return false;
      try {
        return (
          task.studentId === currentUser.id &&
          isAfter(parseISO(task.dueDate), parseISO(today))
        );
      } catch (e) {
        return false;
      }
    })
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
    .slice(0, 5);

  // Group tasks by date
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
