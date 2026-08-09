import type { ExamResult, SubjectResult, TopicDetail } from "@/lib/types";
import type { ExamDTO, ExamSummaryDTO, CreateExamRequest, CreateExamSectionRequest, CreateExamSectionLessonRequest } from "@/modules/exams/types/exam.types";
import { UiExamType, examCodeToExamType, examTypeToExamCode, ExamStatus } from "@/types/common";
import { lessonCodeFromUiName, canonicalLessonName } from "@/modules/lessons/utils/lesson-name-map";
import { ExamType } from "@/lib/types";

const TYT_SECTION_TEMPLATE: Record<string, number[]> = {
  "Türkçe": [10],
  "Sosyal Bilimler": [16, 17, 18, 19],
  "Temel Matematik": [11],
  "Fen Bilimleri": [13, 14, 15],
};

const AYT_SECTION_TEMPLATE: Record<string, number[]> = {
  "Türk Dili ve Edebiyatı – Sosyal Bilimler-1": [10, 16, 17],
  "Sosyal Bilimler-2": [16, 17, 18, 19],
  "Matematik": [11, 12],
  "Fen Bilimleri": [13, 14, 15],
};

function getSectionTemplate(examCode: number): Record<string, number[]> {
  return examCode === 10 ? TYT_SECTION_TEMPLATE : AYT_SECTION_TEMPLATE;
}

function getDefaultDuration(examCode: number): number {
  return examCode === 10 ? 135 : 180;
}

export function mapExamDtoToUi(dto: ExamDTO | ExamSummaryDTO): ExamResult {
  const subjectResults: SubjectResult[] = [];

  if ("sections" in dto && dto.sections) {
    for (const section of dto.sections) {
      for (const lesson of section.lessons) {
        const topicDetails: TopicDetail[] = (lesson.topicResults ?? []).map(
          (tr) => ({
            topicName: tr.name,
            subtopicName: undefined,
            questionNumbers: [],
            correct: 0,
            wrong: tr.wrong,
            empty: tr.blank,
          })
        );

        subjectResults.push({
          subjectName: lesson.name,
          questionCount: lesson.correct + lesson.wrong + lesson.blank,
          correct: lesson.correct,
          wrong: lesson.wrong,
          empty: lesson.blank,
          net: lesson.net ?? lesson.correct - lesson.wrong * 0.25,
          topicDetails: topicDetails.length > 0 ? topicDetails : undefined,
        });
      }
    }
  }

  return {
    id: dto.id,
    studentId: dto.studentId,
    date: dto.examDate.split("T")[0],
    examType: examCodeToExamType(dto.examCode) as ExamType,
    examName: dto.examName,
    totalCorrect: dto.totalCorrect,
    totalWrong: dto.totalWrong,
    totalEmpty: dto.totalBlank,
    totalNet: dto.totalNet ?? dto.totalCorrect - dto.totalWrong * 0.25,
    subjectResults,
    analysisCompleted: dto.status >= ExamStatus.Completed,
  };
}

export function mapUiExamFormToCreateRequest(params: {
  studentId: string;
  examType: UiExamType;
  examName: string;
  date: string;
  subjectResults: {
    subjectName: string;
    questionCount: number;
    correct: number;
    wrong: number;
    empty: number;
    topicDetails?: {
      topicName: string;
      correct: number;
      wrong: number;
      empty: number;
      questionNumbers?: number[];
    }[];
  }[];
  analysisCompleted: boolean;
  durationMinutes?: number;
  notes?: string;
}): CreateExamRequest {
  const examCode: 10 | 11 = examTypeToExamCode(params.examType);
  const template = getSectionTemplate(examCode);

  const sectionMap = new Map<string, CreateExamSectionLessonRequest[]>();

  for (const sr of params.subjectResults) {
    const lessonCode = lessonCodeFromUiName(sr.subjectName);
    if (lessonCode === undefined) continue;

    let sectionName: string | undefined;
    for (const [secName, codes] of Object.entries(template)) {
      if (codes.includes(lessonCode)) {
        sectionName = secName;
        break;
      }
    }
    if (!sectionName) continue;

    const lessonEntry: CreateExamSectionLessonRequest = {
      lessonCode,
      name: canonicalLessonName(lessonCode),
      correct: sr.correct,
      wrong: sr.wrong,
      blank: sr.empty,
      topicResults: (sr.topicDetails ?? [])
        .filter((td) => td.wrong > 0 || td.empty > 0)
        .map((td) => ({
          topicCode: 0,
          name: td.topicName,
          wrong: td.wrong,
          blank: td.empty,
        })),
    };

    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, []);
    }
    sectionMap.get(sectionName)!.push(lessonEntry);
  }

  const sections: CreateExamSectionRequest[] = [];
  for (const [name, lessons] of sectionMap) {
    const secCorrect = lessons.reduce((s, l) => s + l.correct, 0);
    const secWrong = lessons.reduce((s, l) => s + l.wrong, 0);
    const secBlank = lessons.reduce((s, l) => s + l.blank, 0);
    sections.push({ name, correct: secCorrect, wrong: secWrong, blank: secBlank, lessons });
  }

  return {
    studentId: params.studentId,
    examCode,
    examName: params.examName,
    examDate: new Date(params.date).toISOString(),
    durationMinutes: params.durationMinutes ?? getDefaultDuration(examCode),
    notes: params.notes ?? "",
    status: params.analysisCompleted ? ExamStatus.Completed : ExamStatus.Submitted,
    sections,
  };
}
