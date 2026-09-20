import { describe, it, expect, beforeEach } from "vitest";
import {
  useStudyTimerStore,
  getLiveSeconds,
} from "@/modules/study-tasks/store/study-timer.store";

function reset() {
  useStudyTimerStore.setState({
    taskId: null,
    taskLabel: null,
    isRunning: false,
    accumulatedSeconds: 0,
    segmentStartedAt: null,
    hasHydrated: true,
  });
}

describe("study-timer store", () => {
  beforeEach(reset);

  it("selectTask gorevi ayarlar ve sureyi sifirlar", () => {
    useStudyTimerStore.setState({ accumulatedSeconds: 120 });
    useStudyTimerStore.getState().selectTask("t1", "Matematik - Fonksiyonlar");

    const s = useStudyTimerStore.getState();
    expect(s.taskId).toBe("t1");
    expect(s.accumulatedSeconds).toBe(0);
    expect(s.isRunning).toBe(false);
  });

  it("start/pause gecen segmenti accumulated'a ekler", () => {
    useStudyTimerStore.getState().selectTask("t1", "A");
    useStudyTimerStore.getState().start();
    expect(useStudyTimerStore.getState().isRunning).toBe(true);

    // segment baslangicini 30 sn geriye al
    useStudyTimerStore.setState({ segmentStartedAt: Date.now() - 30_000 });
    useStudyTimerStore.getState().pause();

    const s = useStudyTimerStore.getState();
    expect(s.isRunning).toBe(false);
    expect(s.accumulatedSeconds).toBeGreaterThanOrEqual(29);
    expect(s.segmentStartedAt).toBeNull();
  });

  it("addSeconds ekler ve negatifte 0'a clamp eder", () => {
    useStudyTimerStore.getState().addSeconds(300);
    expect(useStudyTimerStore.getState().accumulatedSeconds).toBe(300);

    useStudyTimerStore.getState().addSeconds(-1000);
    expect(useStudyTimerStore.getState().accumulatedSeconds).toBe(0);
  });

  it("getLiveSeconds calisirken canli sureyi hesaplar", () => {
    const now = Date.now();
    const value = getLiveSeconds(
      {
        accumulatedSeconds: 60,
        isRunning: true,
        segmentStartedAt: now - 10_000,
      },
      now
    );
    expect(value).toBeGreaterThanOrEqual(69);
    expect(value).toBeLessThan(71);
  });

  it("clear tum alanlari sifirlar", () => {
    useStudyTimerStore.getState().selectTask("t1", "A");
    useStudyTimerStore.getState().start();
    useStudyTimerStore.getState().clear();

    const s = useStudyTimerStore.getState();
    expect(s.taskId).toBeNull();
    expect(s.isRunning).toBe(false);
    expect(s.accumulatedSeconds).toBe(0);
  });
});
