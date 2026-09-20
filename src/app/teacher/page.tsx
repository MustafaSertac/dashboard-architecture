"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentContext } from "@/lib/student-context";
import { ExamTrendsChart } from "@/components/exams/exam-trends-chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Users, TrendingUp, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ExamType } from "@/lib/types";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const {
    studentsWithStats,
    isLoading: studentsLoading,
    isError: studentsError,
    error: studentsErr,
    refetch: refetchStudents,
  } = useStudentContext();
  const [trendExamType, setTrendExamType] = useState<ExamType>("TYT");

  useEffect(() => {
    if (!isLoading && user && user.role === "student") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const totalStudents = studentsWithStats.length;
  const avgProgress = Math.round(
    studentsWithStats.reduce((sum, s) => sum + s.weeklyProgress, 0) / totalStudents || 0
  );
  const totalTasks = studentsWithStats.reduce((sum, s) => sum + s.totalTasks, 0);
  const completedTasks = studentsWithStats.reduce((sum, s) => sum + s.completedTasks, 0);
  const totalHours = studentsWithStats.reduce((sum, s) => sum + s.totalHours, 0);

  // Students needing attention (below 50% progress)
  const studentsNeedingAttention = studentsWithStats.filter(
    (s) => s.weeklyProgress < 50
  );

  // Top performers (above 80% progress)
  const topPerformers = studentsWithStats.filter((s) => s.weeklyProgress >= 80);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ogretmen Paneli</h1>
        <p className="text-muted-foreground">
          Hos geldiniz, {user?.name || "Ogretmen"}. Ogrencilerinizin durumuna genel bakis.
        </p>
      </div>

      {studentsError ? (
        <Card>
          <CardContent>
            <ErrorState
              error={studentsErr}
              title="Ogrenci verileri yuklenemedi"
              onRetry={() => refetchStudents()}
            />
          </CardContent>
        </Card>
      ) : studentsLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="mt-2 h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      ) : (
        <>
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ogrenci</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">atanmis ogrenci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Ilerleme</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <p className="text-xs text-muted-foreground">haftalik ortalama</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan Gorev</CardTitle>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
            <p className="text-xs text-muted-foreground">toplam gorev</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Calisma</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">saat calisma</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Students Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-destructive" />
              Dikkat Gerektiren Ogrenciler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentsNeedingAttention.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tum ogrenciler iyi performans gosteriyor!
              </p>
            ) : (
              <div className="space-y-3">
                {studentsNeedingAttention.slice(0, 3).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Ilerleme: {student.weeklyProgress}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/students/${student.id}/daily`}>
                        Incele
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              En Iyi Performans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPerformers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Henuz yuksek performansli ogrenci yok.
              </p>
            ) : (
              <div className="space-y-3">
                {topPerformers.slice(0, 3).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Ilerleme: {student.weeklyProgress}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/students/${student.id}/daily`}>
                        Incele
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hizli Erisim</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/teacher/students">
                <Users className="mr-2 size-4" />
                Tum Ogrencileri Gor
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tum Ogrenci Net Trend Karsilastirmasi (BACKEND #7) */}
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">
              Ogrenci Net Trend Karsilastirmasi
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Tum ogrencilerin deneme net gelisimi
            </p>
          </div>
          <Tabs
            value={trendExamType}
            onValueChange={(v) => setTrendExamType(v as ExamType)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="TYT" className="px-3 text-xs">TYT</TabsTrigger>
              <TabsTrigger value="AYT" className="px-3 text-xs">AYT</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ExamTrendsChart examType={trendExamType} />
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
