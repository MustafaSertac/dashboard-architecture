"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudentContext } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Clock,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StudentList() {
  const { studentsWithStats, setSelectedStudent } = useStudentContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = studentsWithStats.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewStudent = (student: typeof studentsWithStats[0]) => {
    setSelectedStudent(student);
    router.push(`/teacher/students/${student.id}/daily`);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-success";
    if (progress >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 80) return { label: "Mukemmel", variant: "default" as const };
    if (progress >= 50) return { label: "Iyi", variant: "secondary" as const };
    return { label: "Gelistirilmeli", variant: "destructive" as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ogrencilerim</h1>
          <p className="text-muted-foreground">
            {studentsWithStats.length} ogrenci atanmis
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ogrenci ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Ogrenci</p>
              <p className="text-2xl font-bold">{studentsWithStats.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
              <TrendingUp className="size-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ort. Ilerleme</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  studentsWithStats.reduce((sum, s) => sum + s.weeklyProgress, 0) /
                    studentsWithStats.length || 0
                )}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-warning/10">
              <BookOpen className="size-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Gorev</p>
              <p className="text-2xl font-bold">
                {studentsWithStats.reduce((sum, s) => sum + s.totalTasks, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-info/10">
              <CheckCircle2 className="size-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tamamlanan</p>
              <p className="text-2xl font-bold">
                {studentsWithStats.reduce((sum, s) => sum + s.completedTasks, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">Ogrenci bulunamadi</p>
            <p className="text-sm text-muted-foreground">
              Arama kriterlerinizi degistirmeyi deneyin
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => {
            const progressBadge = getProgressBadge(student.weeklyProgress);
            return (
              <Card
                key={student.id}
                className="group transition-all hover:shadow-md hover:border-primary/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <Badge variant={progressBadge.variant}>{progressBadge.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Haftalik Ilerleme</span>
                      <span className="font-medium">{student.weeklyProgress}%</span>
                    </div>
                    <Progress
                      value={student.weeklyProgress}
                      className={cn("h-2", getProgressColor(student.weeklyProgress))}
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-lg font-semibold">{student.totalTasks}</p>
                      <p className="text-xs text-muted-foreground">Gorev</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-lg font-semibold">{student.completedTasks}</p>
                      <p className="text-xs text-muted-foreground">Tamamlanan</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-lg font-semibold">{student.totalHours.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Saat</p>
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>Son aktivite: {student.lastActive}</span>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleViewStudent(student)}
                    className="w-full group-hover:bg-primary"
                    variant="outline"
                  >
                    Detaylari Gor
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
