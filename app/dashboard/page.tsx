"use client";

import { useApp } from "@/lib/context";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { UpcomingTasksCard } from "@/components/dashboard/upcoming-tasks-card";
import { QuickStatsCard } from "@/components/dashboard/quick-stats-card";
import { RecentExamsCard } from "@/components/dashboard/recent-exams-card";
import { WeeklyProgressCard } from "@/components/dashboard/weekly-progress-card";
import { StudyTimerCard } from "@/components/dashboard/study-timer-card";

export default function DashboardPage() {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hosgeldin, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Bugunun ozeti ve yaklasan gorevlerin
        </p>
      </div>

      {/* Top Section: Stats + Timer */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Stats Cards - 4 columns on large screens */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
          <QuickStatsCard />
        </div>
        {/* Timer Card - 1 column on large screens, spans full row on smaller */}
        <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
          <StudyTimerCard dailyGoalHours={6} />
        </div>
      </div>

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
    </div>
  );
}
