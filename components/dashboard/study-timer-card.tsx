"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyTimerCardProps {
  dailyGoalHours?: number;
}

export function StudyTimerCard({ dailyGoalHours = 6 }: StudyTimerCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [todayStudiedSeconds, setTodayStudiedSeconds] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editHours, setEditHours] = useState("00");
  const [editMinutes, setEditMinutes] = useState("00");
  const [editSeconds, setEditSeconds] = useState("00");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert daily goal to seconds
  const dailyGoalSeconds = dailyGoalHours * 60 * 60;

  // Calculate total studied time (previous + current session)
  const totalStudiedSeconds = todayStudiedSeconds + elapsedSeconds;

  // Calculate progress percentage for the arc
  const progressPercentage = Math.min(
    (totalStudiedSeconds / dailyGoalSeconds) * 100,
    100
  );

  // Load saved study time from localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedData = localStorage.getItem("studyTimerData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.date === today) {
        setTodayStudiedSeconds(parsed.studiedSeconds || 0);
      } else {
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

  // Get time parts
  const getTimeParts = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const timeParts = getTimeParts(elapsedSeconds);

  const handlePlayPause = () => {
    if (isEditing) {
      // Apply manual time before starting
      const manualSeconds =
        parseInt(editHours || "0") * 3600 +
        parseInt(editMinutes || "0") * 60 +
        parseInt(editSeconds || "0");
      setElapsedSeconds(manualSeconds);
      setIsEditing(false);
    }
    if (isRunning) {
      saveStudyTime();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setEditHours("00");
    setEditMinutes("00");
    setEditSeconds("00");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
      const parts = getTimeParts(elapsedSeconds);
      setEditHours(parts.hours);
      setEditMinutes(parts.minutes);
      setEditSeconds(parts.seconds);
    }
  };

  const handleTimeBlur = () => {
    // Validate and apply time
    const h = Math.min(99, Math.max(0, parseInt(editHours || "0")));
    const m = Math.min(59, Math.max(0, parseInt(editMinutes || "0")));
    const s = Math.min(59, Math.max(0, parseInt(editSeconds || "0")));
    setEditHours(h.toString().padStart(2, "0"));
    setEditMinutes(m.toString().padStart(2, "0"));
    setEditSeconds(s.toString().padStart(2, "0"));
    const totalSeconds = h * 3600 + m * 60 + s;
    setElapsedSeconds(totalSeconds);
  };

  const handleInputChange = (
    value: string,
    setter: (val: string) => void,
    max: number
  ) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 2) {
      const num = parseInt(numericValue || "0");
      if (num <= max) {
        setter(numericValue);
      }
    }
  };

  // SVG arc parameters
  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Arc starts from top (-90deg) and goes clockwise
  // Progress determines how much of the arc is filled
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center justify-center">
          {/* Status indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className={cn(
                "size-2 rounded-full",
                isRunning ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
              )}
            />
            <span className="text-sm text-slate-400">
              {isRunning ? "Calisiyor" : "Durduruldu"}
            </span>
          </div>

          {/* Timer Circle */}
          <div className="relative">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Glow filter */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#5eead4" />
                </linearGradient>
              </defs>
              
              {/* Background circle (dark track) */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth={strokeWidth}
              />
              
              {/* Progress arc with glow */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                filter={isRunning ? "url(#glow)" : "none"}
                className="transition-all duration-500 ease-out"
              />
            </svg>

            {/* Timer display in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isEditing && !isRunning ? (
                <div className="flex items-center gap-1">
                  <div className="flex flex-col items-center">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={editHours}
                      onChange={(e) =>
                        handleInputChange(e.target.value, setEditHours, 99)
                      }
                      onBlur={handleTimeBlur}
                      className="w-16 h-14 text-center text-3xl font-mono font-bold bg-slate-800/50 border-slate-700 text-white"
                      maxLength={2}
                    />
                    <span className="text-xs text-slate-500 mt-1">Saat</span>
                  </div>
                  <span className="text-3xl font-bold text-slate-400 mb-5">:</span>
                  <div className="flex flex-col items-center">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={editMinutes}
                      onChange={(e) =>
                        handleInputChange(e.target.value, setEditMinutes, 59)
                      }
                      onBlur={handleTimeBlur}
                      className="w-16 h-14 text-center text-3xl font-mono font-bold bg-slate-800/50 border-slate-700 text-white"
                      maxLength={2}
                    />
                    <span className="text-xs text-slate-500 mt-1">Dakika</span>
                  </div>
                  <span className="text-3xl font-bold text-slate-400 mb-5">:</span>
                  <div className="flex flex-col items-center">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={editSeconds}
                      onChange={(e) =>
                        handleInputChange(e.target.value, setEditSeconds, 59)
                      }
                      onBlur={handleTimeBlur}
                      className="w-16 h-14 text-center text-3xl font-mono font-bold bg-slate-800/50 border-slate-700 text-white"
                      maxLength={2}
                    />
                    <span className="text-xs text-slate-500 mt-1">Saniye</span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleTimeClick}
                  className={cn(
                    "flex flex-col items-center cursor-pointer transition-opacity",
                    !isRunning && "hover:opacity-80"
                  )}
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
                      {timeParts.hours}
                    </span>
                    <span className="text-5xl md:text-6xl font-mono font-bold text-teal-400">:</span>
                    <span className="text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
                      {timeParts.minutes}
                    </span>
                    <span className="text-5xl md:text-6xl font-mono font-bold text-teal-400">:</span>
                    <span className="text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
                      {timeParts.seconds}
                    </span>
                  </div>
                  <div className="flex items-center gap-8 mt-2">
                    <span className="text-xs text-slate-500">Saat</span>
                    <span className="text-xs text-slate-500">Dakika</span>
                    <span className="text-xs text-slate-500">Saniye</span>
                  </div>
                  {!isRunning && (
                    <span className="text-xs text-slate-600 mt-2">
                      Duzenlemek icin tikla
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={elapsedSeconds === 0 && !isRunning}
              className="size-12 rounded-full bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-300 transition-all hover:scale-105 disabled:opacity-30"
            >
              <RotateCcw className="size-5" />
            </Button>
            <Button
              size="icon"
              onClick={handlePlayPause}
              className={cn(
                "size-14 rounded-full transition-all duration-200 hover:scale-105 shadow-lg",
                isRunning
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                  : "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/25"
              )}
            >
              {isRunning ? (
                <Pause className="size-6" />
              ) : (
                <Play className="size-6 ml-0.5" />
              )}
            </Button>
          </div>

          {/* Progress Stats */}
          <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-slate-800 w-full max-w-md">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">
                {dailyGoalHours}s
              </span>
              <span className="text-xs text-slate-500">Gunluk Hedef</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-teal-400">
                {getTimeParts(totalStudiedSeconds).hours}s {getTimeParts(totalStudiedSeconds).minutes}d
              </span>
              <span className="text-xs text-slate-500">Tamamlanan</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-2xl font-bold",
                  progressPercentage >= 100 ? "text-emerald-400" : "text-white"
                )}
              >
                %{progressPercentage.toFixed(0)}
              </span>
              <span className="text-xs text-slate-500">Ilerleme</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
