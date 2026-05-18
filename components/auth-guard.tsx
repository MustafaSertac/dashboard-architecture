"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

const PUBLIC_PATHS = ["/login", "/register"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = PUBLIC_PATHS.includes(pathname);

      if (!user && !isPublicPath) {
        router.push("/login");
      } else if (user && isPublicPath) {
        // Redirect based on role
        if (user.role === "teacher" || user.role === "admin") {
          router.push("/teacher");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Yukleniyor...</p>
        </div>
      </div>
    );
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Allow public pages without auth, or private pages with auth
  if ((isPublicPath && !user) || (!isPublicPath && user) || isPublicPath) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Yonlendiriliyor...</p>
      </div>
    </div>
  );
}
