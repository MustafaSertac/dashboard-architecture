"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
} from "lucide-react";

import { cn } from "@/lib/utils";

interface StudyTimerCardProps {
  dailyGoalHours?: number;
}

export function StudyTimerCard({
  dailyGoalHours = 6,
}: StudyTimerCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  const [todayStudiedSeconds, setTodayStudiedSeconds] =
    useState(0);

  const [addMinutes, setAddMinutes] = useState("15");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const dailyGoalSeconds = dailyGoalHours * 3600;

  const totalStudiedSeconds =
    todayStudiedSeconds + elapsedSeconds;

  const remainingSeconds = Math.max(
    0,
    dailyGoalSeconds - totalStudiedSeconds
  );

  const progressPercentage = Math.min(
    (totalStudiedSeconds / dailyGoalSeconds) * 100,
    100
  );

  /* ========================================= */
  /* LOAD STORAGE */
  /* ========================================= */

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const saved =
      localStorage.getItem("studyTimerData");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.date === today) {
        setTodayStudiedSeconds(
          parsed.studiedSeconds || 0
        );

        setElapsedSeconds(
          parsed.currentElapsed || 0
        );
      }
    }
  }, []);

  /* ========================================= */
  /* SAVE STORAGE */
  /* ========================================= */

  const saveState = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];

    localStorage.setItem(
      "studyTimerData",
      JSON.stringify({
        date: today,
        studiedSeconds: todayStudiedSeconds,
        currentElapsed: elapsedSeconds,
      })
    );
  }, [todayStudiedSeconds, elapsedSeconds]);

  useEffect(() => {
    saveState();
  }, [elapsedSeconds, saveState]);

  /* ========================================= */
  /* TIMER */
  /* ========================================= */

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

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

    const s = (seconds % 60)
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
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);

    if (elapsedSeconds > 0) {
      const updated =
        todayStudiedSeconds +
        elapsedSeconds;

      setTodayStudiedSeconds(updated);

      const today = new Date()
        .toISOString()
        .split("T")[0];

      localStorage.setItem(
        "studyTimerData",
        JSON.stringify({
          date: today,
          studiedSeconds: updated,
          currentElapsed: 0,
        })
      );
    }

    setElapsedSeconds(0);
  };

  const handleAddTime = () => {
    const value = parseInt(addMinutes || "0");

    if (value > 0) {
      setElapsedSeconds(
        (prev) => prev + value * 60
      );
    }
  };

  const handleRemoveTime = () => {
    const value = parseInt(addMinutes || "0");

    if (value > 0) {
      setElapsedSeconds((prev) =>
        Math.max(0, prev - value * 60)
      );
    }
  };

  /* ========================================= */
  /* TIMER SVG */
  /* ========================================= */

  const { h, m, s } =
    getTimeParts(elapsedSeconds);

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

            <p className="text-sm text-muted-foreground mb-6">
              Disiplin, başarıyı getirir.
            </p>

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
                  {dailyGoalHours} Saat
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
                    totalStudiedSeconds
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
  className={cn(
    "size-16 rounded-full shadow-2xl transition-all",
    isRunning
      ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
      : "bg-primary hover:bg-primary/90 shadow-primary/30"
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
                    totalStudiedSeconds
                  )}
                </span>

                <span>
                  {dailyGoalHours}
                  s hedef
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