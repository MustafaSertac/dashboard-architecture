import { StudentProvider } from "@/lib/student-context";
import { TeacherLayout } from "@/components/teacher/teacher-layout";

export default function TeacherRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentProvider>
      <TeacherLayout>{children}</TeacherLayout>
    </StudentProvider>
  );
}
