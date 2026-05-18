"use client";

import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TodayTasksCard() {
  const { tasks, currentUser } = useApp();
  const today = new Date().toISOString().split("T")[0];
  
  const todayTasks = tasks.filter(
    (task) => task.date === today && task.studentId === currentUser.id
  );

  const totalQuestions = todayTasks.reduce((sum, t) => sum + t.questionCount, 0);
  const solvedQuestions = todayTasks.reduce((sum, t) => sum + t.solvedCount, 0);
  const progress = totalQuestions > 0 ? (solvedQuestions / totalQuestions) * 100 : 0;
  const belowMinimum = solvedQuestions < 50;

  return (
    <Card className={cn(
      belowMinimum && todayTasks.length > 0 && "border-warning/50 bg-warning/5"
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Bugunun Gorevleri</CardTitle>
        {belowMinimum && todayTasks.length > 0 && (
          <Badge variant="outline" className="border-warning text-warning">
            <AlertCircle className="mr-1 size-3" />
            Minimum altinda
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {todayTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Bugun icin gorev yok.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ilerleme</span>
              <span className="font-medium">{solvedQuestions} / {totalQuestions} soru</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    {task.status === "completed" ? (
                      <CheckCircle2 className="size-5 text-green-500" />
                    ) : (
                      <Clock className="size-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{task.subject}</p>
                      <p className="text-xs text-muted-foreground">{task.topic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {task.solvedCount}/{task.questionCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      D: {task.correctCount} Y: {task.wrongCount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
