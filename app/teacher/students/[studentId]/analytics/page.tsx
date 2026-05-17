"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyAnalytics } from "@/components/analytics/weekly-analytics";
import { MonthlyAnalytics } from "@/components/analytics/monthly-analytics";
import { YearlyAnalytics } from "@/components/analytics/yearly-analytics";
import { useStudentContext } from "@/lib/student-context";
import { StudentHeader } from "@/components/teacher/student-header";

export default function StudentAnalyticsPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { selectedStudent } = useStudentContext();

  return (
    <div className="space-y-6">
      <StudentHeader student={selectedStudent} viewType="analytics" />

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Haftalik Analiz</TabsTrigger>
          <TabsTrigger value="monthly">Aylik Analiz</TabsTrigger>
          <TabsTrigger value="yearly">Yillik Analiz</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <WeeklyAnalytics studentId={studentId} />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyAnalytics studentId={studentId} />
        </TabsContent>

        <TabsContent value="yearly">
          <YearlyAnalytics studentId={studentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
