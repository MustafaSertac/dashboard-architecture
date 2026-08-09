"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, BookOpen, GitBranch, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockYearlyStats } from "@/lib/mock/mock-data";

interface YearlyAnalyticsProps {
  studentId?: string;
}

export function YearlyAnalytics({ studentId }: YearlyAnalyticsProps) {
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);
  const [expandedBranches, setExpandedBranches] = useState<string[]>([]);

  const toggleCourse = (course: string) => {
    setExpandedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const toggleBranch = (branchKey: string) => {
    setExpandedBranches((prev) =>
      prev.includes(branchKey)
        ? prev.filter((b) => b !== branchKey)
        : [...prev, branchKey]
    );
  };

  // Calculate totals
  const totalStats = mockYearlyStats.reduce(
    (acc, course) => {
      course.branches.forEach((branch) => {
        acc.totalQuestions += branch.totalQuestions;
        acc.totalMistakes += branch.totalMistakes;
      });
      return acc;
    },
    { totalQuestions: 0, totalMistakes: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Çözülen Soru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.totalQuestions.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Yanlış Soru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {totalStats.totalMistakes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Başarı oranı:{" "}
              {(
                ((totalStats.totalQuestions - totalStats.totalMistakes) /
                  totalStats.totalQuestions) *
                100
              ).toFixed(1)}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tree Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Konu Bazlı Yıllık Analiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockYearlyStats.map((course) => {
              const isCourseExpanded = expandedCourses.includes(course.course);
              const courseTotalQuestions = course.branches.reduce(
                (sum, b) => sum + b.totalQuestions,
                0
              );
              const courseTotalMistakes = course.branches.reduce(
                (sum, b) => sum + b.totalMistakes,
                0
              );

              return (
                <Collapsible
                  key={course.course}
                  open={isCourseExpanded}
                  onOpenChange={() => toggleCourse(course.course)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform",
                          isCourseExpanded && "rotate-90"
                        )}
                      />
                      <BookOpen className="size-5 text-primary" />
                      <span className="font-medium">{course.course}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        {courseTotalQuestions} soru
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-destructive/50 text-destructive"
                      >
                        {courseTotalMistakes} yanlış
                      </Badge>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    {course.branches.map((branch) => {
                      const branchKey = `${course.course}-${branch.branch}`;
                      const isBranchExpanded =
                        expandedBranches.includes(branchKey);

                      return (
                        <Collapsible
                          key={branchKey}
                          open={isBranchExpanded}
                          onOpenChange={() => toggleBranch(branchKey)}
                        >
                          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-muted/50 p-3 text-left transition-colors hover:bg-muted">
                            <div className="flex items-center gap-3">
                              <ChevronRight
                                className={cn(
                                  "size-4 transition-transform",
                                  isBranchExpanded && "rotate-90"
                                )}
                              />
                              <GitBranch className="size-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {branch.branch}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs">
                                {branch.totalQuestions} soru
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs border-destructive/50 text-destructive"
                              >
                                {branch.totalMistakes} yanlış
                              </Badge>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            {branch.topics.map((topic) => (
                              <div
                                key={topic.name}
                                className="flex items-center justify-between rounded-lg border bg-background p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="size-4 text-muted-foreground" />
                                  <span className="text-sm">{topic.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-muted-foreground">
                                    {topic.questions} soru
                                  </span>
                                  <span className="text-xs text-destructive">
                                    {topic.mistakes} yanlış
                                  </span>
                                  <Badge
                                    variant={
                                      (topic.questions - topic.mistakes) /
                                        topic.questions >=
                                      0.8
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {(
                                      ((topic.questions - topic.mistakes) /
                                        topic.questions) *
                                      100
                                    ).toFixed(0)}
                                    %
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
