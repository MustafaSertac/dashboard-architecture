"use client";

import { useState } from "react";
import { format, addDays, subDays, startOfDay, isSameDay } from "date-fns";
import { tr } from "date-fns/locale";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Target,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyTask {
  id: string;
  subject: string;
  topic: string;
  targetQuestions: number;
  completedQuestions: number;
  hoursStudied: number;
  isCompleted: boolean;
}

interface DailyTasksViewProps {
  studentId: string;
  role?: "student" | "teacher";
}

export function DailyTasksView({ studentId, role = "student" }: DailyTasksViewProps) {
  const isTeacher = role === "teacher";
  const { tasks, updateTask } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{
    completedQuestions: number;
    hoursStudied: number;
  }>({ completedQuestions: 0, hoursStudied: 0 });

  const studentTasks = tasks.filter(
    (task) =>
      task.studentId === studentId &&
      isSameDay(new Date(task.dueDate), selectedDate)
  );

  const dailyTasks: DailyTask[] = studentTasks.map((task) => ({
    id: task.id,
    subject: task.subject,
    topic: task.topic,
    targetQuestions: task.questionCount,
    completedQuestions: task.completedQuestions || 0,
    hoursStudied: task.hoursStudied || 0,
    isCompleted: task.status === "completed",
  }));

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  const handleStartEdit = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setTempValues({
      completedQuestions: task.completedQuestions,
      hoursStudied: task.hoursStudied,
    });
  };

  const handleSaveEdit = (taskId: string, targetQuestions: number) => {
    const isCompleted = tempValues.completedQuestions >= targetQuestions;
    updateTask(taskId, {
      completedQuestions: tempValues.completedQuestions,
      hoursStudied: tempValues.hoursStudied,
      status: isCompleted ? "completed" : "pending",
    });
    setEditingTaskId(null);
  };

  const handleToggleComplete = (task: DailyTask) => {
    const newStatus = task.isCompleted ? "pending" : "completed";
    updateTask(task.id, {
      status: newStatus,
      completedQuestions: newStatus === "completed" ? task.targetQuestions : task.completedQuestions,
    });
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
            {!isSameDay(selectedDate, new Date()) && (
              <Button variant="link" size="sm" onClick={handleToday} className="h-auto p-0">
                Bugune Don
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
              <span className="text-xs">Cozulen</span>
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
        {dailyTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <BookOpen className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                Bu gun icin gorev bulunmuyor
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
                            Cozulen Soru
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
                            Calisma Saati
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
                            onClick={() => handleSaveEdit(task.id, task.targetQuestions)}
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
                          <span>Cozulen: {task.completedQuestions}</span>
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
                          Guncelle
                        </Button>
                        {isTeacher && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-success border-success/50 hover:bg-success/10"
                            onClick={() => handleToggleComplete(task)}
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
