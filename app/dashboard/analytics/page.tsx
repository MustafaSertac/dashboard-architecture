"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyAnalytics } from "@/components/analytics/weekly-analytics";
import { MonthlyAnalytics } from "@/components/analytics/monthly-analytics";
import { YearlyAnalytics } from "@/components/analytics/yearly-analytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analizler</h1>
        <p className="text-muted-foreground">
          Haftalik, aylik ve yillik performans analizlerini incele
        </p>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Haftalik Analiz</TabsTrigger>
          <TabsTrigger value="monthly">Aylik Analiz</TabsTrigger>
          <TabsTrigger value="yearly">Yillik Analiz</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <WeeklyAnalytics />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyAnalytics />
        </TabsContent>

        <TabsContent value="yearly">
          <YearlyAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
