"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import type { ExamType, ExamResult } from "@/lib/types";
import { TYT_SUBJECTS, AYT_SUBJECTS, TOPICS_BY_SUBJECT } from "@/lib/types";

interface ExamInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId?: string;
}

export function ExamInputModal({ open, onOpenChange, studentId }: ExamInputModalProps) {
  const { addExamResult, currentUser } = useApp();

  const targetStudentId = studentId || currentUser.id;
  const [examType, setExamType] = useState<ExamType>("TYT");
  const [inputMode, setInputMode] = useState<"global" | "detailed">("global");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [empty, setEmpty] = useState("");

  const subjects = examType === "TYT" ? TYT_SUBJECTS : AYT_SUBJECTS;

  const handleSubmit = () => {
    const correctNum = parseInt(correct) || 0;
    const wrongNum = parseInt(wrong) || 0;
    const emptyNum = parseInt(empty) || 0;
    const net = correctNum - wrongNum * 0.25;

    const newResult: ExamResult = {
      id: Date.now().toString(),
      studentId: targetStudentId,
      date,
      examType,
      correct: correctNum,
      wrong: wrongNum,
      empty: emptyNum,
      net,
      analysisCompleted: false,
    };

    addExamResult(newResult);
    toast.success("Deneme sonucu eklendi");
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setCorrect("");
    setWrong("");
    setEmpty("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Deneme Sonucu Ekle</DialogTitle>
          <DialogDescription>
            Deneme sonuclarinizi girin ve analiz icin kaydedin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="examType">Sinav Turu</Label>
              <Select
                value={examType}
                onValueChange={(v) => setExamType(v as ExamType)}
              >
                <SelectTrigger id="examType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TYT">TYT</SelectItem>
                  <SelectItem value="AYT">AYT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="inputMode"
              checked={inputMode === "detailed"}
              onCheckedChange={(checked) =>
                setInputMode(checked ? "detailed" : "global")
              }
            />
            <Label htmlFor="inputMode">Detayli giris (konu bazli)</Label>
          </div>

          <Tabs value={inputMode} className="w-full">
            <TabsContent value="global" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="correct">Dogru</Label>
                  <Input
                    id="correct"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="wrong">Yanlis</Label>
                  <Input
                    id="wrong"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={wrong}
                    onChange={(e) => setWrong(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="empty">Bos</Label>
                  <Input
                    id="empty"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={empty}
                    onChange={(e) => setEmpty(e.target.value)}
                  />
                </div>
              </div>
              {correct && (
                <div className="rounded-lg bg-muted p-3 text-center">
                  <span className="text-sm text-muted-foreground">Net: </span>
                  <span className="text-lg font-bold">
                    {((parseInt(correct) || 0) - (parseInt(wrong) || 0) * 0.25).toFixed(2)}
                  </span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Konu bazli giris secildi. Her ders icin ayri ayri soru sayilarini
                girebilirsiniz.
              </p>
              <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border p-3">
                {subjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{subject}</span>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="D"
                        className="w-16"
                      />
                      <Input
                        type="number"
                        min="0"
                        placeholder="Y"
                        className="w-16"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Iptal
          </Button>
          <Button onClick={handleSubmit}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
