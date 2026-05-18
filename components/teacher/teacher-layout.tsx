"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks";
import { useStudentContext } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Users,
  Menu,
  ChevronRight,
  GraduationCap,
  LogOut,
  ArrowLeft,
  Calendar,
  CalendarDays,
  CalendarRange,
  BarChart3,
  FileText,
} from "lucide-react";

const teacherNavigation = [
  { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { name: "Ogrencilerim", href: "/teacher/students", icon: Users },
];

const studentDetailNavigation = [
  { name: "Gunluk", href: "daily", icon: Calendar },
  { name: "Haftalik", href: "weekly", icon: CalendarDays },
  { name: "Aylik", href: "monthly", icon: CalendarRange },
  { name: "Analiz", href: "analytics", icon: BarChart3 },
  { name: "Denemeler", href: "exams", icon: FileText },
];

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { selectedStudent } = useStudentContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if we're viewing a specific student
  const studentIdMatch = pathname.match(/\/teacher\/students\/([^/]+)/);
  const currentStudentId = studentIdMatch ? studentIdMatch[1] : null;
  const isViewingStudent = Boolean(currentStudentId);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayUser = user || { name: "Ogretmen", email: "teacher@edu.com", role: "teacher" as const };

  const NavContent = () => (
    <nav className="flex flex-col gap-1 p-3">
      {/* Main Teacher Navigation */}
      {teacherNavigation.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== "/teacher" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="size-5" />
            {item.name}
            {isActive && <ChevronRight className="ml-auto size-4" />}
          </Link>
        );
      })}

      {/* Student Detail Navigation (when viewing a student) */}
      {isViewingStudent && selectedStudent && (
        <>
          <div className="my-3 border-t" />
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Avatar className="size-6">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{selectedStudent.name}</span>
            </div>
          </div>
          {studentDetailNavigation.map((item) => {
            const fullHref = `/teacher/students/${currentStudentId}/${item.href}`;
            const isActive = pathname === fullHref;
            return (
              <Link
                key={item.name}
                href={fullHref}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ml-2",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.name}
              </Link>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 mx-3 justify-start text-muted-foreground"
            onClick={() => router.push("/teacher/students")}
          >
            <ArrowLeft className="mr-2 size-4" />
            Tum Ogrenciler
          </Button>
        </>
      )}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-semibold text-sidebar-foreground">EduCoach</span>
              <span className="ml-1.5 text-xs text-muted-foreground">Teacher</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <NavContent />
          </div>
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-start gap-3 px-3 py-2"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {displayUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{displayUser.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {displayUser.role}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{displayUser.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="size-4" />
                  <span className="ml-2">Cikis Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center gap-2 border-b border-border px-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                    <GraduationCap className="size-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-semibold">EduCoach</span>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold">EduCoach</span>
              <span className="text-xs text-muted-foreground">Teacher</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {displayUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{displayUser.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="size-4" />
                  <span className="ml-2">Cikis Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden h-16 items-center justify-between border-b border-border bg-background px-6 lg:flex">
          {isViewingStudent && selectedStudent && (
            <div className="flex items-center gap-2 text-sm">
              <Link href="/teacher/students" className="text-muted-foreground hover:text-foreground">
                Ogrenciler
              </Link>
              <ChevronRight className="size-4 text-muted-foreground" />
              <span className="font-medium">{selectedStudent.name}</span>
            </div>
          )}
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
