"use client";

import { useApp } from "@/lib/context";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { UpcomingTasksCard } from "@/components/dashboard/upcoming-tasks-card";
import { QuickStatsCard } from "@/components/dashboard/quick-stats-card";
import { RecentExamsCard } from "@/components/dashboard/recent-exams-card";
import { WeeklyProgressCard } from "@/components/dashboard/weekly-progress-card";
import { StudyTimerCard } from "@/components/dashboard/study-timer-card";
import { ExamNetTrendCard } from "@/components/dashboard/exam-net-trend-card";

export default function DashboardPage() {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hoşgeldin, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Bugünün özeti ve yaklaşan görevleri
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <QuickStatsCard />
      </div>

      {/* Timer Section - Full width horizontal card */}
      <StudyTimerCard dailyGoalHours={6} />

      {/* Tasks Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TodayTasksCard />
        <UpcomingTasksCard />
      </div>

      {/* Progress & Exams Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyProgressCard />
        <RecentExamsCard />
      </div>

      <ExamNetTrendCard />
    </div>
  );
}
