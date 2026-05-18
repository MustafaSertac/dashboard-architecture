"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentContext } from "@/lib/hooks";
import { Users, TrendingUp, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { studentsWithStats } = useStudentContext();

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
    </div>
  );
}
