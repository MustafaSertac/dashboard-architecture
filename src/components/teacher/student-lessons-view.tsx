"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  useLessons,
  useStudentLessons,
  useSetStudentLessons,
} from "@/modules/lessons/hooks/useLessons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "sonner";
import { BookOpen, Search, Save, CheckCheck, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentLessonsViewProps {
  studentId: string;
}

function examTypeLabel(code: number): string {
  if (code === 10) return "TYT";
  if (code === 11) return "AYT";
  if (code === 12) return "TYT/AYT";
  return String(code);
}

export function StudentLessonsView({ studentId }: StudentLessonsViewProps) {
  const { user } = useAuth();
  const teacherId = user?.id ?? "";

  const lessonsQuery = useLessons();
  const assignedQuery = useStudentLessons(teacherId, studentId);
  const save = useSetStudentLessons(teacherId, studentId);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const assignedIds = useMemo(
    () => (assignedQuery.data ?? []).map((l) => l.lessonId),
    [assignedQuery.data]
  );
  const assignedKey = useMemo(
    () => [...assignedIds].sort().join(","),
    [assignedIds]
  );

  // Sunucudan gelen atamalar degisince secimi senkronize et.
  useEffect(() => {
    setSelected(new Set(assignedIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedKey]);

  const activeLessons = useMemo(
    () => (lessonsQuery.data ?? []).filter((l) => l.isActive),
    [lessonsQuery.data]
  );

  const filteredLessons = activeLessons.filter((l) =>
    l.name.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR"))
  );

  const toggle = (lessonId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelected(new Set(filteredLessons.map((l) => l.id)));
  };

  const handleClear = () => {
    setSelected(new Set());
  };

  const handleSave = () => {
    save.mutate(Array.from(selected), {
      onSuccess: () => toast.success("Ders atamaları kaydedildi"),
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Kaydedilemedi";
        toast.error(msg);
      },
    });
  };

  const isLoading = lessonsQuery.isLoading || assignedQuery.isLoading;
  const isError = lessonsQuery.isError || assignedQuery.isError;
  const error = lessonsQuery.error ?? assignedQuery.error;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent>
          <ErrorState
            error={error}
            title="Ders listesi yüklenemedi"
            onRetry={() => {
              lessonsQuery.refetch();
              assignedQuery.refetch();
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Ders Atama</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Öğrencinin çalışacağı dersleri seçin ({selected.size} seçili)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ders ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            <CheckCheck className="mr-2 size-4" />
            Tümünü Seç
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Eraser className="mr-2 size-4" />
            Temizle
          </Button>
          <Button size="sm" onClick={handleSave} disabled={save.isPending}>
            <Save className="mr-2 size-4" />
            {save.isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredLessons.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Ders bulunamadı.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => {
              const checked = selected.has(lesson.id);
              return (
                <label
                  key={lesson.id}
                  htmlFor={lesson.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                    checked
                      ? "border-primary/40 bg-primary/5"
                      : "bg-card hover:bg-accent"
                  )}
                >
                  <Checkbox
                    id={lesson.id}
                    checked={checked}
                    onCheckedChange={() => toggle(lesson.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{lesson.name}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {lesson.examTypes?.map((code) => (
                        <Badge
                          key={code}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {examTypeLabel(code)}
                        </Badge>
                      ))}
                      <span className="text-[10px] text-muted-foreground">
                        {lesson.unitCount} ünite
                      </span>
                    </div>
                  </div>
                  <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                </label>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
