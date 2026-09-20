"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTodayTasks } from "@/modules/study-tasks/hooks/useStudyTasks";
import { useStudyTimer, useTimerNow } from "@/modules/study-tasks/hooks/useStudyTimer";
import {
  useStudyTimerStore,
  getLiveSeconds,
} from "@/modules/study-tasks/store/study-timer.store";
import { Button } from "@/components/ui/button";
import { Pause, Play, Timer } from "lucide-react";

function formatClock(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function StudyTimerWidget() {
  const { user } = useAuth();
  const { data: todayTasks } = useTodayTasks(user?.id ?? "");
  const tasks = todayTasks ?? [];

  const taskId = useStudyTimerStore((s) => s.taskId);
  const taskLabel = useStudyTimerStore((s) => s.taskLabel);
  const isRunning = useStudyTimerStore((s) => s.isRunning);
  const accumulatedSeconds = useStudyTimerStore((s) => s.accumulatedSeconds);
  const segmentStartedAt = useStudyTimerStore((s) => s.segmentStartedAt);
  const hasHydrated = useStudyTimerStore((s) => s.hasHydrated);

  const { start, pauseAndPersist } = useStudyTimer();
  useTimerNow(isRunning);

  // Görev artık bugünün listesinde yoksa süreölçeri temizle
  useEffect(() => {
    if (!hasHydrated || !taskId) return;
    if (tasks.length > 0 && !tasks.some((t) => t.id === taskId)) {
      useStudyTimerStore.getState().clear();
    }
  }, [tasks, taskId, hasHydrated]);

  if (!hasHydrated || user?.role !== "student" || !taskId) return null;

  const selectedTask = tasks.find((t) => t.id === taskId) ?? null;
  const liveSeconds = getLiveSeconds(
    { accumulatedSeconds, isRunning, segmentStartedAt },
    Date.now()
  );
  // Görevin birikmiş süresinden devam et
  const seconds = (selectedTask?.hoursStudied ?? 0) * 3600 + liveSeconds;

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
      <Timer className="size-4 text-primary" />
      <span className="hidden max-w-[160px] truncate text-xs font-medium sm:inline">
        {taskLabel}
      </span>
      <span className="font-mono text-sm tabular-nums">
        {formatClock(seconds)}
      </span>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={isRunning ? pauseAndPersist : start}
        aria-label={isRunning ? "Duraklat" : "Devam et"}
      >
        {isRunning ? (
          <Pause className="size-3.5" />
        ) : (
          <Play className="size-3.5" />
        )}
      </Button>
    </div>
  );
}
