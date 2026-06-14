"use client";

import { useState } from "react";
import { ExamResultsTable } from "@/components/exams/exam-results-table";
import { ExamInputModal } from "@/components/exams/exam-input-modal";
import { ExamNetTrendCard } from "@/components/dashboard/exam-net-trend-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function ExamsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deneme Analiz</h1>
          <p className="text-muted-foreground">
            Deneme sonuçlarını takip et ve analizlerini gör
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Sonuç Ekle
        </Button>
      </div>

      <ExamNetTrendCard />

      <Tabs defaultValue="TYT" className="space-y-4">
        <TabsList>
          <TabsTrigger value="TYT">TYT</TabsTrigger>
          <TabsTrigger value="AYT">AYT</TabsTrigger>
        </TabsList>

        <TabsContent value="TYT">
          <ExamResultsTable examType="TYT" />
        </TabsContent>

        <TabsContent value="AYT">
          <ExamResultsTable examType="AYT" />
        </TabsContent>
      </Tabs>

      <ExamInputModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
