import { TeacherLayout } from "@/components/teacher/teacher-layout";

export default function TeacherRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherLayout>{children}</TeacherLayout>;
}
