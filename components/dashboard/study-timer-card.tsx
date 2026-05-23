"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";
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
  const [addMinutes, setAddMinutes] = useState("15");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const dailyGoalSeconds = dailyGoalHours * 60 * 60;
  const totalStudiedSeconds = todayStudiedSeconds + elapsedSeconds;
  const remainingSeconds = Math.max(0, dailyGoalSeconds - totalStudiedSeconds);
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

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}s ${minutes}d`;
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

  const handleAddTime = () => {
    const minutesToAdd = parseInt(addMinutes || "0");
    if (minutesToAdd > 0) {
      setElapsedSeconds((prev) => prev + minutesToAdd * 60);
    }
  };

  const motivationalMessages = [
    "Harika gidiyorsun! Devam et!",
    "Odaklan ve basariya ulas!",
    "Her dakika seni hedefe yaklastiriyor!",
    "Basari, kararliligin oduluydu!",
  ];

  const getMessage = () => {
    if (progressPercentage >= 100) return "Tebrikler! Gunluk hedefe ulastin!";
    if (progressPercentage >= 75) return "Neredeyse tamam! Son hamle!";
    if (progressPercentage >= 50) return "Yarisini gectin! Devam!";
    if (isRunning) return motivationalMessages[Math.floor(progressPercentage / 25)];
    return "Calisma seansina basla!";
  };

  // Compact SVG parameters
  const size = 120;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-800/50">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
          {/* Left Section: Title & Stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                "size-2 rounded-full",
                isRunning ? "bg-teal-400 animate-pulse" : "bg-slate-600"
              )} />
              <h3 className="text-sm font-semibold text-white">Calisma Zamanlayicisi</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Disiplin, basariyi getirir.</p>
            
            {/* Stats Row */}
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-teal-400 font-semibold">{dailyGoalHours} Saat</span>
                <p className="text-slate-500">Gunluk Hedef</p>
              </div>
              <div>
                <span className="text-white font-semibold">{formatDuration(totalStudiedSeconds)}</span>
                <p className="text-slate-500">Tamamlanan</p>
              </div>
              <div>
                <span className="text-white font-semibold">{formatDuration(remainingSeconds)}</span>
                <p className="text-slate-500">Kalan Sure</p>
              </div>
            </div>

            {/* Manual Add Section */}
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Manuel Ekle</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-xs">+</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={addMinutes}
                    onChange={(e) => setAddMinutes(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className="w-12 h-7 text-center text-xs bg-slate-800/50 border-slate-700 text-white px-1"
                  />
                  <span className="text-slate-400 text-xs">dk</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTime}
                  className="h-7 px-3 text-xs bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                  Ekle
                </Button>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">Calisma sureni manuel olarak ekleyebilirsin.</p>
            </div>
          </div>

          {/* Center: Timer Circle */}
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              <defs>
                <filter id="timerGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                stroke="url(#timerGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                filter={isRunning ? "url(#timerGlow)" : "none"}
                className="transition-all duration-300"
              />
            </svg>

            {/* Timer Display Inside Circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 mb-1">
                <div className={cn(
                  "size-1.5 rounded-full",
                  isRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                )} />
                <span className="text-[10px] text-slate-400">
                  {isRunning ? "Calisiyor" : "Durduruldu"}
                </span>
              </div>
              
              {isEditing && !isRunning ? (
                <div className="flex items-center gap-0.5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editHours}
                    onChange={(e) => handleInputChange(e.target.value, setEditHours, 99)}
                    onBlur={handleTimeBlur}
                    className="w-6 h-5 text-center text-xs font-mono font-bold bg-slate-800/50 border-slate-700 text-white p-0"
                    maxLength={2}
                  />
                  <span className="text-xs font-bold text-teal-400">:</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editMinutes}
                    onChange={(e) => handleInputChange(e.target.value, setEditMinutes, 59)}
                    onBlur={handleTimeBlur}
                    className="w-6 h-5 text-center text-xs font-mono font-bold bg-slate-800/50 border-slate-700 text-white p-0"
                    maxLength={2}
                  />
                  <span className="text-xs font-bold text-teal-400">:</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={editSeconds}
                    onChange={(e) => handleInputChange(e.target.value, setEditSeconds, 59)}
                    onBlur={handleTimeBlur}
                    className="w-6 h-5 text-center text-xs font-mono font-bold bg-slate-800/50 border-slate-700 text-white p-0"
                    maxLength={2}
                  />
                </div>
              ) : (
                <div
                  onClick={handleTimeClick}
                  className={cn(
                    "cursor-pointer transition-opacity text-center",
                    !isRunning && "hover:opacity-70"
                  )}
                >
                  <div className="text-lg font-mono font-bold text-white tabular-nums tracking-tight">
                    {timeParts.hours}:{timeParts.minutes}:{timeParts.seconds}
                  </div>
                  <div className="flex justify-center gap-3 mt-0.5">
                    <span className="text-[8px] text-slate-500">Saat</span>
                    <span className="text-[8px] text-slate-500">Dakika</span>
                    <span className="text-[8px] text-slate-500">Saniye</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Controls & Progress */}
          <div className="flex flex-col items-center gap-3">
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                disabled={elapsedSeconds === 0 && !isRunning}
                className="size-8 rounded-full bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-400 disabled:opacity-30"
              >
                <RotateCcw className="size-3.5" />
              </Button>
              <Button
                size="icon"
                onClick={handlePlayPause}
                className={cn(
                  "size-10 rounded-full transition-all shadow-lg",
                  isRunning
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                    : "bg-teal-500 hover:bg-teal-600 shadow-teal-500/20"
                )}
              >
                {isRunning ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4 ml-0.5" />
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-24">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">Gunluk Ilerleme</span>
                <span className="text-xs font-semibold text-teal-400">%{progressPercentage.toFixed(0)}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 text-center">
                {formatDuration(totalStudiedSeconds)} / {dailyGoalHours}s
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Motivational Message */}
        <div className="mt-3 pt-3 border-t border-slate-800/50 text-center">
          <p className="text-xs text-slate-400">{getMessage()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
