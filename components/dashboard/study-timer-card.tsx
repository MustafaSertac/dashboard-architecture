"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Target, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyTimerCardProps {
  dailyGoalHours?: number;
}

export function StudyTimerCard({ dailyGoalHours = 6 }: StudyTimerCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [todayStudiedSeconds, setTodayStudiedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert daily goal to seconds
  const dailyGoalSeconds = dailyGoalHours * 60 * 60;

  // Calculate total studied time (previous + current session)
  const totalStudiedSeconds = todayStudiedSeconds + elapsedSeconds;

  // Calculate progress percentage
  const progressPercentage = Math.min(
    (totalStudiedSeconds / dailyGoalSeconds) * 100,
    100
  );

  // Calculate remaining time
  const remainingSeconds = Math.max(dailyGoalSeconds - totalStudiedSeconds, 0);

  // Load saved study time from localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedData = localStorage.getItem("studyTimerData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.date === today) {
        setTodayStudiedSeconds(parsed.studiedSeconds || 0);
      } else {
        // Reset for new day
        localStorage.setItem(
          "studyTimerData",
          JSON.stringify({ date: today, studiedSeconds: 0 })
        );
      }
    }
  }, []);

  // Save study time to localStorage when session ends
  const saveStudyTime = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const newTotal = todayStudiedSeconds + elapsedSeconds;
    localStorage.setItem(
      "studyTimerData",
      JSON.stringify({ date: today, studiedSeconds: newTotal })
    );
    setTodayStudiedSeconds(newTotal);
    setElapsedSeconds(0);
  }, [todayStudiedSeconds, elapsedSeconds]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Format time as HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Format time as readable string
  const formatTimeReadable = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}s ${minutes}d`;
    }
    return `${minutes}d`;
  };

  const handlePlayPause = () => {
    if (isRunning) {
      // Pausing - save current session
      saveStudyTime();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Motivational messages based on progress
  const getMotivationalMessage = () => {
    if (progressPercentage >= 100) return "Harika! Gunluk hedefini tamamladin!";
    if (progressPercentage >= 75) return "Cok iyi gidiyorsun, az kaldi!";
    if (progressPercentage >= 50) return "Yarisina geldin, devam et!";
    if (progressPercentage >= 25) return "Guzel baslangic, boyle devam!";
    if (isRunning) return "Odaklan ve basariya ulan!";
    return "Calisma seansina basla!";
  };

  // SVG circle parameters
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isRunning && "ring-2 ring-primary/20"
      )}
    >
      {/* Subtle glow effect when running */}
      {isRunning && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      )}

      <CardContent className="p-4 md:p-6">
        {/* Horizontal layout */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          {/* Left: Title + Timer Ring + Controls */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Timer Ring */}
            <div className="relative shrink-0">
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={cn(
                    "transition-all duration-500 ease-out",
                    isRunning && "drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                  )}
                />
              </svg>
              {/* Timer text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={cn(
                    "font-mono text-lg font-bold tracking-tight",
                    isRunning && "text-primary"
                  )}
                >
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* Title + Session info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-primary" />
                <span className="font-semibold">Calisma Zamanlayici</span>
                {progressPercentage >= 100 && (
                  <Flame className="size-4 text-warning animate-pulse" />
                )}
              </div>
              <p className="text-sm text-muted-foreground italic">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>

          {/* Center: Control Buttons */}
          <div className="flex items-center gap-3 md:ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={elapsedSeconds === 0 && !isRunning}
              className="size-10 rounded-full transition-transform hover:scale-105"
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              size="icon"
              onClick={handlePlayPause}
              className={cn(
                "size-12 rounded-full transition-all duration-200 hover:scale-105",
                isRunning
                  ? "bg-warning hover:bg-warning/90 text-warning-foreground"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {isRunning ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5 ml-0.5" />
              )}
            </Button>
          </div>

          {/* Right: Progress Stats */}
          <div className="flex items-center gap-6 md:gap-8 rounded-lg bg-muted/50 px-4 py-3 md:ml-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Hedef</span>
              <span className="font-semibold">{dailyGoalHours}s</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Tamamlanan</span>
              <span className="font-semibold text-primary">
                {formatTimeReadable(totalStudiedSeconds)}
              </span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Kalan</span>
              <span className="font-semibold">
                {formatTimeReadable(remainingSeconds)}
              </span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Ilerleme</span>
              <span
                className={cn(
                  "font-semibold",
                  progressPercentage >= 100 ? "text-success" : "text-foreground"
                )}
              >
                %{progressPercentage.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
