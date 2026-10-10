"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { StudyTimerWidget } from "@/components/study/study-timer-widget";
import {
  LayoutDashboard,
  FileText,
  ListTodo,
  BarChart3,
  Menu,
  ChevronRight,
  GraduationCap,
  LogOut,
  User,
} from "lucide-react";

const navigation = [
  { name: "Ana Sayfa", href: "/dashboard", icon: LayoutDashboard },
  { name: "Deneme Analiz", href: "/dashboard/exams", icon: FileText },
  { name: "Görevler", href: "/dashboard/tasks", icon: ListTodo },
  { name: "Analizler", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Profil", href: "/dashboard/profile", icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayUser = user ?? {
    name: "Kullanici",
    role: "student",
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const AccountSection = () => (
    <div className="border-t border-sidebar-border p-4">
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 px-3 py-2 text-destructive hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="size-4" />
        <span>Çıkış Yap</span>
      </Button>
    </div>
  );

  const NavContent = () => (
    <nav className="flex flex-col gap-1 p-3">
      {navigation.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/");
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
            <span className="text-lg font-semibold text-sidebar-foreground">EduCoach</span>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <NavContent />
          </div>
          <AccountSection />
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
                <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                <SheetDescription className="sr-only">
                  Ana sayfa, deneme analiz, görevler, analizler ve profil bağlantıları
                </SheetDescription>
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center gap-2 border-b border-border px-4">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                      <GraduationCap className="size-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-semibold">EduCoach</span>
                  </div>
                  <div className="flex-1 overflow-y-auto py-4">
                    <NavContent />
                  </div>
                  <AccountSection />
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-lg font-semibold">EduCoach</span>
          </div>
          <div className="flex items-center gap-2">
            <StudyTimerWidget />
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
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="size-4" />
                    <span className="ml-2">Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="size-4" />
                  <span className="ml-2">Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden h-16 items-center justify-end gap-3 border-b border-border bg-background px-6 lg:flex">
          <StudyTimerWidget />
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
