"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Giris basarisiz");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">EduCoach</h1>
          <p className="text-muted-foreground">Egitim Koçluk ve Analiz Platformu</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Giris Yap</CardTitle>
            <CardDescription>Hesabiniza giris yapin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@edu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Sifre</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sifrenizi girin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Giris yapiliyor...
                  </>
                ) : (
                  "Giris Yap"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Hesabiniz yok mu? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Kayit Ol
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="border-border/50 bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Demo Hesaplar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/50">
              <div>
                <span className="font-medium">Admin:</span>
                <span className="text-muted-foreground ml-2">admin@edu.com</span>
              </div>
              <span className="text-muted-foreground">admin123</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/50">
              <div>
                <span className="font-medium">Ogretmen:</span>
                <span className="text-muted-foreground ml-2">ahmet@edu.com</span>
              </div>
              <span className="text-muted-foreground">teacher123</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/50">
              <div>
                <span className="font-medium">Ogrenci:</span>
                <span className="text-muted-foreground ml-2">ali@edu.com</span>
              </div>
              <span className="text-muted-foreground">student123</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
