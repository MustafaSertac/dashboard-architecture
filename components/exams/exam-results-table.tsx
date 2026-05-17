"use client";

import { useApp } from "@/lib/context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import type { ExamType } from "@/lib/types";

interface ExamResultsTableProps {
  examType: ExamType;
  studentId?: string;
}

export function ExamResultsTable({ examType, studentId: propStudentId }: ExamResultsTableProps) {
  const { examResults, currentUser, updateExamResult } = useApp();

  const studentId = propStudentId || currentUser.id;

  const filteredResults = examResults
    .filter(
      (exam) =>
        exam.examType === examType && exam.studentId === studentId
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleAnalysisToggle = (id: string, checked: boolean) => {
    updateExamResult(id, { analysisCompleted: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {examType} Sonuclari
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredResults.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Henuz {examType} sonucu eklenmedi.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-center">Dogru</TableHead>
                  <TableHead className="text-center">Yanlis</TableHead>
                  <TableHead className="text-center">Bos</TableHead>
                  <TableHead className="text-center">Net</TableHead>
                  <TableHead className="text-center">Analiz</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">
                      {format(parseISO(exam.date), "d MMMM yyyy", {
                        locale: tr,
                      })}
                    </TableCell>
                    <TableCell className="text-center text-green-600 dark:text-green-400">
                      {exam.correct}
                    </TableCell>
                    <TableCell className="text-center text-red-600 dark:text-red-400">
                      {exam.wrong}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {exam.empty}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">
                        {exam.net.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={exam.analysisCompleted}
                          onCheckedChange={(checked) =>
                            handleAnalysisToggle(exam.id, checked)
                          }
                        />
                        <Badge
                          variant={exam.analysisCompleted ? "default" : "outline"}
                          className={
                            exam.analysisCompleted
                              ? "bg-green-500/20 text-green-600 dark:text-green-400"
                              : ""
                          }
                        >
                          {exam.analysisCompleted ? "Tamam" : "Bekliyor"}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
