"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Check, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import type { ExamType, ExamResult, SubjectResult, TopicDetail } from "@/lib/types";
import { getExamConfig, getTotalQuestions, type SubjectConfig } from "@/lib/exam-config";
import { cn } from "@/lib/utils";

interface ExamInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId?: string;
}

interface SubjectInput {
  correct: string;
  wrong: string;
  empty: string;
  topicDetails: TopicDetailInput[];
}

interface TopicDetailInput {
  topicName: string;
  subtopicName?: string;
  questionNumbers: string;
  correct: string;
  wrong: string;
  empty: string;
}

export function ExamInputModal({ open, onOpenChange, studentId }: ExamInputModalProps) {
  const { addExamResult, currentUser } = useApp();
  const targetStudentId = studentId || currentUser.id;

  const [examType, setExamType] = useState<ExamType>("TYT");
  const [examName, setExamName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showTopicDetails, setShowTopicDetails] = useState(false);
  const [subjectInputs, setSubjectInputs] = useState<Record<string, SubjectInput>>({});
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const examConfig = useMemo(() => getExamConfig(examType), [examType]);
  const totalQuestions = useMemo(() => getTotalQuestions(examType), [examType]);

  // Toplam değerleri hesapla
  const totals = useMemo(() => {
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalEmpty = 0;

    examConfig.forEach((subject) => {
      const input = subjectInputs[subject.name];
      if (input) {
        totalCorrect += parseInt(input.correct) || 0;
        totalWrong += parseInt(input.wrong) || 0;
        totalEmpty += parseInt(input.empty) || 0;
      }
    });

    const totalNet = totalCorrect - totalWrong * 0.25;
    return { totalCorrect, totalWrong, totalEmpty, totalNet };
  }, [subjectInputs, examConfig]);

  // Ders için giriş kontrolü
  const getSubjectValidation = (subject: SubjectConfig) => {
    const input = subjectInputs[subject.name];
    if (!input) return { valid: false, total: 0, message: "Giriş yapılmadı" };

    const correct = parseInt(input.correct) || 0;
    const wrong = parseInt(input.wrong) || 0;
    const empty = parseInt(input.empty) || 0;
    const total = correct + wrong + empty;

    if (total === 0) return { valid: false, total: 0, message: "Giriş yapılmadı" };
    if (total !== subject.questionCount) {
      return {
        valid: false,
        total,
        message: `Toplam ${total}/${subject.questionCount} (${subject.questionCount - total} eksik)`,
      };
    }
    return { valid: true, total, message: "Tamam" };
  };

  // Tüm dersler girildi mi kontrolü
  const allSubjectsValid = useMemo(() => {
    return examConfig.every((subject) => getSubjectValidation(subject).valid);
  }, [examConfig, subjectInputs]);

  // Ders girişini güncelle
  const updateSubjectInput = (
    subjectName: string,
    field: "correct" | "wrong" | "empty",
    value: string
  ) => {
    setSubjectInputs((prev) => ({
      ...prev,
      [subjectName]: {
        ...prev[subjectName],
        correct: prev[subjectName]?.correct || "",
        wrong: prev[subjectName]?.wrong || "",
        empty: prev[subjectName]?.empty || "",
        topicDetails: prev[subjectName]?.topicDetails || [],
        [field]: value,
      },
    }));
  };

  // Konu detayı ekle/güncelle
  const updateTopicDetail = (
    subjectName: string,
    topicName: string,
    subtopicName: string | undefined,
    field: "questionNumbers" | "correct" | "wrong" | "empty",
    value: string
  ) => {
    setSubjectInputs((prev) => {
      const subject = prev[subjectName] || {
        correct: "",
        wrong: "",
        empty: "",
        topicDetails: [],
      };
      const existingIndex = subject.topicDetails.findIndex(
        (t) => t.topicName === topicName && t.subtopicName === subtopicName
      );

      let newTopicDetails: TopicDetailInput[];
      if (existingIndex >= 0) {
        newTopicDetails = [...subject.topicDetails];
        newTopicDetails[existingIndex] = {
          ...newTopicDetails[existingIndex],
          [field]: value,
        };
      } else {
        newTopicDetails = [
          ...subject.topicDetails,
          {
            topicName,
            subtopicName,
            questionNumbers: "",
            correct: "",
            wrong: "",
            empty: "",
            [field]: value,
          },
        ];
      }

      return {
        ...prev,
        [subjectName]: {
          ...subject,
          topicDetails: newTopicDetails,
        },
      };
    });
  };

  // Sınav türü değiştiğinde inputları sıfırla
  const handleExamTypeChange = (newType: ExamType) => {
    setExamType(newType);
    setSubjectInputs({});
    setExpandedSubject(null);
  };

  // Formu gönder
  const handleSubmit = () => {
    if (!allSubjectsValid) {
      toast.error("Lütfen tüm dersleri eksiksiz doldurun");
      return;
    }

    const subjectResults: SubjectResult[] = examConfig.map((subject) => {
      const input = subjectInputs[subject.name];
      const correct = parseInt(input.correct) || 0;
      const wrong = parseInt(input.wrong) || 0;
      const empty = parseInt(input.empty) || 0;
      const net = correct - wrong * 0.25;

      // Konu detaylarını dönüştür
      const topicDetails: TopicDetail[] = input.topicDetails
        .filter((t) => t.questionNumbers || t.correct || t.wrong || t.empty)
        .map((t) => ({
          topicName: t.topicName,
          subtopicName: t.subtopicName,
          questionNumbers: t.questionNumbers
            .split(",")
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n)),
          correct: parseInt(t.correct) || 0,
          wrong: parseInt(t.wrong) || 0,
          empty: parseInt(t.empty) || 0,
        }));

      return {
        subjectName: subject.name,
        questionCount: subject.questionCount,
        correct,
        wrong,
        empty,
        net,
        topicDetails: topicDetails.length > 0 ? topicDetails : undefined,
      };
    });

    const newResult: ExamResult = {
      id: Date.now().toString(),
      studentId: targetStudentId,
      date,
      examType,
      examName: examName || undefined,
      totalCorrect: totals.totalCorrect,
      totalWrong: totals.totalWrong,
      totalEmpty: totals.totalEmpty,
      totalNet: totals.totalNet,
      subjectResults,
      analysisCompleted: showTopicDetails,
    };

    addExamResult(newResult);
    toast.success("Deneme sonucu başarıyla eklendi");
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSubjectInputs({});
    setDate(new Date().toISOString().split("T")[0]);
    setExamName("");
    setShowTopicDetails(false);
    setExpandedSubject(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Deneme Sonucu Ekle</DialogTitle>
          <DialogDescription>
            {examType} sınavı için tüm derslerin sonuçlarını girin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Üst Bilgiler */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="examType">Sınav Türü</Label>
              <Select
                value={examType}
                onValueChange={(v) => handleExamTypeChange(v as ExamType)}
              >
                <SelectTrigger id="examType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TYT">TYT (120 Soru)</SelectItem>
                  <SelectItem value="AYT">AYT (160 Soru)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="examName">Sınav Adı (Opsiyonel)</Label>
              <Input
                id="examName"
                placeholder="Örn: ÖSYM 2024 Deneme 1"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>
          </div>

          {/* Detaylı Giriş Toggle */}
          <div className="flex items-center gap-2 py-2 border-y">
            <Switch
              id="topicDetails"
              checked={showTopicDetails}
              onCheckedChange={setShowTopicDetails}
            />
            <Label htmlFor="topicDetails" className="text-sm">
              Detaylı konu analizi yap (hangi konudan hangi sorular geldi)
            </Label>
          </div>

          {/* Ders Listesi */}
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-2 pb-4">
              {examConfig.map((subject) => {
                const validation = getSubjectValidation(subject);
                const isExpanded = expandedSubject === subject.name;
                const input = subjectInputs[subject.name];
                const subjectNet =
                  (parseInt(input?.correct || "0") || 0) -
                  (parseInt(input?.wrong || "0") || 0) * 0.25;

                return (
                  <div
                    key={subject.name}
                    className={cn(
                      "border rounded-lg overflow-hidden transition-colors",
                      validation.valid
                        ? "border-success/50 bg-success/5"
                        : "border-border"
                    )}
                  >
                    {/* Ders Başlığı ve Özet Giriş */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{subject.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {subject.questionCount} soru
                          </Badge>
                          {validation.valid ? (
                            <Badge
                              variant="secondary"
                              className="bg-success/20 text-success text-xs"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Net: {subjectNet.toFixed(2)}
                            </Badge>
                          ) : validation.total > 0 ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {validation.message}
                            </Badge>
                          ) : null}
                        </div>
                        {showTopicDetails && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedSubject(isExpanded ? null : subject.name)
                            }
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            Konular
                          </Button>
                        )}
                      </div>

                      {/* Ana Giriş Alanları */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Doğru
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max={subject.questionCount}
                            placeholder="0"
                            value={input?.correct || ""}
                            onChange={(e) =>
                              updateSubjectInput(
                                subject.name,
                                "correct",
                                e.target.value
                              )
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Yanlış
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max={subject.questionCount}
                            placeholder="0"
                            value={input?.wrong || ""}
                            onChange={(e) =>
                              updateSubjectInput(
                                subject.name,
                                "wrong",
                                e.target.value
                              )
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Boş
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max={subject.questionCount}
                            placeholder="0"
                            value={input?.empty || ""}
                            onChange={(e) =>
                              updateSubjectInput(
                                subject.name,
                                "empty",
                                e.target.value
                              )
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Konu Detayları (Genişletilebilir) */}
                    {showTopicDetails && isExpanded && (
                      <div className="border-t bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground mb-3">
                          Her konu için hangi soru numaralarının geldiğini ve
                          doğru/yanlış sayılarını girebilirsiniz.
                        </p>
                        <Accordion type="multiple" className="space-y-1">
                          {subject.topics.map((topic) => (
                            <AccordionItem
                              key={topic.name}
                              value={topic.name}
                              className="border rounded bg-background"
                            >
                              <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
                                {topic.name}
                              </AccordionTrigger>
                              <AccordionContent className="px-3 pb-3">
                                <div className="space-y-2">
                                  {topic.subtopics.map((subtopic) => {
                                    const detail = input?.topicDetails?.find(
                                      (t) =>
                                        t.topicName === topic.name &&
                                        t.subtopicName === subtopic
                                    );
                                    return (
                                      <div
                                        key={subtopic}
                                        className="grid grid-cols-5 gap-2 items-center text-xs"
                                      >
                                        <span className="col-span-1 truncate">
                                          {subtopic}
                                        </span>
                                        <Input
                                          placeholder="Soru No (1,5,12)"
                                          value={detail?.questionNumbers || ""}
                                          onChange={(e) =>
                                            updateTopicDetail(
                                              subject.name,
                                              topic.name,
                                              subtopic,
                                              "questionNumbers",
                                              e.target.value
                                            )
                                          }
                                          className="h-7 text-xs"
                                        />
                                        <Input
                                          type="number"
                                          placeholder="D"
                                          min="0"
                                          value={detail?.correct || ""}
                                          onChange={(e) =>
                                            updateTopicDetail(
                                              subject.name,
                                              topic.name,
                                              subtopic,
                                              "correct",
                                              e.target.value
                                            )
                                          }
                                          className="h-7 text-xs"
                                        />
                                        <Input
                                          type="number"
                                          placeholder="Y"
                                          min="0"
                                          value={detail?.wrong || ""}
                                          onChange={(e) =>
                                            updateTopicDetail(
                                              subject.name,
                                              topic.name,
                                              subtopic,
                                              "wrong",
                                              e.target.value
                                            )
                                          }
                                          className="h-7 text-xs"
                                        />
                                        <Input
                                          type="number"
                                          placeholder="B"
                                          min="0"
                                          value={detail?.empty || ""}
                                          onChange={(e) =>
                                            updateTopicDetail(
                                              subject.name,
                                              topic.name,
                                              subtopic,
                                              "empty",
                                              e.target.value
                                            )
                                          }
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Toplam Özet */}
          <div className="rounded-lg bg-muted p-4 border-t">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">
                  {totals.totalCorrect}
                </div>
                <div className="text-xs text-muted-foreground">Doğru</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {totals.totalWrong}
                </div>
                <div className="text-xs text-muted-foreground">Yanlış</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {totals.totalEmpty}
                </div>
                <div className="text-xs text-muted-foreground">Boş</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {totals.totalCorrect + totals.totalWrong + totals.totalEmpty}/
                  {totalQuestions}
                </div>
                <div className="text-xs text-muted-foreground">Cevaplanan</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {totals.totalNet.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Toplam Net</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={!allSubjectsValid}>
            {allSubjectsValid ? "Kaydet" : "Tüm Dersleri Doldurun"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
