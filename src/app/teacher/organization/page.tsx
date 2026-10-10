"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Building2, Copy, Loader2, Plus, Ticket, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCreateOrganization,
  useGenerateStudentCode,
  useGenerateTeacherCode,
  useJoinOrganization,
  useMyOrganization,
  useOrganizationTeachers,
  useUpdateVisibility,
} from "@/modules/organizations/hooks/useOrganizations";
import type { RegistrationCodeDTO } from "@/modules/organizations/types/organization.types";

export default function TeacherOrganizationPage() {
  const { data: myOrg, isLoading, isError, error, refetch } = useMyOrganization();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Organizasyon bilgisi yuklenemedi"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organizasyon</h1>
        <p className="text-muted-foreground">
          Organizasyon olustur veya bir kod ile katil; ogrenci/ogretmen davet kodlari uret.
        </p>
      </div>

      {myOrg ? (
        <OrganizationOverview
          organizationId={myOrg.organization.id}
          name={myOrg.organization.name}
          canViewAllStudents={myOrg.canViewAllStudents}
        />
      ) : (
        <NoOrganization />
      )}
    </div>
  );
}

function NoOrganization() {
  const createOrg = useCreateOrganization();
  const joinOrg = useJoinOrganization();
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Organizasyon adi gerekli");
      return;
    }
    createOrg.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success("Organizasyon olusturuldu");
          setName("");
        },
        onError: (err: unknown) =>
          toast.error(err instanceof Error ? err.message : "Olusturulamadi"),
      }
    );
  };

  const handleJoin = () => {
    if (joinCode.trim().length !== 8) {
      toast.error("8 haneli katilim kodu girin");
      return;
    }
    joinOrg.mutate(
      { code: joinCode.trim().toUpperCase() },
      {
        onSuccess: () => {
          toast.success("Organizasyona katildiniz");
          setJoinCode("");
        },
        onError: (err: unknown) =>
          toast.error(err instanceof Error ? err.message : "Katilamadi"),
      }
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" /> Organizasyon Olustur
          </CardTitle>
          <CardDescription>
            Olusturunca otomatik uye olursunuz; tum ogrencileri gorme yetkiniz acilir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organizasyon Adi</Label>
            <Input
              id="orgName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Orn: NetKoc Akademi"
            />
          </div>
          <Button onClick={handleCreate} disabled={createOrg.isPending}>
            {createOrg.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            Olustur
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="size-4" /> Kodla Katil
          </CardTitle>
          <CardDescription>
            Organizasyon yoneticisinden aldiginiz 8 haneli katilim kodunu girin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="joinCode">Katilim Kodu</Label>
            <Input
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={8}
              placeholder="8 haneli kod"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleJoin}
            disabled={joinOrg.isPending}
          >
            {joinOrg.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Katil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function OrganizationOverview({
  organizationId,
  name,
  canViewAllStudents,
}: {
  organizationId: string;
  name: string;
  canViewAllStudents: boolean;
}) {
  const updateVisibility = useUpdateVisibility();
  const teachers = useOrganizationTeachers(organizationId);
  const generateStudent = useGenerateStudentCode(organizationId);
  const generateTeacher = useGenerateTeacherCode(organizationId);
  const [lastCode, setLastCode] = useState<RegistrationCodeDTO | null>(null);
  const [codeLabel, setCodeLabel] = useState("");

  const handleVisibility = (checked: boolean) => {
    updateVisibility.mutate(
      { canViewAllStudents: checked },
      {
        onSuccess: () =>
          toast.success(
            checked
              ? "Tum organizasyon ogrencilerini goreceksiniz"
              : "Yalnizca kendi ogrencilerinizi goreceksiniz"
          ),
        onError: (err: unknown) =>
          toast.error(err instanceof Error ? err.message : "Guncellenemedi"),
      }
    );
  };

  const handleGenerate = (
    kind: "student" | "teacher"
  ) => {
    const mutation = kind === "student" ? generateStudent : generateTeacher;
    mutation.mutate(
      { expiresInDays: 7 },
      {
        onSuccess: (code) => {
          setLastCode(code);
          setCodeLabel(
            kind === "student" ? "Ogrenci Kayit Kodu" : "Ogretmen Katilim Kodu"
          );
          toast.success("Kod olusturuldu");
        },
        onError: (err: unknown) =>
          toast.error(err instanceof Error ? err.message : "Kod uretilemedi"),
      }
    );
  };

  const copyCode = async () => {
    if (!lastCode) return;
    try {
      await navigator.clipboard.writeText(lastCode.code);
      toast.success("Kod kopyalandi");
    } catch {
      toast.error("Kopyalanamadi");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4" /> {name}
            </CardTitle>
            <CardDescription>Organizasyon uyesi olarak baglisiniz.</CardDescription>
          </div>
          <Badge variant="secondary">Aktif</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Tum ogrencileri gor</p>
              <p className="text-xs text-muted-foreground">
                Kapaliysa yalnizca kendi ogrencilerinizi gorursunuz.
              </p>
            </div>
            <Switch
              checked={canViewAllStudents}
              onCheckedChange={handleVisibility}
              disabled={updateVisibility.isPending}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleGenerate("student")}
              disabled={generateStudent.isPending}
            >
              {generateStudent.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              <Ticket className="mr-2 size-4" />
              Ogrenci Kodu Uret
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGenerate("teacher")}
              disabled={generateTeacher.isPending}
            >
              {generateTeacher.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              <UserPlus className="mr-2 size-4" />
              Ogretmen Katilim Kodu Uret
            </Button>
          </div>

          {lastCode && (
            <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
              <div>
                <p className="text-xs text-muted-foreground">{codeLabel}</p>
                <p className="font-mono text-lg font-bold tracking-widest">
                  {lastCode.code}
                </p>
                <p className="text-xs text-muted-foreground">
                  Son gecerlilik:{" "}
                  {format(parseISO(lastCode.expiresAt), "d MMMM yyyy HH:mm", {
                    locale: tr,
                  })}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={copyCode} aria-label="Kopyala">
                <Copy className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organizasyon Ogretmenleri</CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (teachers.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Henuz ogretmen yok.</p>
          ) : (
            <div className="space-y-2">
              {teachers.data!.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.email}</p>
                  </div>
                  <Badge variant="outline">
                    {t.canViewAllStudents ? "Tum ogrenciler" : "Kendi ogrencileri"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
