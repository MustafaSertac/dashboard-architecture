"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useLogStudy } from "@/modules/study-tasks/hooks/useStudyTasks";
import { qk } from "@/lib/query/keys";
import type { Task } from "@/lib/types";
import {
  useStudyTimerStore,
  getLiveSeconds,
} from "@/modules/study-tasks/store/study-timer.store";

// Çalışırken saniyelik yeniden render için tick
export function useTimerNow(active: boolean) {
  const [, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
}

export function useStudyTimer() {
  const { user } = useAuth();
  const studentId = user?.id ?? "";
  const queryClient = useQueryClient();
  const logStudy = useLogStudy(studentId);

  // Geçen süreyi göreve yazar. logStudy replace çalıştığı için mevcut
  // studiedHours + geçen süre ve görevin güncel doğru/yanlış/boş değerleri gönderilir.
  const persistElapsed = useCallback(() => {
    const state = useStudyTimerStore.getState();
    const seconds = getLiveSeconds(state, Date.now());

    if (!state.taskId || seconds < 1) return;

    const tasks =
      queryClient.getQueryData<Task[]>(qk.tasks.today(studentId)) ?? [];
    const task = tasks.find((t) => t.id === state.taskId);

    if (!task) {
      useStudyTimerStore.getState().clear();
      toast.error("Görev bulunamadı, süreölçer sıfırlandı");
      return;
    }

    const hours = (task.hoursStudied ?? 0) + seconds / 3600;

    // Çift kayıt olmaması için süreyi iyimser olarak sıfırla, hata olursa geri ekle
    useStudyTimerStore.getState().resetElapsed();

    logStudy.mutate(
      {
        taskId: state.taskId,
        hours,
        correctCount: task.correctAnswers ?? 0,
        wrongCount: task.wrongAnswers ?? 0,
        emptyCount: task.emptyAnswers ?? 0,
      },
      {
        onSuccess: (updated) => {
          // Sunucu yanıtını cache'e yaz: büyük sayaç görevin birikmiş
          // süresini gösterdiği için kayıt sonrası sıçrama olmasın.
          queryClient.setQueryData<Task[]>(qk.tasks.today(studentId), (old) =>
            (old ?? []).map((t) => (t.id === updated.id ? updated : t))
          );
        },
        onError: (err: unknown) => {
          useStudyTimerStore.getState().addSeconds(seconds);
          const msg =
            err instanceof Error ? err.message : "Süre kaydedilemedi";
          toast.error(msg);
        },
      }
    );
  }, [logStudy, queryClient, studentId]);

  const start = useCallback(() => {
    useStudyTimerStore.getState().start();
  }, []);

  const pauseAndPersist = useCallback(() => {
    useStudyTimerStore.getState().pause();
    persistElapsed();
  }, [persistElapsed]);

  const addAndPersist = useCallback(
    (seconds: number) => {
      useStudyTimerStore.getState().addSeconds(seconds);
      persistElapsed();
    },
    [persistElapsed]
  );

  const resetAndPersist = useCallback(() => {
    persistElapsed();
  }, [persistElapsed]);

  return {
    persistElapsed,
    start,
    pauseAndPersist,
    addAndPersist,
    resetAndPersist,
  };
}
