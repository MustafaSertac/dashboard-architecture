import { describe, it, expect } from "vitest";
import { mapExamDtoToUi, mapUiExamFormToCreateRequest } from "@/modules/exams/mappers/exam.mapper";
import type { ExamDTO } from "@/modules/exams/types/exam.types";

describe("mapExamDtoToUi (topicResults)", () => {
  it("correct ve questionNumbers DTO'dan dogrudan kullanir", () => {
    const dto = {
      id: "e1",
      studentId: "s1",
      examCode: 10,
      examName: "TYT Deneme",
      examDate: "2026-08-17T10:00:00Z",
      status: 2,
      totalCorrect: 80,
      totalWrong: 20,
      totalBlank: 20,
      sections: [
        {
          id: "sec1",
          name: "Türkçe",
          correct: 30,
          wrong: 7,
          blank: 3,
          lessons: [
            {
              id: "l1",
              lessonCode: 10,
              name: "TÜRKÇE",
              correct: 30,
              wrong: 7,
              blank: 3,
              topicResults: [
                { id: "tr1", topicCode: 1041, name: "Paragraf", wrong: 2, blank: 1, correct: 10, questionNumbers: [1, 5, 12] },
              ],
            },
          ],
        },
      ],
      createdAt: "2026-08-17T00:00:00Z",
    } as unknown as ExamDTO;

    const result = mapExamDtoToUi(dto);

    const topic = result.subjectResults[0].topicDetails![0];
    expect(topic.correct).toBe(10);
    expect(topic.questionNumbers).toEqual([1, 5, 12]);
  });

  it("topicResults bos dizi ise topicDetails undefined", () => {
    const dto = {
      id: "e1",
      studentId: "s1",
      examCode: 10,
      examName: "TYT Deneme",
      examDate: "2026-08-17T10:00:00Z",
      status: 2,
      totalCorrect: 80,
      totalWrong: 20,
      totalBlank: 20,
      sections: [
        {
          id: "sec1",
          name: "Türkçe",
          correct: 30,
          wrong: 7,
          blank: 3,
          lessons: [
            {
              id: "l1",
              lessonCode: 10,
              name: "TÜRKÇE",
              correct: 30,
              wrong: 7,
              blank: 3,
              topicResults: [],
            },
          ],
        },
      ],
      createdAt: "2026-08-17T00:00:00Z",
    } as unknown as ExamDTO;

    const result = mapExamDtoToUi(dto);
    expect(result.subjectResults[0].topicDetails).toBeUndefined();
  });
});

describe("mapExamDtoToUi (scoreType / score alanlari)", () => {
  it("scoreType ve puanlanan toplamlari DTO'dan kullanir", () => {
    const dto = {
      id: "e1",
      studentId: "s1",
      examCode: 11,
      scoreType: 1,
      examName: "AYT SAY",
      examDate: "2026-09-20T00:00:00Z",
      status: 2,
      totalCorrect: 76,
      totalWrong: 40,
      totalBlank: 44,
      totalNet: 35,
      scoreCorrect: 40,
      scoreWrong: 20,
      scoreBlank: 20,
      sections: [],
      createdAt: "2026-09-20T00:00:00Z",
    } as unknown as ExamDTO;

    const result = mapExamDtoToUi(dto);
    expect(result.scoreType).toBe(1);
    expect(result.scoreCorrect).toBe(40);
    expect(result.scoreWrong).toBe(20);
    expect(result.scoreBlank).toBe(20);
    expect(result.totalNet).toBe(35);
  });
});

describe("mapUiExamFormToCreateRequest (scoreType)", () => {
  const baseParams = {
    studentId: "s1",
    examName: "Deneme",
    date: "2026-09-20",
    analysisCompleted: false,
    subjectResults: [
      {
        subjectName: "Matematik",
        sectionName: "Matematik",
        lessonCode: 11,
        questionCount: 30,
        correct: 20,
        wrong: 5,
        empty: 5,
      },
    ],
  };

  it("AYT icin scoreType gonderir", () => {
    const req = mapUiExamFormToCreateRequest({
      ...baseParams,
      examType: "AYT",
      scoreType: 1,
    });
    expect(req.examCode).toBe(11);
    expect(req.scoreType).toBe(1);
  });

  it("TYT icin scoreType alanini gonderirmez", () => {
    const req = mapUiExamFormToCreateRequest({
      ...baseParams,
      examType: "TYT",
      scoreType: 2,
    });
    expect(req.examCode).toBe(10);
    expect("scoreType" in req).toBe(false);
  });
});
