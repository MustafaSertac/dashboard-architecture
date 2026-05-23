"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { ExamResultsTable } from "@/components/exams/exam-results-table";
import { ExamInputModal } from "@/components/exams/exam-input-modal";
import { ExamTrendsChart } from "@/components/exams/exam-trends-chart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function ExamsPage() {
  const { currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const isTeacher = currentUser.role === "teacher" || currentUser.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deneme Analiz</h1>
          <p className="text-muted-foreground">
            Deneme sonuclarini takip et ve analizlerini gor
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Sonuc Ekle
        </Button>
      </div>

      <Tabs defaultValue="TYT" className="space-y-4">
        <TabsList>
          <TabsTrigger value="TYT">TYT</TabsTrigger>
          <TabsTrigger value="AYT">AYT</TabsTrigger>
        </TabsList>

        <TabsContent value="TYT" className="space-y-6">
          {isTeacher && <ExamTrendsChart examType="TYT" />}
          <ExamResultsTable examType="TYT" />
        </TabsContent>

        <TabsContent value="AYT" className="space-y-6">
          {isTeacher && <ExamTrendsChart examType="AYT" />}
          <ExamResultsTable examType="AYT" />
        </TabsContent>
      </Tabs>

      <ExamInputModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
