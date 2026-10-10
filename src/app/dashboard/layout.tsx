import { DashboardLayout } from "@/components/dashboard-layout";
import { TaskViewDateProvider } from "@/lib/task-view-date-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <TaskViewDateProvider>{children}</TaskViewDateProvider>
    </DashboardLayout>
  );
}
