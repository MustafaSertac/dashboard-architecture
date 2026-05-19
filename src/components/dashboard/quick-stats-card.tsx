"use client";

import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";

export function QuickStatsCard() {
  const { tasks, examResults, currentUser } = useApp();
  
  const studentTasks = tasks.filter((t) => t.studentId === currentUser.id);
  const studentExams = examResults.filter((e) => e.studentId === currentUser.id);

  const totalSolved = studentTasks.reduce((sum, t) => sum + t.completedQuestions, 0);
  const completedTasks = studentTasks.filter((t) => t.status === "completed").length;
  const pendingTasks = studentTasks.filter((t) => t.status !== "completed").length;
  const latestNet = studentExams.length > 0 
    ? studentExams.sort((a, b) => b.date.localeCompare(a.date))[0].totalEmpty 
    : 0;

  const stats = [
    {
      title: "Toplam Soru",
      value: totalSolved.toLocaleString(),
      icon: BookOpen,
      color: "text-primary",
    },
    {
      title: "Tamamlanan",
      value: completedTasks.toString(),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Bekleyen",
      value: pendingTasks.toString(),
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Son Net",
      value: latestNet.toFixed(1),
      icon: TrendingUp,
      color: "text-info",
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`size-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
