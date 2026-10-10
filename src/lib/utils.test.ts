import { describe, it, expect } from "vitest";
import { formatFullName } from "@/lib/utils";

describe("formatFullName", () => {
  it("tek kelimeyi isim olarak (ilk harf buyuk) dondurur", () => {
    expect(formatFullName("ali")).toBe("Ali");
  });

  it("ad ve soyadi ayirir; soyadi tamamen buyuk harf yapar", () => {
    expect(formatFullName("ali veli")).toBe("Ali VELİ");
  });

  it("birden fazla isimde son parca soyad olur", () => {
    expect(formatFullName("ali veli can")).toBe("Ali Veli CAN");
  });

  it("fazla bosluklari temizler ve bosluga gore split eder", () => {
    expect(formatFullName("  ali   veli  ")).toBe("Ali VELİ");
  });

  it("Turkce karakterleri dogru donusturur", () => {
    expect(formatFullName("ayşe nur demir")).toBe("Ayşe Nur DEMİR");
  });

  it("isim parcalarinin kalanini kucuk harfe cevirir", () => {
    expect(formatFullName("AHMET mehmet yılmaz")).toBe("Ahmet Mehmet YILMAZ");
  });

  it("bos veya sadece bosluk icin bos string doner", () => {
    expect(formatFullName("")).toBe("");
    expect(formatFullName("   ")).toBe("");
  });
});
