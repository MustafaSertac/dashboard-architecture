"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProfile, useUpdateProfile } from "@/modules/profile/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "sonner";
import { User, Mail, Phone, Shield, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading, isError, error, refetch } = useProfile(user?.id ?? "");
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<"0" | "1">("0");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
      setPhoneNumber(profile.phoneNumber ?? "");
      setGender(String(profile.gender ?? 0) as "0" | "1");
    }
  }, [profile]);

  const handleSubmit = () => {
    if (!user?.id) return;
    updateProfile.mutate(
      {
        userId: user.id,
        data: {
          name: name || undefined,
          email: email || undefined,
          phoneNumber: phoneNumber || undefined,
          gender: parseInt(gender) as 0 | 1,
        },
      },
      {
        onSuccess: () => {
          toast.success("Profil guncellendi");
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Profil guncellenemedi";
          toast.error(msg);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState error={error} title="Profil yuklenemedi" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground">Hesap bilgilerinizi yönetin.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hesap Bilgileri</CardTitle>
            <CardDescription>Profil bilgilerinizi güncelleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adinizi girin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi girin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Telefon numaranizi girin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Cinsiyet</Label>
              <Select value={gender} onValueChange={(v) => setGender(v as "0" | "1")}>
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Erkek</SelectItem>
                  <SelectItem value="1">Kadin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} disabled={updateProfile.isPending} className="w-full">
              {updateProfile.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Durum</CardTitle>
            <CardDescription>Hesap doğrulama durumunuz.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">E-posta</p>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
              <Badge variant={profile?.isVerified ? "default" : "secondary"}>
                {profile?.isVerified ? (
                  <ShieldCheck className="mr-1 size-3" />
                ) : (
                  <Shield className="mr-1 size-3" />
                )}
                {profile?.isVerified ? "Dogrulandi" : "Dogrulanmadi"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">KVK Dogrulama</p>
                  <p className="text-sm text-muted-foreground">Kisisel verilerin dogrulamasi</p>
                </div>
              </div>
              <Badge variant={profile?.isKvkVerified ? "default" : "secondary"}>
                {profile?.isKvkVerified ? (
                  <ShieldCheck className="mr-1 size-3" />
                ) : (
                  <Shield className="mr-1 size-3" />
                )}
                {profile?.isKvkVerified ? "Dogrulandi" : "Dogrulanmadi"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Rol</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === "student" ? "Ogrenci" : user?.role === "teacher" ? "Ogretmen" : "Admin"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
