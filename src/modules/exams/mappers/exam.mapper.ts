import type { ExamResult, SubjectResult, TopicDetail } from "@/lib/types";
import type { ExamDTO, ExamSummaryDTO, CreateExamRequest, ExamSectionRequest, ExamLessonRequest } from "@/modules/exams/types/exam.types";
import { UiExamType, examCodeToExamType, examTypeToExamCode, ExamStatus } from "@/types/common";
import { canonicalLessonName } from "@/modules/lessons/utils/lesson-name-map";
import { ExamType } from "@/lib/types";

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
            questionNumbers: tr.questionNumbers,
            correct: tr.correct,
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
    sectionName: string;
    lessonCode: number;
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
  const examCode = examTypeToExamCode(params.examType);

  const sectionMap = new Map<string, ExamLessonRequest[]>();
  const sectionOrder: string[] = [];

  for (const sr of params.subjectResults) {
    const sectionName = sr.sectionName;
    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, []);
      sectionOrder.push(sectionName);
    }

    const lessonEntry: ExamLessonRequest = {
      lessonCode: sr.lessonCode,
      name: canonicalLessonName(sr.lessonCode),
      correct: sr.correct,
      wrong: sr.wrong,
      blank: sr.empty,
      topicResults: (sr.topicDetails ?? [])
        .filter((td) => td.wrong > 0 || td.empty > 0 || td.correct > 0)
        .map((td) => ({
          topicCode: 0,
          name: td.topicName,
          correct: td.correct,
          wrong: td.wrong,
          blank: td.empty,
          questionNumbers: td.questionNumbers,
        })),
    };

    sectionMap.get(sectionName)!.push(lessonEntry);
  }

  const sections: ExamSectionRequest[] = sectionOrder.map((name) => {
    const lessons = sectionMap.get(name)!;
    const secCorrect = lessons.reduce((s, l) => s + l.correct, 0);
    const secWrong = lessons.reduce((s, l) => s + l.wrong, 0);
    const secBlank = lessons.reduce((s, l) => s + l.blank, 0);
    return {
      name,
      correct: secCorrect,
      wrong: secWrong,
      blank: secBlank,
      lessons,
    };
  });

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
