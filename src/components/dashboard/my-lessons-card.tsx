"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLessons, useStudentOwnLessons } from "@/modules/lessons/hooks/useLessons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { BookOpen } from "lucide-react";

export function MyLessonsCard() {
  const { user } = useAuth();
  const {
    data: assigned,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudentOwnLessons(user?.id);
  const { data: lessons } = useLessons();

  const lessonNameById = useMemo(
    () => new Map((lessons ?? []).map((l) => [l.id, l.name])),
    [lessons]
  );

  const items = useMemo(() => {
    const seen = new Set<string>();
    const out: { id: string; name: string }[] = [];
    (assigned ?? []).forEach((a) => {
      if (seen.has(a.lessonId)) return;
      seen.add(a.lessonId);
      out.push({
        id: a.lessonId,
        name: a.lessonName ?? lessonNameById.get(a.lessonId) ?? "Ders",
      });
    });
    return out.sort((x, y) => x.name.localeCompare(y.name, "tr"));
  }, [assigned, lessonNameById]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <BookOpen className="size-4 text-primary" />
          Derslerim
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        ) : isError ? (
          <ErrorState
            error={error}
            title="Dersler yüklenemedi"
            onRetry={() => refetch()}
          />
        ) : items.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            Henüz size atanmış ders yok.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Badge key={item.id} variant="secondary">
                {item.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
