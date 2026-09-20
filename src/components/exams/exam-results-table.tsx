"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useExamList, useExamDetail, useUpdateExam, useDeleteExam } from "@/modules/exams/hooks/useExams";
import { ExamStatus, scoreTypeLabel } from "@/types/common";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { ExamType, ExamResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExamResultsTableProps {
  examType: ExamType;
  studentId?: string;
}

export function ExamResultsTable({
  examType,
  studentId: propStudentId,
}: ExamResultsTableProps) {
  const { user } = useAuth();
  const studentId = propStudentId || user?.id || "";

  const { data: allExams, isLoading, isError, error, refetch } = useExamList(studentId);
  const updateExam = useUpdateExam();
  const deleteExam = useDeleteExam();

  const [selectedExam, setSelectedExam] = useState<ExamResult | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Ozet listede sections gelmedigi icin ders detayini ayri endpoint'ten cek
  const { data: examDetail, isLoading: isDetailLoading } = useExamDetail(
    selectedExam?.id ?? "",
    true
  );
  const detailExam = examDetail ?? selectedExam;

  const filteredResults = useMemo(() => {
    return (allExams ?? [])
      .filter((exam) => exam.examType === examType)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [allExams, examType]);

  const handleAnalysisToggle = (exam: ExamResult, checked: boolean) => {
    updateExam.mutate({
      id: exam.id,
      studentId,
      data: {
        status: checked ? ExamStatus.Completed : ExamStatus.Submitted,
      },
    });
  };

  const handleDeleteExam = () => {
    if (!deleteTarget) return;
    deleteExam.mutate(
      { id: deleteTarget, studentId },
      {
        onSuccess: () => {
          toast.success("Sinav silindi");
          setDeleteTarget(null);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Sinav silinemedi";
          toast.error(msg);
          setDeleteTarget(null);
        },
      }
    );
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getTrend = (currentIndex: number) => {
    if (currentIndex >= filteredResults.length - 1) return null;
    const current = filteredResults[currentIndex];
    const previous = filteredResults[currentIndex + 1];
    const diff = current.totalNet - previous.totalNet;
    if (diff > 0) return { type: "up", value: diff };
    if (diff < 0) return { type: "down", value: Math.abs(diff) };
    return { type: "same", value: 0 };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {examType} Sonuçları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {examType} Sonuçları
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <ErrorState error={error} title="Sonuclar yuklenemedi" onRetry={() => refetch()} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {examType} Sonuçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Henüz {examType} sonucu eklenmedi.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredResults.map((exam, index) => {
                const isExpanded = expandedRows.has(exam.id);
                const trend = getTrend(index);
                const totalQuestions =
                  exam.subjectResults?.reduce(
                    (sum, s) => sum + s.questionCount,
                    0
                  ) || 0;
                const answeredQuestions = exam.totalCorrect + exam.totalWrong;
                const answeredPercentage =
                  totalQuestions > 0
                    ? (answeredQuestions / totalQuestions) * 100
                    : 0;

                return (
                  <div
                    key={exam.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Ana Satır */}
                    <div
                      className={cn(
                        "flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                        isExpanded && "bg-muted/30"
                      )}
                      onClick={() => toggleRow(exam.id)}
                    >
                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            {format(parseISO(exam.date), "d MMMM yyyy", {
                              locale: tr,
                            })}
                          </div>
                          {scoreTypeLabel(exam.scoreType) && (
                            <Badge variant="outline" className="text-xs">
                              {scoreTypeLabel(exam.scoreType)}
                            </Badge>
                          )}
                        </div>
                        {exam.examName && (
                          <div className="text-sm text-muted-foreground truncate">
                            {exam.examName}
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-success">
                            {exam.totalCorrect}
                          </div>
                          <div className="text-xs text-muted-foreground">Doğru</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-destructive">
                            {exam.totalWrong}
                          </div>
                          <div className="text-xs text-muted-foreground">Yanlış</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground">
                            {exam.totalEmpty}
                          </div>
                          <div className="text-xs text-muted-foreground">Boş</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="font-mono text-base px-3 py-1"
                        >
                          {exam.totalNet.toFixed(2)}
                        </Badge>
                        {trend && (
                          <div
                            className={cn(
                              "flex items-center text-xs",
                              trend.type === "up" && "text-success",
                              trend.type === "down" && "text-destructive",
                              trend.type === "same" && "text-muted-foreground"
                            )}
                          >
                            {trend.type === "up" && (
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                            )}
                            {trend.type === "down" && (
                              <TrendingDown className="w-3 h-3 mr-0.5" />
                            )}
                            {trend.type === "same" && (
                              <Minus className="w-3 h-3 mr-0.5" />
                            )}
                            {trend.value > 0 && `+${trend.value.toFixed(1)}`}
                          </div>
                        )}
                      </div>

                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Switch
                          checked={exam.analysisCompleted}
                          onCheckedChange={(checked) =>
                            handleAnalysisToggle(exam, checked)
                          }
                          disabled={updateExam.isPending}
                        />
                        <Badge
                          variant={exam.analysisCompleted ? "default" : "outline"}
                          className={cn(
                            "hidden sm:inline-flex",
                            exam.analysisCompleted && "bg-success/20 text-success"
                          )}
                        >
                          {exam.analysisCompleted ? "Tamam" : "Bekliyor"}
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExam(exam);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(exam.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Genişletilmiş Ders Detayları */}
                    {isExpanded && (
                      <div className="border-t bg-muted/20 p-4">
                        <ExamSubjectsInline examId={exam.id} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detay Modal */}
      <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>
                {detailExam?.examName || `${detailExam?.examType} Sınavı`} -{" "}
                {detailExam &&
                  format(parseISO(detailExam.date), "d MMMM yyyy", {
                    locale: tr,
                  })}
              </span>
              {scoreTypeLabel(detailExam?.scoreType) && (
                <Badge variant="outline" className="text-xs">
                  {scoreTypeLabel(detailExam?.scoreType)}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {isDetailLoading && !examDetail ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : detailExam ? (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {detailExam.totalCorrect}
                  </div>
                  <div className="text-xs text-muted-foreground">Toplam Doğru</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {detailExam.totalWrong}
                  </div>
                  <div className="text-xs text-muted-foreground">Toplam Yanlış</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {detailExam.totalEmpty}
                  </div>
                  <div className="text-xs text-muted-foreground">Toplam Boş</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {detailExam.totalNet.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {detailExam.examType === "AYT" ? "Puan Türü Net" : "Toplam Net"}
                  </div>
                </div>
              </div>

              {detailExam.examType === "AYT" && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                    Puanlanan Sorular (80)
                  </h4>
                  <div className="grid grid-cols-3 gap-4 p-4 rounded-lg border border-primary/30 bg-primary/5">
                    <div className="text-center">
                      <div className="text-xl font-bold text-success">
                        {detailExam.scoreCorrect ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Doğru</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-destructive">
                        {detailExam.scoreWrong ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Yanlış</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-muted-foreground">
                        {detailExam.scoreBlank ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Boş</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-3">Ders Bazlı Sonuçlar</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ders</TableHead>
                      <TableHead className="text-center">Soru</TableHead>
                      <TableHead className="text-center">Doğru</TableHead>
                      <TableHead className="text-center">Yanlış</TableHead>
                      <TableHead className="text-center">Boş</TableHead>
                      <TableHead className="text-center">Net</TableHead>
                      <TableHead className="text-center">Başarı</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailExam.subjectResults?.map((subject) => {
                      const percentage =
                        subject.questionCount > 0
                          ? (subject.correct / subject.questionCount) * 100
                          : 0;

                      return (
                        <TableRow key={subject.subjectName}>
                          <TableCell className="font-medium">
                            {subject.subjectName}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {subject.questionCount}
                          </TableCell>
                          <TableCell className="text-center text-success">
                            {subject.correct}
                          </TableCell>
                          <TableCell className="text-center text-destructive">
                            {subject.wrong}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {subject.empty}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-mono">
                              {subject.net.toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                percentage >= 70
                                  ? "default"
                                  : percentage >= 50
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={cn(
                                percentage >= 70 && "bg-success/20 text-success"
                              )}
                            >
                              %{percentage.toFixed(0)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* BACKEND #3: topicResults.correct/questionNumbers artik DTO'da mevcut. */}
              {detailExam.subjectResults?.some(
                (s) => s.topicDetails?.length
              ) && (
                <div>
                  <h4 className="font-semibold mb-3">Konu Bazlı Analiz</h4>
                  <div className="space-y-2">
                    {detailExam.subjectResults
                      .filter((s) => s.topicDetails?.length)
                      .map((subject) => (
                        <Collapsible key={subject.subjectName}>
                          <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 rounded hover:bg-muted">
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-medium">
                              {subject.subjectName}
                            </span>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-6 space-y-1">
                            {subject.topicDetails?.map((topic, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between py-1 px-2 text-sm"
                              >
                                <span>
                                  {topic.topicName}
                                  {topic.subtopicName && ` - ${topic.subtopicName}`}
                                </span>
                                <div className="flex items-center gap-2">
                                  {topic.questionNumbers.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      Sorular: {topic.questionNumbers.join(", ")}
                                    </span>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {topic.correct}D / {topic.wrong}Y /{" "}
                                    {topic.empty}B
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sinavi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu sinavi silmek istediginize emin misiniz? Bu islem geri alinamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Iptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteExam.isPending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Ozet listede sections gelmedigi icin ders kirilimini detay endpoint'inden ceker
function ExamSubjectsInline({ examId }: { examId: string }) {
  const { data, isLoading } = useExamDetail(examId, true);
  const subjects = data?.subjectResults ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <p className="py-2 text-center text-sm text-muted-foreground">
        Ders detayı bulunamadı.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      {subjects.map((subject) => {
        const subjectPercentage =
          subject.questionCount > 0
            ? (subject.correct / subject.questionCount) * 100
            : 0;

        return (
          <div
            key={subject.subjectName}
            className="flex items-center gap-4 py-2 px-3 rounded-md bg-background"
          >
            <div className="w-40 font-medium text-sm truncate">
              {subject.subjectName}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <Progress value={subjectPercentage} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground w-12">
                %{subjectPercentage.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-success w-8 text-center">
                {subject.correct}
              </span>
              <span className="text-destructive w-8 text-center">
                {subject.wrong}
              </span>
              <span className="text-muted-foreground w-8 text-center">
                {subject.empty}
              </span>
              <Badge variant="outline" className="font-mono">
                {subject.net.toFixed(2)}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
