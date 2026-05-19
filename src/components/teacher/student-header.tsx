"use client";

import { User } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDays, CalendarRange, BarChart3, FileText } from "lucide-react";

interface StudentHeaderProps {
  student: User | null;
  viewType: "daily" | "weekly" | "monthly" | "analytics" | "exams";
}

const viewConfig = {
  daily: {
    icon: Calendar,
    title: "Gunluk Takip",
    description: "Gunluk gorevler ve ilerleme",
  },
  weekly: {
    icon: CalendarDays,
    title: "Haftalik Takip",
    description: "Haftalik gorev takvimi",
  },
  monthly: {
    icon: CalendarRange,
    title: "Aylik Takip",
    description: "Aylik performans ozeti",
  },
  analytics: {
    icon: BarChart3,
    title: "Analizler",
    description: "Detayli performans analizi",
  },
  exams: {
    icon: FileText,
    title: "Deneme Sonuclari",
    description: "Deneme sinavi analizleri",
  },
};

export function StudentHeader({ student, viewType }: StudentHeaderProps) {
  if (!student) return null;

  const config = viewConfig[viewType];
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            <Badge variant="outline" className="text-xs">
              Ogrenci
            </Badge>
          </div>
          <p className="text-muted-foreground">{student.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2">
        <Icon className="size-5 text-primary" />
        <div>
          <p className="font-medium">{config.title}</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
      </div>
    </div>
  );
}
