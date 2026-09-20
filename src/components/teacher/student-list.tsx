"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStudentContext } from "@/lib/student-context";
import { useAuth } from "@/lib/auth-context";
import { useAddStudent, useRemoveStudent } from "@/modules/teacher/hooks/useTeacher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Users,
  Search,
  Clock,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  ArrowRight,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StudentList() {
  const {
    studentsWithStats,
    setSelectedStudent,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudentContext();
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState("");
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const addStudent = useAddStudent(user?.id);
  const removeStudent = useRemoveStudent(user?.id);

  const handleAddStudent = () => {
    if (!newStudentId.trim()) {
      toast.error("Ogrenci ID girin");
      return;
    }
    addStudent.mutate(newStudentId.trim(), {
      onSuccess: () => {
        toast.success("Ogrenci eklendi");
        setAddDialogOpen(false);
        setNewStudentId("");
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Ogrenci eklenemedi";
        toast.error(msg);
      },
    });
  };

  const handleRemoveStudent = () => {
    if (!removeTarget) return;
    removeStudent.mutate(removeTarget, {
      onSuccess: () => {
        toast.success("Ogrenci kaldirildi");
        setRemoveTarget(null);
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Ogrenci kaldirilamadi";
        toast.error(msg);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="mt-2 h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="mt-3 h-2 w-full" />
                <Skeleton className="mt-2 h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent>
          <ErrorState
            error={error}
            title="Ogrenci listesi yuklenemedi"
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

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
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ogrenci ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="mr-2 size-4" />
            Ekle
          </Button>
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
                    <div className="flex items-center gap-1">
                      <Badge variant={progressBadge.variant}>{progressBadge.label}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => setRemoveTarget(student.id)}
                      >
                        <UserMinus className="size-4" />
                      </Button>
                    </div>
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

      {/* Add Student Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ogrenci Ekle</DialogTitle>
            <DialogDescription>
              Mevcut bir ogrenciyi ogretmen listesine ekleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="newStudentId">Ogrenci ID</Label>
            <Input
              id="newStudentId"
              placeholder="Ogrenci ID girin"
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Iptal
            </Button>
            <Button onClick={handleAddStudent} disabled={addStudent.isPending}>
              {addStudent.isPending ? "Ekleniyor..." : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Student AlertDialog */}
      <AlertDialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ogrenciyi Kaldir</AlertDialogTitle>
            <AlertDialogDescription>
              Bu ogrenciyi listenizden kaldirmak istediginize emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Iptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveStudent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeStudent.isPending ? "Kaldiriliyor..." : "Kaldir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
