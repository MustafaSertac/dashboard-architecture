import { describe, it, expect } from "vitest";
import {
  getSectionsForScoreType,
  AYT_SECTIONS,
  AYT_TOTAL_QUESTIONS,
} from "@/config/exam-config";

function sectionQuestions(sections: ReturnType<typeof getSectionsForScoreType>) {
  return sections.reduce(
    (sum, s) => sum + s.subjects.reduce((a, sub) => a + sub.questionCount, 0),
    0
  );
}

describe("getSectionsForScoreType", () => {
  it("SAY -> Matematik + Fen Bilimleri (80 soru)", () => {
    const sections = getSectionsForScoreType(1);
    expect(sections.map((s) => s.name)).toEqual(["Matematik", "Fen Bilimleri"]);
    expect(sectionQuestions(sections)).toBe(80);
  });

  it("EA -> TDE-Sosyal Bilimler-1 + Matematik (80 soru)", () => {
    const sections = getSectionsForScoreType(2);
    expect(sections.map((s) => s.name)).toEqual([
      "Türk Dili ve Edebiyatı – Sosyal Bilimler-1",
      "Matematik",
    ]);
    expect(sectionQuestions(sections)).toBe(80);
  });

  it("SÖZ -> TDE-Sosyal Bilimler-1 + Sosyal Bilimler-2 (80 soru)", () => {
    const sections = getSectionsForScoreType(3);
    expect(sections.map((s) => s.name)).toEqual([
      "Türk Dili ve Edebiyatı – Sosyal Bilimler-1",
      "Sosyal Bilimler-2",
    ]);
    expect(sectionQuestions(sections)).toBe(80);
  });

  it("gecersiz puan turunde tum AYT bolumleri doner", () => {
    expect(getSectionsForScoreType(99)).toBe(AYT_SECTIONS);
  });

  it("AYT toplam 160 soru (4 bolum x 40)", () => {
    expect(AYT_TOTAL_QUESTIONS).toBe(160);
  });
});
