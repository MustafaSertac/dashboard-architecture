import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudyTimerState {
  taskId: string | null;
  taskLabel: string | null;
  isRunning: boolean;
  accumulatedSeconds: number;
  segmentStartedAt: number | null;
  hasHydrated: boolean;

  selectTask: (taskId: string, taskLabel: string) => void;
  start: () => void;
  pause: () => void;
  addSeconds: (seconds: number) => void;
  resetElapsed: () => void;
  clear: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useStudyTimerStore = create<StudyTimerState>()(
  persist(
    (set, get) => ({
      taskId: null,
      taskLabel: null,
      isRunning: false,
      accumulatedSeconds: 0,
      segmentStartedAt: null,
      hasHydrated: false,

      // Görev değişince geçen süre sıfırlanır (yeni göreve taşınmaz)
      selectTask: (taskId, taskLabel) => {
        if (get().taskId === taskId) return;
        set({
          taskId,
          taskLabel,
          isRunning: false,
          accumulatedSeconds: 0,
          segmentStartedAt: null,
        });
      },

      start: () => {
        if (get().isRunning) return;
        set({ isRunning: true, segmentStartedAt: Date.now() });
      },

      pause: () => {
        const { isRunning, segmentStartedAt, accumulatedSeconds } = get();
        if (!isRunning || segmentStartedAt === null) return;
        const segment = Math.max(0, (Date.now() - segmentStartedAt) / 1000);
        set({
          isRunning: false,
          segmentStartedAt: null,
          accumulatedSeconds: accumulatedSeconds + segment,
        });
      },

      addSeconds: (seconds) =>
        set((state) => ({
          accumulatedSeconds: Math.max(0, state.accumulatedSeconds + seconds),
        })),

      // Kaydedilen süreyi sıfırlar; çalışıyorsa yeni segment şimdiden başlar
      resetElapsed: () =>
        set((state) => ({
          accumulatedSeconds: 0,
          segmentStartedAt: state.isRunning ? Date.now() : null,
        })),

      clear: () =>
        set({
          taskId: null,
          taskLabel: null,
          isRunning: false,
          accumulatedSeconds: 0,
          segmentStartedAt: null,
        }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "edc-study-timer",
      partialize: (state) => ({
        taskId: state.taskId,
        taskLabel: state.taskLabel,
        isRunning: state.isRunning,
        accumulatedSeconds: state.accumulatedSeconds,
        segmentStartedAt: state.segmentStartedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function getLiveSeconds(
  state: Pick<
    StudyTimerState,
    "accumulatedSeconds" | "isRunning" | "segmentStartedAt"
  >,
  now: number
): number {
  if (state.isRunning && state.segmentStartedAt !== null) {
    return (
      state.accumulatedSeconds +
      Math.max(0, (now - state.segmentStartedAt) / 1000)
    );
  }
  return state.accumulatedSeconds;
}
