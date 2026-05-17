import { User, ExamResult, Task, DayStats, SubjectStats, CourseStats } from "./types";

// Mock Users
export const mockUsers: User[] = [
  { id: "1", name: "Admin User", email: "admin@edu.com", role: "admin" },
  { id: "2", name: "Ahmet Ogretmen", email: "ahmet@edu.com", role: "teacher" },
  { id: "3", name: "Elif Ogrenci", email: "elif@edu.com", role: "student" },
  { id: "4", name: "Mehmet Ogrenci", email: "mehmet@edu.com", role: "student" },
  { id: "5", name: "Zeynep Ogrenci", email: "zeynep@edu.com", role: "student" },
  { id: "6", name: "Burak Yilmaz", email: "burak@edu.com", role: "student" },
  { id: "7", name: "Selin Kaya", email: "selin@edu.com", role: "student" },
];

// Mock Exam Results
export const mockExamResults: ExamResult[] = [
  {
    id: "1",
    studentId: "3",
    date: "2026-05-01",
    examType: "TYT",
    correct: 85,
    wrong: 25,
    empty: 10,
    net: 78.75,
    analysisCompleted: true,
  },
  {
    id: "2",
    studentId: "3",
    date: "2026-05-08",
    examType: "TYT",
    correct: 90,
    wrong: 20,
    empty: 10,
    net: 85.0,
    analysisCompleted: true,
  },
  {
    id: "3",
    studentId: "3",
    date: "2026-05-15",
    examType: "TYT",
    correct: 88,
    wrong: 22,
    empty: 10,
    net: 82.5,
    analysisCompleted: false,
  },
  {
    id: "4",
    studentId: "3",
    date: "2026-05-01",
    examType: "AYT",
    correct: 55,
    wrong: 15,
    empty: 10,
    net: 51.25,
    analysisCompleted: true,
  },
  {
    id: "5",
    studentId: "3",
    date: "2026-05-08",
    examType: "AYT",
    correct: 60,
    wrong: 12,
    empty: 8,
    net: 57.0,
    analysisCompleted: true,
  },
  {
    id: "6",
    studentId: "3",
    date: "2026-05-15",
    examType: "AYT",
    correct: 62,
    wrong: 10,
    empty: 8,
    net: 59.5,
    analysisCompleted: false,
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: "1",
    studentId: "3",
    teacherId: "2",
    dueDate: "2026-05-16",
    subject: "Matematik",
    topic: "Fonksiyonlar",
    questionCount: 50,
    completedQuestions: 35,
    correctAnswers: 28,
    wrongAnswers: 7,
    hoursStudied: 2,
    status: "in-progress",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-16T14:00:00Z",
  },
  {
    id: "2",
    studentId: "3",
    teacherId: "2",
    dueDate: "2026-05-16",
    subject: "Fizik",
    topic: "Kuvvet ve Hareket",
    questionCount: 30,
    completedQuestions: 30,
    correctAnswers: 24,
    wrongAnswers: 6,
    hoursStudied: 1.5,
    status: "completed",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-16T12:00:00Z",
  },
  {
    id: "3",
    studentId: "3",
    teacherId: "2",
    dueDate: "2026-05-17",
    subject: "Kimya",
    topic: "Mol Kavrami",
    questionCount: 40,
    completedQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hoursStudied: 0,
    status: "pending",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "4",
    studentId: "3",
    teacherId: "2",
    dueDate: "2026-05-17",
    subject: "Turkce",
    topic: "Paragraf",
    questionCount: 25,
    completedQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hoursStudied: 0,
    status: "pending",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "5",
    studentId: "3",
    teacherId: "2",
    dueDate: "2026-05-18",
    subject: "Biyoloji",
    topic: "Genetik",
    questionCount: 35,
    completedQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hoursStudied: 0,
    status: "pending",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "6",
    studentId: "3",
    teacherId: "2",
    dueDate: "2026-05-19",
    subject: "Matematik",
    topic: "Trigonometri",
    questionCount: 40,
    completedQuestions: 40,
    correctAnswers: 32,
    wrongAnswers: 8,
    hoursStudied: 2.5,
    status: "completed",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-19T16:00:00Z",
  },
  {
    id: "7",
    studentId: "3",
    teacherId: "2",
    dueDate: "2026-05-19",
    subject: "Fizik",
    topic: "Elektrik",
    questionCount: 25,
    completedQuestions: 20,
    correctAnswers: 16,
    wrongAnswers: 4,
    hoursStudied: 1,
    status: "in-progress",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-19T14:00:00Z",
  },
  {
    id: "8",
    studentId: "3",
    teacherId: "2",
    dueDate: "2026-05-20",
    subject: "Kimya",
    topic: "Gazlar",
    questionCount: 30,
    completedQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hoursStudied: 0,
    status: "pending",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  // Additional tasks for other students
  {
    id: "9",
    studentId: "4",
    teacherId: "2",
    dueDate: "2026-05-16",
    subject: "Matematik",
    topic: "Polinomlar",
    questionCount: 40,
    completedQuestions: 15,
    correctAnswers: 10,
    wrongAnswers: 5,
    hoursStudied: 1,
    status: "in-progress",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-16T14:00:00Z",
  },
  {
    id: "10",
    studentId: "4",
    teacherId: "2",
    dueDate: "2026-05-17",
    subject: "Fizik",
    topic: "Optik",
    questionCount: 25,
    completedQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hoursStudied: 0,
    status: "pending",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "11",
    studentId: "5",
    teacherId: "2",
    dueDate: "2026-05-16",
    subject: "Turkce",
    topic: "Sozcukte Anlam",
    questionCount: 35,
    completedQuestions: 35,
    correctAnswers: 30,
    wrongAnswers: 5,
    hoursStudied: 2,
    status: "completed",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-16T10:00:00Z",
  },
  {
    id: "12",
    studentId: "5",
    teacherId: "2",
    dueDate: "2026-05-17",
    subject: "Biyoloji",
    topic: "Hucre",
    questionCount: 30,
    completedQuestions: 30,
    correctAnswers: 28,
    wrongAnswers: 2,
    hoursStudied: 1.5,
    status: "completed",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-17T12:00:00Z",
  },
  {
    id: "13",
    studentId: "6",
    teacherId: "2",
    dueDate: "2026-05-16",
    subject: "Matematik",
    topic: "Logaritma",
    questionCount: 45,
    completedQuestions: 20,
    correctAnswers: 12,
    wrongAnswers: 8,
    hoursStudied: 1,
    status: "in-progress",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-16T15:00:00Z",
  },
  {
    id: "14",
    studentId: "7",
    teacherId: "2",
    dueDate: "2026-05-16",
    subject: "Kimya",
    topic: "Atom ve Periyodik Sistem",
    questionCount: 40,
    completedQuestions: 40,
    correctAnswers: 38,
    wrongAnswers: 2,
    hoursStudied: 2.5,
    status: "completed",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-16T18:00:00Z",
  },
  {
    id: "15",
    studentId: "7",
    teacherId: "2",
    dueDate: "2026-05-17",
    subject: "Fizik",
    topic: "Elektrik",
    questionCount: 35,
    completedQuestions: 35,
    correctAnswers: 32,
    wrongAnswers: 3,
    hoursStudied: 2,
    status: "completed",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-17T14:00:00Z",
  },
];

// Generate day stats for a month
export function generateDayStats(year: number, month: number): DayStats[] {
  const days: DayStats[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    const isPast = date < today;
    const isToday = date.toDateString() === today.toDateString();

    if (isPast || isToday) {
      const questionCount = Math.floor(Math.random() * 100) + 20;
      const correctCount = Math.floor(questionCount * (0.6 + Math.random() * 0.3));
      const wrongCount = questionCount - correctCount;
      const totalHours = Math.floor(Math.random() * 6) + 2;
      const targetReached = questionCount >= 80 && totalHours >= 4;
      const belowMinimum = questionCount < 50 || totalHours < 2;

      days.push({
        date: dateStr,
        questionCount,
        correctCount,
        wrongCount,
        totalHours,
        targetReached,
        belowMinimum: !targetReached && belowMinimum,
        inactive: false,
      });
    } else {
      days.push({
        date: dateStr,
        questionCount: 0,
        correctCount: 0,
        wrongCount: 0,
        totalHours: 0,
        targetReached: false,
        belowMinimum: false,
        inactive: true,
      });
    }
  }

  return days;
}

// Mock Monthly Stats
export const mockMonthlyStats: SubjectStats[] = [
  { subject: "Matematik", totalHours: 45, totalQuestions: 850, completedCount: 32, pendingCount: 5 },
  { subject: "Fizik", totalHours: 28, totalQuestions: 420, completedCount: 20, pendingCount: 3 },
  { subject: "Kimya", totalHours: 22, totalQuestions: 380, completedCount: 18, pendingCount: 4 },
  { subject: "Biyoloji", totalHours: 18, totalQuestions: 320, completedCount: 15, pendingCount: 2 },
  { subject: "Turkce", totalHours: 25, totalQuestions: 450, completedCount: 22, pendingCount: 3 },
  { subject: "Tarih", totalHours: 15, totalQuestions: 280, completedCount: 12, pendingCount: 2 },
  { subject: "Cografya", totalHours: 12, totalQuestions: 220, completedCount: 10, pendingCount: 1 },
  { subject: "Felsefe", totalHours: 10, totalQuestions: 180, completedCount: 8, pendingCount: 1 },
];

// Mock Monthly Topic Stats (Tree Structure for Monthly View)
export const mockMonthlyTopicStats: CourseStats[] = [
  {
    course: "Matematik",
    branches: [
      {
        branch: "Temel Matematik",
        totalQuestions: 320,
        totalMistakes: 45,
        topics: [
          { name: "Sayi Basamaklari", questions: 80, mistakes: 10 },
          { name: "Bolme-Bolunebilme", questions: 90, mistakes: 12 },
          { name: "EBOB-EKOK", questions: 70, mistakes: 10 },
          { name: "Rasyonel Sayilar", questions: 80, mistakes: 13 },
        ],
      },
      {
        branch: "Fonksiyonlar",
        totalQuestions: 280,
        totalMistakes: 38,
        topics: [
          { name: "Fonksiyon Kavrami", questions: 70, mistakes: 8 },
          { name: "Fonksiyon Turleri", questions: 65, mistakes: 10 },
          { name: "Bire Bir ve Orten", questions: 60, mistakes: 8 },
          { name: "Fonksiyon Grafikleri", questions: 85, mistakes: 12 },
        ],
      },
      {
        branch: "Trigonometri",
        totalQuestions: 250,
        totalMistakes: 40,
        topics: [
          { name: "Trigonometrik Oranlar", questions: 80, mistakes: 12 },
          { name: "Aci Olculeri", questions: 70, mistakes: 10 },
          { name: "Trigonometrik Denklemler", questions: 100, mistakes: 18 },
        ],
      },
    ],
  },
  {
    course: "Fizik",
    branches: [
      {
        branch: "Mekanik",
        totalQuestions: 280,
        totalMistakes: 42,
        topics: [
          { name: "Kuvvet ve Hareket", questions: 80, mistakes: 12 },
          { name: "Enerji", questions: 70, mistakes: 10 },
          { name: "Momentum", questions: 60, mistakes: 8 },
          { name: "Dogrusal Hareket", questions: 70, mistakes: 12 },
        ],
      },
      {
        branch: "Elektrik",
        totalQuestions: 140,
        totalMistakes: 22,
        topics: [
          { name: "Elektrik Alan", questions: 45, mistakes: 7 },
          { name: "Elektrik Devreler", questions: 50, mistakes: 8 },
          { name: "Kondansatorler", questions: 45, mistakes: 7 },
        ],
      },
    ],
  },
  {
    course: "Kimya",
    branches: [
      {
        branch: "Genel Kimya",
        totalQuestions: 240,
        totalMistakes: 35,
        topics: [
          { name: "Atom Yapisi", questions: 70, mistakes: 10 },
          { name: "Periyodik Sistem", questions: 60, mistakes: 8 },
          { name: "Kimyasal Baglar", questions: 110, mistakes: 17 },
        ],
      },
      {
        branch: "Organik Kimya",
        totalQuestions: 140,
        totalMistakes: 25,
        topics: [
          { name: "Hidrokarbonlar", questions: 50, mistakes: 8 },
          { name: "Fonksiyonel Gruplar", questions: 50, mistakes: 9 },
          { name: "Reaksiyonlar", questions: 40, mistakes: 8 },
        ],
      },
    ],
  },
  {
    course: "Biyoloji",
    branches: [
      {
        branch: "Hucre Biyolojisi",
        totalQuestions: 180,
        totalMistakes: 28,
        topics: [
          { name: "Hucre Yapisi", questions: 60, mistakes: 8 },
          { name: "Hucre Bolunmesi", questions: 65, mistakes: 10 },
          { name: "Metabolizma", questions: 55, mistakes: 10 },
        ],
      },
      {
        branch: "Genetik",
        totalQuestions: 140,
        totalMistakes: 22,
        topics: [
          { name: "DNA ve RNA", questions: 50, mistakes: 7 },
          { name: "Kalitim", questions: 45, mistakes: 8 },
          { name: "Mutasyon", questions: 45, mistakes: 7 },
        ],
      },
    ],
  },
  {
    course: "Turkce",
    branches: [
      {
        branch: "Dil Bilgisi",
        totalQuestions: 250,
        totalMistakes: 30,
        topics: [
          { name: "Sozcukte Anlam", questions: 80, mistakes: 8 },
          { name: "Cumlede Anlam", questions: 90, mistakes: 12 },
          { name: "Paragrafta Anlam", questions: 80, mistakes: 10 },
        ],
      },
      {
        branch: "Paragraf",
        totalQuestions: 200,
        totalMistakes: 25,
        topics: [
          { name: "Ana Dusunce", questions: 70, mistakes: 8 },
          { name: "Yardimci Dusunce", questions: 65, mistakes: 9 },
          { name: "Paragraf Tamamlama", questions: 65, mistakes: 8 },
        ],
      },
    ],
  },
];

// Mock Yearly Stats (Tree Structure)
export const mockYearlyStats: CourseStats[] = [
  {
    course: "Matematik",
    branches: [
      {
        branch: "Temel Matematik",
        totalQuestions: 1200,
        totalMistakes: 180,
        topics: [
          { name: "Sayi Basamaklari", questions: 150, mistakes: 20 },
          { name: "Bolme-Bolunebilme", questions: 180, mistakes: 25 },
          { name: "EBOB-EKOK", questions: 120, mistakes: 15 },
          { name: "Rasyonel Sayilar", questions: 200, mistakes: 30 },
        ],
      },
      {
        branch: "Fonksiyonlar",
        totalQuestions: 800,
        totalMistakes: 120,
        topics: [
          { name: "Fonksiyon Kavrami", questions: 200, mistakes: 25 },
          { name: "Fonksiyon Turleri", questions: 180, mistakes: 30 },
          { name: "Bire Bir ve Orten", questions: 150, mistakes: 20 },
          { name: "Fonksiyon Grafikleri", questions: 270, mistakes: 45 },
        ],
      },
      {
        branch: "Trigonometri",
        totalQuestions: 600,
        totalMistakes: 95,
        topics: [
          { name: "Trigonometrik Oranlar", questions: 180, mistakes: 25 },
          { name: "Aci Olculeri", questions: 150, mistakes: 20 },
          { name: "Trigonometrik Denklemler", questions: 270, mistakes: 50 },
        ],
      },
    ],
  },
  {
    course: "Fizik",
    branches: [
      {
        branch: "Mekanik",
        totalQuestions: 900,
        totalMistakes: 150,
        topics: [
          { name: "Kuvvet ve Hareket", questions: 250, mistakes: 40 },
          { name: "Enerji", questions: 200, mistakes: 35 },
          { name: "Momentum", questions: 180, mistakes: 30 },
          { name: "Dogrusal Hareket", questions: 270, mistakes: 45 },
        ],
      },
      {
        branch: "Elektrik",
        totalQuestions: 700,
        totalMistakes: 110,
        topics: [
          { name: "Elektrik Alan", questions: 200, mistakes: 30 },
          { name: "Elektrik Devreler", questions: 250, mistakes: 40 },
          { name: "Kondansatorler", questions: 250, mistakes: 40 },
        ],
      },
    ],
  },
  {
    course: "Kimya",
    branches: [
      {
        branch: "Genel Kimya",
        totalQuestions: 650,
        totalMistakes: 100,
        topics: [
          { name: "Atom Yapisi", questions: 180, mistakes: 25 },
          { name: "Periyodik Sistem", questions: 150, mistakes: 20 },
          { name: "Kimyasal Baglar", questions: 320, mistakes: 55 },
        ],
      },
      {
        branch: "Organik Kimya",
        totalQuestions: 450,
        totalMistakes: 80,
        topics: [
          { name: "Hidrokarbonlar", questions: 150, mistakes: 25 },
          { name: "Fonksiyonel Gruplar", questions: 180, mistakes: 30 },
          { name: "Reaksiyonlar", questions: 120, mistakes: 25 },
        ],
      },
    ],
  },
];

// Current user context
export const currentUser: User = mockUsers[2]; // Default to student
