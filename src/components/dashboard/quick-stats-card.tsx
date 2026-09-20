"use client";

import { useAuth } from "@/lib/auth-context";
import { useDashboardOverview } from "@/modules/analytics/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";

export function QuickStatsCard() {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = useDashboardOverview(user?.id ?? "");

  if (isLoading) {
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-2 md:col-span-4">
        <CardContent className="py-6 text-center">
          <ErrorState error={error} title="Istatistikler yuklenemedi" onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  const qs = data?.quickStats;
  const stats = [
    {
      title: "Toplam Soru",
      value: (qs?.totalSolvedQuestions ?? 0).toLocaleString(),
      icon: BookOpen,
      color: "text-primary",
    },
    {
      title: "Tamamlanan",
      value: (qs?.completedTasks ?? 0).toString(),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Bekleyen",
      value: (qs?.pendingTasks ?? 0).toString(),
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Son Net",
      value: qs?.latestNet != null ? qs.latestNet.toFixed(1) : "—",
      icon: TrendingUp,
      color: "text-info",
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`size-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
