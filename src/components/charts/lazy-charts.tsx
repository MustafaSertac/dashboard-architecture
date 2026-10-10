"use client";

import dynamic from "next/dynamic";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Recharts agir bir bagimlilik (~500 KB). Grafik barlari istemci tarafinda
// gec yuklenerek ilk sayfa JS yuku kucultulur; `ssr: false` ile sunucuda
// render edilmez, yuklenirken kart iskeleti gosterilir.
function ChartCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <div className="p-6 pt-0">
        <Skeleton className="h-[260px] w-full" />
      </div>
    </Card>
  );
}

export const WeeklyProgressCard = dynamic(
  () =>
    import("@/components/dashboard/weekly-progress-card").then(
      (m) => m.WeeklyProgressCard
    ),
  { ssr: false, loading: () => <ChartCardSkeleton /> }
);

export const ExamNetTrendCard = dynamic(
  () =>
    import("@/components/dashboard/exam-net-trend-card").then(
      (m) => m.ExamNetTrendCard
    ),
  { ssr: false, loading: () => <ChartCardSkeleton /> }
);

export const ExamTrendsChart = dynamic(
  () =>
    import("@/components/exams/exam-trends-chart").then(
      (m) => m.ExamTrendsChart
    ),
  { ssr: false, loading: () => <ChartCardSkeleton /> }
);
