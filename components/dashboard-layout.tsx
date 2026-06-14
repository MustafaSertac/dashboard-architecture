"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  FileText,
  ListTodo,
  BarChart3,
  Menu,
  ChevronRight,
  GraduationCap,
  Users,
  Shield,
  LogOut,
} from "lucide-react";
import { UserRole } from "@/lib/types";

const navigation = [
  { name: "Ana Sayfa", href: "/dashboard", icon: LayoutDashboard },
  { name: "Deneme Analiz", href: "/dashboard/exams", icon: FileText },
  { name: "Görevler", href: "/dashboard/tasks", icon: ListTodo },
  { name: "Analizler", href: "/dashboard/analytics", icon: BarChart3 },
];

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="size-4" />,
  teacher: <Users className="size-4" />,
  student: <GraduationCap className="size-4" />,
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchRole } = useApp();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayUser = user || currentUser;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const NavContent = () => (
    <nav className="flex flex-col gap-1 p-3">
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
                <DropdownMenuLabel>Rol Degistir</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(["admin", "teacher", "student"] as UserRole[]).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => switchRole(role)}
                    className={cn(displayUser.role === role && "bg-accent")}
                  >
                    {roleIcons[role]}
                    <span className="ml-2 capitalize">{role}</span>
                  </DropdownMenuItem>
                ))}
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
            <span className="text-lg font-semibold">EduCoach</span>
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
                {(["admin", "teacher", "student"] as UserRole[]).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => switchRole(role)}
                    className={cn(displayUser.role === role && "bg-accent")}
                  >
                    {roleIcons[role]}
                    <span className="ml-2 capitalize">{role}</span>
                  </DropdownMenuItem>
                ))}
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
        <header className="hidden h-16 items-center justify-end border-b border-border bg-background px-6 lg:flex">
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
