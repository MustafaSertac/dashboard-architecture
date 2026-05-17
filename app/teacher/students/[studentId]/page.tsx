"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  useEffect(() => {
    // Redirect to daily view by default
    router.replace(`/teacher/students/${studentId}/daily`);
  }, [studentId, router]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-pulse text-muted-foreground">Yonlendiriliyor...</div>
    </div>
  );
}
