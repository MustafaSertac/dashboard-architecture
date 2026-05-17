"use client";

import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

export function RecentExamsCard() {
  const { examResults, currentUser } = useApp();
  
  const recentExams = examResults
    .filter((e) => e.studentId === currentUser.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Son Denemeler</CardTitle>
      </CardHeader>
      <CardContent>
        {recentExams.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henuz deneme sonucu yok.</p>
        ) : (
          <div className="space-y-3">
            {recentExams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={exam.examType === "TYT" ? "default" : "secondary"}>
                    {exam.examType}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">
                      {format(parseISO(exam.date), "d MMMM", { locale: tr })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      D: {exam.totalCorrect} Y: {exam.totalWrong} B: {exam.totalEmpty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{exam.totalNet.toFixed(1)}</p>
                  <Badge
                    variant={exam.analysisCompleted ? "outline" : "secondary"}
                    className={exam.analysisCompleted ? "border-green-500 text-green-500" : ""}
                  >
                    {exam.analysisCompleted ? "Analiz Tamam" : "Bekliyor"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
