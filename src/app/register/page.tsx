"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { UserRole } from "@/lib/types";
import { useValidateCode } from "@/modules/organizations/hooks/useOrganizations";
import {
  REGISTRATION_CODE_TYPE,
  isValidRegistrationCode,
  normalizeRegistrationCode,
} from "@/modules/organizations/types/organization.types";

function CodeStatus({
  code,
  isValid,
  isChecking,
  isFetching,
  info,
  requireType,
}: {
  code: string;
  isValid: boolean;
  isChecking: boolean;
  isFetching: boolean;
  info?: { valid: boolean; type?: number | null } | null;
  requireType?: number;
}) {
  if (!code.trim()) return null;
  if (!isValid) {
    return (
      <p className="text-xs text-destructive">
        8 haneli kod girin (harfler A-Z, I/O hariç; rakam 2-9).
      </p>
    );
  }
  if (isChecking || isFetching) {
    return <p className="text-xs text-muted-foreground">Kod doğrulanıyor…</p>;
  }
  if (!info) return null;
  const typeOk = requireType === undefined || info.type === requireType;
  if (info.valid && typeOk) {
    return (
      <p className="text-xs text-success flex items-center gap-1">
        <Check className="w-3 h-3" /> Kod geçerli
      </p>
    );
  }
  return (
    <p className="text-xs text-destructive flex items-center gap-1">
      <X className="w-3 h-3" /> Kod geçersiz, kullanılmış veya süresi dolmuş.
    </p>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [code, setCode] = useState("");
  const [organizationCode, setOrganizationCode] = useState("");
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const studentCodeValid = isValidRegistrationCode(code);
  const teacherCodeValid = isValidRegistrationCode(organizationCode);

  const studentCodeQuery = useValidateCode(role === "student" ? code : "");
  const teacherCodeQuery = useValidateCode(
    role === "teacher" ? organizationCode : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Sifreler eslesmiyor");
      return;
    }

    if (password.length < 6) {
      setError("Sifre en az 6 karakter olmalidir");
      return;
    }

    if (role === "student") {
      if (!code.trim()) {
        setError("Davet kodu gerekli");
        return;
      }
      if (!studentCodeValid) {
        setError("Davet kodu 8 haneli olmalidir");
        return;
      }
      if (!studentCodeQuery.data?.valid) {
        setError("Gecerli bir davet kodu girin");
        return;
      }
    }

    if (role === "teacher" && organizationCode.trim()) {
      if (!teacherCodeValid) {
        setError("Organizasyon kodu 8 haneli olmalidir");
        return;
      }
      if (
        !teacherCodeQuery.data?.valid ||
        teacherCodeQuery.data?.type !== REGISTRATION_CODE_TYPE.TeacherJoin
      ) {
        setError("Gecerli bir organizasyon kodu girin");
        return;
      }
    }

    if (!kvkkAccepted) {
      setError("KVKK Aydinlatma Metni'ni kabul etmelisiniz");
      return;
    }

    setIsLoading(true);

    const result = await register({
      name,
      email,
      password,
      phoneNumber,
      role,
      code: role === "student" ? normalizeRegistrationCode(code) : undefined,
      organizationCode:
        role === "teacher" && organizationCode.trim()
          ? normalizeRegistrationCode(organizationCode)
          : undefined,
      isKvkVerified: kvkkAccepted,
    });

    if (result.success) {
      router.push(role === "teacher" ? "/teacher" : "/dashboard");
    } else {
      setError(result.error || "Kayit basarisiz");
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

        {/* Register Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Kayit Ol</CardTitle>
            <CardDescription>Yeni bir hesap olusturun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Adinizi girin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

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
                <Label htmlFor="phoneNumber">Telefon Numarasi</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="05XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={role}
                  onValueChange={(value: UserRole) => {
                    setRole(value);
                    setError("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Ogrenci</SelectItem>
                    <SelectItem value="teacher">Ogretmen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="code">Davet Kodu</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="8 haneli davet kodu"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    maxLength={8}
                    autoComplete="off"
                    required
                  />
                  <CodeStatus
                    code={code}
                    isValid={studentCodeValid}
                    isChecking={code.length > 0 && code.length < 8}
                    isFetching={studentCodeQuery.isFetching}
                    info={studentCodeQuery.data}
                    requireType={REGISTRATION_CODE_TYPE.StudentRegistration}
                  />
                </div>
              )}

              {role === "teacher" && (
                <div className="space-y-2">
                  <Label htmlFor="organizationCode">
                    Organizasyon Kodu (Opsiyonel)
                  </Label>
                  <Input
                    id="organizationCode"
                    type="text"
                    placeholder="Varsa 8 haneli katılım kodu"
                    value={organizationCode}
                    onChange={(e) =>
                      setOrganizationCode(e.target.value.toUpperCase())
                    }
                    maxLength={8}
                    autoComplete="off"
                  />
                  <CodeStatus
                    code={organizationCode}
                    isValid={teacherCodeValid}
                    isChecking={
                      organizationCode.length > 0 && organizationCode.length < 8
                    }
                    isFetching={teacherCodeQuery.isFetching}
                    info={teacherCodeQuery.data}
                    requireType={REGISTRATION_CODE_TYPE.TeacherJoin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Sifre</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="En az 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Label htmlFor="confirmPassword">Sifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label>KVKK Aydinlatma Metni</Label>
                <div className="max-h-32 overflow-y-auto rounded-md border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
                  <p className="mb-2">
                    6698 sayili Kisisel Verilerin Korunmasi Kanunu (&quot;KVKK&quot;) uyarinca,
                    kayit sirasinda ve platformu kullandiginiz surece paylastiginiz ad-soyad,
                    e-posta, telefon ve egitim verileriniz; uyelik olusturma, egitim-kocluk
                    hizmetinin sunulmasi, performans takibi ve analiz raporlarinin uretilmesi
                    amaciyla islenmektedir.
                  </p>
                  <p className="mb-2">
                    Verileriniz; hizmetin gerektirdigi olcude yetkili ogretmen ve sistem
                    yoneticileriyle paylasilabilir, yasal yukumlulukler disinda ucuncu kisilerle
                    paylasilmaz. Verileriniz, isleme amacinin gerektirdigi sure boyunca ve ilgili
                    mevzuatta ongorulen saklama sureleri kadar muhafaza edilir.
                  </p>
                  <p>
                    KVKK kapsamindaki; bilgi talep etme, duzeltme, silinmesini isteme ve islemeye
                    itiraz etme gibi haklarinizi kullanmak icin platform yonetimine
                    basvurabilirsiniz. Kayit islemini tamamlayarak asagidaki aydinlatma metnini
                    okudugunuzu ve kisisel verilerinizin belirtilen sekilde islenmesine onay
                    verdiginizi beyan etmis olursunuz.
                  </p>
                </div>
                <label
                  htmlFor="kvkk"
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <Checkbox
                    id="kvkk"
                    checked={kvkkAccepted}
                    onCheckedChange={(checked) => setKvkkAccepted(checked === true)}
                    className="mt-0.5"
                  />
                  <span>
                    KVKK Aydinlatma Metni&apos;ni okudum ve kabul ediyorum.
                  </span>
                </label>
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
                    Kayit yapiliyor...
                  </>
                ) : (
                  "Kayit Ol"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Zaten hesabiniz var mi? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Giris Yap
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
