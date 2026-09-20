"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setIsSent(true);
    } else {
      setError(result.error || "Sifre sifirlama istegi basarisiz");
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
          <h1 className="text-2xl font-bold text-foreground">NetKoç</h1>
          <p className="text-muted-foreground">Sifrenizi sifirlayin</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sifremi Unuttum</CardTitle>
            <CardDescription>
              {isSent
                ? "Sifirlama baglantisi gonderildi"
                : "E-posta adresinizi girin, size sifirlama baglantisi gonderelim"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSent ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <MailCheck className="w-12 h-12 text-green-500" />
                  <p className="text-sm text-muted-foreground">
                    {email} adresine sifre sifirlama baglantisi gonderildi.
                    Lutfen gelen kutunuzu kontrol edin. Baglanti 30 dakika
                    gecerlidir.
                  </p>
                </div>
                <Link href="/login" className="block">
                  <Button className="w-full">Girise Don</Button>
                </Link>
              </div>
            ) : (
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

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gonderiliyor...
                    </>
                  ) : (
                    "Sifirlama Baglantisi Gonder"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Girise don
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
