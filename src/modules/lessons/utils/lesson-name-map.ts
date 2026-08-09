export const LESSON_NAME_MAP: Record<number, { canonical: string; uiTurkish: string; uiAscii: string }> = {
  10: { canonical: "TÜRKÇE", uiTurkish: "Türkçe", uiAscii: "Turkce" },
  11: { canonical: "MATEMATİK", uiTurkish: "Matematik", uiAscii: "Matematik" },
  12: { canonical: "GEOMETRİ", uiTurkish: "Geometri", uiAscii: "Geometri" },
  13: { canonical: "FİZİK", uiTurkish: "Fizik", uiAscii: "Fizik" },
  14: { canonical: "KİMYA", uiTurkish: "Kimya", uiAscii: "Kimya" },
  15: { canonical: "BİYOLOJİ", uiTurkish: "Biyoloji", uiAscii: "Biyoloji" },
  16: { canonical: "TARİH", uiTurkish: "Tarih", uiAscii: "Tarih" },
  17: { canonical: "COĞRAFYA", uiTurkish: "Coğrafya", uiAscii: "Cografya" },
  18: { canonical: "FELSEFE", uiTurkish: "Felsefe", uiAscii: "Felsefe" },
  19: { canonical: "DİN KÜLTÜRÜ", uiTurkish: "Din Kültürü", uiAscii: "Din Kulturu" },
};

export function canonicalLessonName(code: number): string {
  return LESSON_NAME_MAP[code]?.canonical ?? `DERS_${code}`;
}

export function uiTurkishName(code: number): string {
  return LESSON_NAME_MAP[code]?.uiTurkish ?? `Ders ${code}`;
}

export function uiAsciiName(code: number): string {
  return LESSON_NAME_MAP[code]?.uiAscii ?? `Ders${code}`;
}

export function lessonCodeFromUiName(name: string): number | undefined {
  const normalized = name.trim();
  for (const [code, entry] of Object.entries(LESSON_NAME_MAP)) {
    if (
      entry.uiAscii.toLowerCase() === normalized.toLowerCase() ||
      entry.canonical.toLowerCase() === normalized.toLowerCase() ||
      entry.uiTurkish.toLowerCase() === normalized.toLowerCase()
    ) {
      return Number(code);
    }
  }
  return undefined;
}

export function lessonCodeFromCanonicalName(name: string): number | undefined {
  const upper = name.trim().toUpperCase();
  for (const [code, entry] of Object.entries(LESSON_NAME_MAP)) {
    if (entry.canonical === upper) {
      return Number(code);
    }
  }
  return undefined;
}
