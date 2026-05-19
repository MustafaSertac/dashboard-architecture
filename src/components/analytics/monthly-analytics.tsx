"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, BookOpen, GitBranch, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMonthlyStats, mockMonthlyTopicStats } from "@/lib/mock-data";
import type { FilterStatus } from "@/lib/types";

interface MonthlyAnalyticsProps {
  studentId?: string;
}

export function MonthlyAnalytics({ studentId }: MonthlyAnalyticsProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
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

  const filteredStats = mockMonthlyStats.filter((stat) => {
    if (filterStatus === "completed") return stat.pendingCount === 0;
    if (filterStatus === "pending") return stat.pendingCount > 0;
    return true;
  });

  const totals = filteredStats.reduce(
    (acc, stat) => ({
      totalHours: acc.totalHours + stat.totalHours,
      totalQuestions: acc.totalQuestions + stat.totalQuestions,
      completedCount: acc.completedCount + stat.completedCount,
      pendingCount: acc.pendingCount + stat.pendingCount,
    }),
    { totalHours: 0, totalQuestions: 0, completedCount: 0, pendingCount: 0 }
  );

  // Calculate totals from topic stats
  const topicTotals = mockMonthlyTopicStats.reduce(
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
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Saat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.totalHours}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Soru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topicTotals.totalQuestions.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dogru Sayisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {(topicTotals.totalQuestions - topicTotals.totalMistakes).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yanlis Sayisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {topicTotals.totalMistakes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Basari orani:{" "}
              {(
                ((topicTotals.totalQuestions - topicTotals.totalMistakes) /
                  topicTotals.totalQuestions) *
                100
              ).toFixed(1)}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Switches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold">
            Konu Bazli Aylik Analiz
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="filter-completed-monthly"
                checked={filterStatus === "completed"}
                onCheckedChange={(checked) =>
                  setFilterStatus(checked ? "completed" : "all")
                }
              />
              <Label htmlFor="filter-completed-monthly" className="text-sm">
                Tamamlanan
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="filter-pending-monthly"
                checked={filterStatus === "pending"}
                onCheckedChange={(checked) =>
                  setFilterStatus(checked ? "pending" : "all")
                }
              />
              <Label htmlFor="filter-pending-monthly" className="text-sm">
                Bekleyen
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockMonthlyTopicStats.map((course) => {
              const isCourseExpanded = expandedCourses.includes(course.course);
              const courseTotalQuestions = course.branches.reduce(
                (sum, b) => sum + b.totalQuestions,
                0
              );
              const courseTotalMistakes = course.branches.reduce(
                (sum, b) => sum + b.totalMistakes,
                0
              );
              const courseSuccessRate =
                ((courseTotalQuestions - courseTotalMistakes) / courseTotalQuestions) * 100;

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
                        {courseTotalMistakes} yanlis
                      </Badge>
                      <Badge
                        variant={courseSuccessRate >= 80 ? "default" : "secondary"}
                        className="hidden sm:inline-flex"
                      >
                        %{courseSuccessRate.toFixed(0)}
                      </Badge>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    {course.branches.map((branch) => {
                      const branchKey = `${course.course}-${branch.branch}`;
                      const isBranchExpanded =
                        expandedBranches.includes(branchKey);
                      const branchSuccessRate =
                        ((branch.totalQuestions - branch.totalMistakes) /
                          branch.totalQuestions) *
                        100;

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
                                {branch.totalMistakes} yanlis
                              </Badge>
                              <Badge
                                variant={
                                  branchSuccessRate >= 80 ? "default" : "secondary"
                                }
                                className="text-xs hidden sm:inline-flex"
                              >
                                %{branchSuccessRate.toFixed(0)}
                              </Badge>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="ml-4 mt-1 space-y-1">
                            {branch.topics.map((topic) => {
                              const topicSuccessRate =
                                ((topic.questions - topic.mistakes) /
                                  topic.questions) *
                                100;

                              return (
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
                                      {topic.mistakes} yanlis
                                    </span>
                                    <Badge
                                      variant={
                                        topicSuccessRate >= 80
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      %{topicSuccessRate.toFixed(0)}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
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
