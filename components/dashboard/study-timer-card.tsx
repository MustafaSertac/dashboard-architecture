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

  const dailyGoalSeconds = dailyGoalHours * 60 * 60;
  const totalStudiedSeconds = todayStudiedSeconds + elapsedSeconds;
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
        // Restore elapsed seconds if saved
        if (parsed.currentElapsed) {
          setElapsedSeconds(parsed.currentElapsed);
        }
      } else {
        localStorage.setItem(
          "studyTimerData",
          JSON.stringify({ date: today, studiedSeconds: 0, currentElapsed: 0 })
        );
      }
    }
  }, []);

  // Save current elapsed time periodically
  const saveCurrentState = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      "studyTimerData",
      JSON.stringify({ 
        date: today, 
        studiedSeconds: todayStudiedSeconds, 
        currentElapsed: elapsedSeconds 
      })
    );
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

  // Save state when pausing
  useEffect(() => {
    if (!isRunning && elapsedSeconds > 0) {
      saveCurrentState();
    }
  }, [isRunning, elapsedSeconds, saveCurrentState]);

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
      const manualSeconds =
        parseInt(editHours || "0") * 3600 +
        parseInt(editMinutes || "0") * 60 +
        parseInt(editSeconds || "0");
      setElapsedSeconds(manualSeconds);
      setIsEditing(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    // Save elapsed to total before resetting
    if (elapsedSeconds > 0) {
      const newTotal = todayStudiedSeconds + elapsedSeconds;
      setTodayStudiedSeconds(newTotal);
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(
        "studyTimerData",
        JSON.stringify({ date: today, studiedSeconds: newTotal, currentElapsed: 0 })
      );
    }
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

  // Smaller SVG arc parameters
  const size = 180;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800/50">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Timer Circle */}
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
              
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth={strokeWidth}
              />
              
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
                className="transition-all duration-300"
              />
            </svg>

            {/* Timer display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isEditing && !isRunning ? (
                <div className="flex items-center gap-0.5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editHours}
                    onChange={(e) => handleInputChange(e.target.value, setEditHours, 99)}
                    onBlur={handleTimeBlur}
                    className="w-10 h-8 text-center text-lg font-mono font-bold bg-slate-800/50 border-slate-700 text-white px-1"
                    maxLength={2}
                  />
                  <span className="text-lg font-bold text-slate-500">:</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editMinutes}
                    onChange={(e) => handleInputChange(e.target.value, setEditMinutes, 59)}
                    onBlur={handleTimeBlur}
                    className="w-10 h-8 text-center text-lg font-mono font-bold bg-slate-800/50 border-slate-700 text-white px-1"
                    maxLength={2}
                  />
                  <span className="text-lg font-bold text-slate-500">:</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editSeconds}
                    onChange={(e) => handleInputChange(e.target.value, setEditSeconds, 59)}
                    onBlur={handleTimeBlur}
                    className="w-10 h-8 text-center text-lg font-mono font-bold bg-slate-800/50 border-slate-700 text-white px-1"
                    maxLength={2}
                  />
                </div>
              ) : (
                <div
                  onClick={handleTimeClick}
                  className={cn(
                    "flex flex-col items-center cursor-pointer transition-opacity",
                    !isRunning && "hover:opacity-70"
                  )}
                >
                  <div className="flex items-center">
                    <span className="text-3xl font-mono font-semibold text-white tabular-nums">
                      {timeParts.hours}
                    </span>
                    <span className="text-3xl font-mono font-semibold text-teal-400 mx-0.5">:</span>
                    <span className="text-3xl font-mono font-semibold text-white tabular-nums">
                      {timeParts.minutes}
                    </span>
                    <span className="text-3xl font-mono font-semibold text-teal-400 mx-0.5">:</span>
                    <span className="text-3xl font-mono font-semibold text-white tabular-nums">
                      {timeParts.seconds}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 mt-1">
                    <span className="text-[10px] text-slate-500">Saat</span>
                    <span className="text-[10px] text-slate-500">Dakika</span>
                    <span className="text-[10px] text-slate-500">Saniye</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Status & Controls */}
          <div className="flex flex-col items-center gap-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "size-2 rounded-full",
                  isRunning ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
                )}
              />
              <span className="text-sm font-medium text-slate-400">
                {isRunning ? "Calisiyor" : "Durduruldu"}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                disabled={elapsedSeconds === 0 && !isRunning}
                className="size-10 rounded-full bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-400 disabled:opacity-30"
              >
                <RotateCcw className="size-4" />
              </Button>
              <Button
                size="icon"
                onClick={handlePlayPause}
                className={cn(
                  "size-12 rounded-full transition-all shadow-lg",
                  isRunning
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                    : "bg-teal-500 hover:bg-teal-600 shadow-teal-500/20"
                )}
              >
                {isRunning ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5 ml-0.5" />
                )}
              </Button>
            </div>
            
            {!isRunning && !isEditing && (
              <span className="text-[10px] text-slate-600">Sureyi duzenlemek icin tikla</span>
            )}
          </div>

          {/* Right: Stats */}
          <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3">
            <div className="text-center md:text-right">
              <span className="text-lg font-semibold text-white">{dailyGoalHours}s</span>
              <p className="text-[10px] text-slate-500">Hedef</p>
            </div>
            <div className="text-center md:text-right">
              <span className="text-lg font-semibold text-teal-400">
                {getTimeParts(totalStudiedSeconds).hours}s {getTimeParts(totalStudiedSeconds).minutes}d
              </span>
              <p className="text-[10px] text-slate-500">Tamamlanan</p>
            </div>
            <div className="text-center md:text-right">
              <span className={cn(
                "text-lg font-semibold",
                progressPercentage >= 100 ? "text-emerald-400" : "text-white"
              )}>
                %{progressPercentage.toFixed(0)}
              </span>
              <p className="text-[10px] text-slate-500">Ilerleme</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
