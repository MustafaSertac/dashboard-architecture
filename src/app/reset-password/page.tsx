"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { verifyResetToken, resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const valid = await verifyResetToken(token);
      if (!cancelled) {
        setIsValid(valid);
        setIsVerifying(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, verifyResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Sifreler eslesmiyor");
      return;
    }

    if (newPassword.length < 6) {
      setError("Sifre en az 6 karakter olmalidir");
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(token, newPassword);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || "Sifre sifirlama basarisiz");
    }

    setIsSubmitting(false);
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Baglanti dogrulaniyor...</p>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Sifirlama baglantisi gecersiz veya suresi dolmus. Lutfen yeni bir
          baglanti isteyin.
        </p>
        <Link href="/forgot-password" className="text-primary hover:underline text-sm">
          Yeni baglanti iste
        </Link>
      </div>
    );
  }

  return (
    <>
      {isSuccess ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-sm text-muted-foreground">
              Sifreniz basariyla guncellendi. Yeni sifrenizle giris
              yapabilirsiniz.
            </p>
          </div>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Girise Don
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Yeni Sifre</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="En az 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Yeni Sifre Tekrar</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Yeni sifrenizi tekrar girin"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sifre sifirlaniyor...
              </>
            ) : (
              "Sifreyi Sifirla"
            )}
          </Button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">NetKoç</h1>
          <p className="text-muted-foreground">Yeni sifrenizi belirleyin</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sifre Sifirla</CardTitle>
            <CardDescription>Yeni sifrenizi olusturun</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex flex-col items-center gap-3 py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
