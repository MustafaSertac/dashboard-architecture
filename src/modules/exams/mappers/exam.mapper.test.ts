import { describe, it, expect } from "vitest";
import { mapExamDtoToUi } from "@/modules/exams/mappers/exam.mapper";
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
