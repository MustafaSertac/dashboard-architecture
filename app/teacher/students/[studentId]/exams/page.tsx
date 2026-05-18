"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ExamResultsTable } from "@/components/exams/exam-results-table";
import { ExamInputModal } from "@/components/exams/exam-input-modal";
import { ExamTrendsChart } from "@/components/exams/exam-trends-chart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useStudentContext } from "@/lib/hooks";
import { StudentHeader } from "@/components/teacher/student-header";

export default function StudentExamsPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { selectedStudent } = useStudentContext();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <StudentHeader student={selectedStudent} viewType="exams" />

      <div className="flex items-center justify-end">
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
          <ExamTrendsChart examType="TYT" studentId={studentId} />
          <ExamResultsTable examType="TYT" studentId={studentId} />
        </TabsContent>

        <TabsContent value="AYT" className="space-y-6">
          <ExamTrendsChart examType="AYT" studentId={studentId} />
          <ExamResultsTable examType="AYT" studentId={studentId} />
        </TabsContent>
      </Tabs>

      <ExamInputModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        studentId={studentId}
      />
    </div>
  );
}
