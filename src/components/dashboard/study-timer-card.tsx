"use client";

import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useStudyTimer,
  useTimerNow,
} from "@/modules/study-tasks/hooks/useStudyTimer";
import {
  useStudyTimerStore,
  getLiveSeconds,
} from "@/modules/study-tasks/store/study-timer.store";
import type { Task } from "@/lib/types";

import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Flame,
  Target,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface StudyTimerCardProps {
  dailyGoalHours?: number;
  tasks?: Task[];
}

export function StudyTimerCard({
  dailyGoalHours = 6,
  tasks,
}: StudyTimerCardProps) {
  const [addMinutes, setAddMinutes] = useState("15");

  const taskList = tasks ?? [];
  const hasTasks = taskList.length > 0;

  const taskId = useStudyTimerStore((s) => s.taskId);
  const isRunning = useStudyTimerStore((s) => s.isRunning);
  const accumulatedSeconds = useStudyTimerStore((s) => s.accumulatedSeconds);
  const segmentStartedAt = useStudyTimerStore((s) => s.segmentStartedAt);

  const selectedTask = taskList.find((t) => t.id === taskId) ?? null;

  const { start, pauseAndPersist, addAndPersist } = useStudyTimer();
  useTimerNow(isRunning);

  // Görev listesi değişince geçerli seçimi garanti et
  useEffect(() => {
    const list = tasks ?? [];
    if (list.length === 0) {
      if (useStudyTimerStore.getState().taskId) {
        useStudyTimerStore.getState().clear();
      }
      return;
    }
    if (!taskId || !list.some((t) => t.id === taskId)) {
      const first = list[0];
      useStudyTimerStore
        .getState()
        .selectTask(first.id, `${first.subject} - ${first.topic}`);
    }
  }, [tasks, taskId]);

  const liveSeconds = getLiveSeconds(
    { accumulatedSeconds, isRunning, segmentStartedAt },
    Date.now()
  );

  // Büyük sayaç: seçili görevin birikmiş süresi
  const selectedTaskSeconds =
    (selectedTask?.hoursStudied ?? 0) * 3600 + liveSeconds;

  // Günlük ilerleme: o günün TÜM görevlerinin toplam hedef ve kayıtlı saatleri
  const dailyTargetSeconds = taskList.reduce(
    (sum, t) => sum + (t.targetHours ?? 0) * 3600,
    0
  );
  const dailyStudiedSeconds =
    taskList.reduce((sum, t) => sum + (t.hoursStudied ?? 0) * 3600, 0) +
    liveSeconds;

  // Hedef girilmemişse sabit günlük hedefe düş
  const effectiveGoalSeconds =
    dailyTargetSeconds > 0 ? dailyTargetSeconds : dailyGoalHours * 3600;

  const remainingSeconds = Math.max(
    0,
    effectiveGoalSeconds - dailyStudiedSeconds
  );

  const progressPercentage = Math.min(
    (dailyStudiedSeconds / effectiveGoalSeconds) * 100,
    100
  );

  /* ========================================= */
  /* HELPERS */
  /* ========================================= */

  const getTimeParts = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");

    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");

    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return { h, m, s };
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);

    const m = Math.floor(
      (seconds % 3600) / 60
    );

    return `${h}s ${m}dk`;
  };

  const getMessage = () => {
    if (!taskId) {
      return hasTasks
        ? "Süreölçer için bir görev seçin"
        : "Önce bir görev oluşturmalısın";
    }

    if (progressPercentage >= 100) {
      return "Tebrikler! Günlük hedef tamamlandı 🚀";
    }

    if (progressPercentage >= 75) {
      return "Çok az kaldı, devam et 🔥";
    }

    if (progressPercentage >= 50) {
      return "Harika ilerliyorsun ✨";
    }

    if (isRunning) {
      return "Odak modundasın 🎯";
    }

    return "Yeni çalışma seansına başla";
  };

  /* ========================================= */
  /* ACTIONS */
  /* ========================================= */

  const handlePlayPause = () => {
    if (isRunning) {
      pauseAndPersist();
    } else {
      start();
    }
  };

  // Sıfırla: çalışıyorsa durdurur ve geçen süreyi göreve kaydeder
  const handleReset = () => {
    pauseAndPersist();
  };

  const handleAddTime = () => {
    const value = parseInt(addMinutes || "0");

    if (value > 0) {
      addAndPersist(value * 60);
    }
  };

  const handleRemoveTime = () => {
    const value = parseInt(addMinutes || "0");

    if (value > 0) {
      useStudyTimerStore.getState().addSeconds(-value * 60);
    }
  };

  /* ========================================= */
  /* TIMER SVG */
  /* ========================================= */

  const { h, m, s } =
    getTimeParts(selectedTaskSeconds);

  const size = 190;

  const strokeWidth = 10;

  const radius =
    (size - strokeWidth) / 2;

  const circumference =
    radius * 2 * Math.PI;

  const dashOffset =
    circumference -
    (progressPercentage / 100) *
      circumference;

  return (
    <Card
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-border/90
        shadow-[var(--timer-shadow)]
        backdrop-blur-xl
      "
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "var(--timer-glow)",
        }}
      />

      <CardContent className="relative p-6">
        {!hasTasks && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="size-5 shrink-0" />
              <span className="font-medium">
                Önce bir görev oluşturmalısın
              </span>
            </div>
            <Button asChild size="sm">
              <a href="/dashboard/tasks">
                <Plus className="mr-1 size-4" />
                Görev Oluştur
              </a>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr_1fr] gap-8 items-center">
          {/* ========================================= */}
          {/* LEFT */}
          {/* ========================================= */}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className={cn(
                  "size-2 rounded-full transition-all",
                  isRunning
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-muted-foreground/40"
                )}
              />

              <h2 className="text-xl font-semibold text-foreground">
              Süreölçer
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Disiplin, başarıyı getirir.
            </p>

            {hasTasks && (
              <div className="mb-5 rounded-2xl border border-border/60 bg-timer-card-secondary/70 p-4 backdrop-blur-xl">
                <p className="text-xs text-muted-foreground">Seçili Görev</p>
                {selectedTask ? (
                  <>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {selectedTask.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTask.topic}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    Görev seçilmedi
                  </p>
                )}

                {taskList.length > 1 && (
                  <Select
                    value={taskId ?? undefined}
                    onValueChange={(v) => {
                      const task = taskList.find((t) => t.id === v);
                      if (task) {
                        useStudyTimerStore
                          .getState()
                          .selectTask(task.id, `${task.subject} - ${task.topic}`);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-3 h-8 bg-background/60">
                      <SelectValue placeholder="Görev seç" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskList.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.subject} - {task.topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* STATS */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {/* GOAL */}
              <div
                className="
                  rounded-2xl
                  border
                  border-border/60
                  bg-timer-card-secondary/70
                  backdrop-blur-xl
                  p-4
                "
              >
                <Target className="size-4 text-primary mb-2" />

                <p className="text-xs text-muted-foreground">
                  Günlük Hedef
                </p>

                <h4 className="text-foreground font-semibold mt-1">
                  {formatDuration(effectiveGoalSeconds)}
                </h4>
              </div>

              {/* COMPLETED */}
              <div
                className="
                  rounded-2xl
                  border
                  border-border/60
                  bg-timer-card-secondary/70
                  backdrop-blur-xl
                  p-4
                "
              >
                <CheckCircle2 className="size-4 text-green-500 mb-2" />

                <p className="text-xs text-muted-foreground">
                  Tamamlanan
                </p>

                <h4 className="text-foreground font-semibold mt-1">
                  {formatDuration(
                    dailyStudiedSeconds
                  )}
                </h4>
              </div>

              {/* REMAINING */}
              <div
                className="
                  rounded-2xl
                  border
                  border-border/60
                  bg-timer-card-secondary/70
                  backdrop-blur-xl
                  p-4
                "
              >
                <Clock3 className="size-4 text-orange-500 mb-2" />

                <p className="text-xs text-muted-foreground">
                  Kalan
                </p>

                <h4 className="text-foreground font-semibold mt-1">
                  {formatDuration(
                    remainingSeconds
                  )}
                </h4>
              </div>
            </div>

            {/* MANUAL ADD REMOVE */}
            <div
              className="
                rounded-2xl
                border
                border-border/60
                bg-timer-card-secondary/60
                backdrop-blur-xl
                p-4
              "
            >
              <div className="flex items-center gap-2 mb-3">
                <Plus className="size-4 text-primary" />

                <p className="text-sm text-foreground font-medium">
                  Manuel Süre Yönetimi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={addMinutes}
                  onChange={(e) =>
                    setAddMinutes(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 3)
                    )
                  }
                  placeholder="Dakika"
                  className="
                    bg-background/60
                    border-border
                    text-foreground
                    placeholder:text-muted-foreground
                  "
                />

                {/* ADD */}
                <Button
                  onClick={handleAddTime}
                  className="
                    bg-primary
                    hover:bg-primary/90
                    text-primary-foreground
                    font-semibold
                  "
                >
                  <Plus className="size-4 mr-1" />
                  Ekle
                </Button>

                {/* REMOVE */}
                <Button
                  variant="outline"
                  onClick={
                    handleRemoveTime
                  }
                  className="
                    border-red-500/30
                    bg-red-500/10
                    hover:bg-red-500/20
                    text-red-500
                    font-semibold
                  "
                >
                  <Minus className="size-4 mr-1" />
                  Çıkar
                </Button>
              </div>

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground">
                  Süreyi manuel olarak
                  ekleyebilir veya
                  çıkarabilirsin.
                </p>

                <span className="text-xs text-primary font-medium">
                  {addMinutes || 0} dk
                </span>
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* CENTER */}
          {/* ========================================= */}

          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <svg
                width={size}
                height={size}
                className="-rotate-90"
              >
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="oklch(0.75 0.18 190)"
                    />

                    <stop
                      offset="50%"
                      stopColor="oklch(0.7 0.2 250)"
                    />

                    <stop
                      offset="100%"
                      stopColor="oklch(0.72 0.22 310)"
                    />
                  </linearGradient>

                  <filter id="glow">
                    <feGaussianBlur
                      stdDeviation="4"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* BG */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="var(--timer-ring-bg)"
                  strokeWidth={
                    strokeWidth
                  }
                  fill="none"
                />

                {/* PROGRESS */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="url(#progressGradient)"
                  strokeWidth={
                    strokeWidth
                  }
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={
                    circumference
                  }
                  strokeDashoffset={
                    dashOffset
                  }
                  filter={
                    isRunning
                      ? "url(#glow)"
                      : ""
                  }
                  className="transition-all duration-500"
                />
              </svg>

              {/* TIMER */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 mb-2">
                  <div
                    className={cn(
                      "size-2 rounded-full",
                      isRunning
                        ? "bg-green-500 animate-pulse"
                        : "bg-muted-foreground/40"
                    )}
                  />

                  <span className="text-xs text-muted-foreground">
                    {isRunning
                      ? "Çalışıyor"
                      : "Durduruldu"}
                  </span>
                </div>

                <div
                  className="
                    text-4xl
                    font-bold
                    text-foreground
                    tracking-tight
                    font-mono
                    tabular-nums
                  "
                >
                  {h}:{m}:{s}
                </div>

                <div
                  className="
                    flex
                    gap-3
                    mt-2
                    text-[10px]
                    uppercase
                    text-muted-foreground
                  "
                >
                  <span>Saat</span>
                  <span>Dakika</span>
                  <span>Saniye</span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm text-muted-foreground text-center">
              {getMessage()}
            </p>
          </div>

          {/* ========================================= */}
          {/* RIGHT */}
          {/* ========================================= */}

          <div className="flex flex-col justify-center">
            {/* CONTROLS */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                aria-label="Sıfırla"
                className="
                  size-12
                  rounded-full
                  border-border/60
                  bg-timer-card-secondary/60
                  hover:bg-accent
                  text-foreground
                "
              >
                <RotateCcw className="size-5" />
              </Button>

          <Button
  size="icon"
  onClick={handlePlayPause}
  disabled={!taskId}
  aria-label={isRunning ? "Duraklat" : "Başlat"}
  className={cn(
    "size-16 rounded-full shadow-2xl transition-all",
    isRunning
      ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
      : "bg-primary hover:bg-primary/90 shadow-primary/30",
    !taskId && "opacity-50 cursor-not-allowed"
  )}
>
  {isRunning ? (
    <Pause className="size-7" />
  ) : (
    <Play className="size-7 ml-1" />
  )}
</Button>
            </div>

            {/* PROGRESS */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Günlük İlerleme
                </span>

                <span className="text-primary font-semibold">
                  %
                  {progressPercentage.toFixed(
                    0
                  )}
                </span>
              </div>

              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="
                    h-full
                    rounded-full
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${progressPercentage}%`,
                    background:
                      "var(--timer-progress-gradient)",
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>
                  {formatDuration(
                    dailyStudiedSeconds
                  )}
                </span>

                <span>
                  {formatDuration(effectiveGoalSeconds)} hedef
                </span>
              </div>
            </div>

            {/* STREAK */}
            <div
              className="
                rounded-3xl
                border
                border-orange-500/20
                bg-orange-500/10
                p-5
                text-center
                backdrop-blur-md
              "
            >
              <Flame className="size-7 text-orange-500 mx-auto mb-2" />

              <div className="text-3xl font-bold text-foreground">
                7
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                Günlük Seri
              </p>

              <p className="text-xs text-muted-foreground mt-2">
                İstikrar başarıyı
                getirir.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}