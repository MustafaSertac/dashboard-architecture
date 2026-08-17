import type { User } from "@/lib/types";

// BACKEND EKSIK #2 (Yuksek): Ogretmen-ogrenci liste endpoint'i YOK.
// Backend tamamlandiginda TeacherStudentDTO boyle donmesi beklenir:
//   GET /students?teacherId={teacherId:guid}
// veya
//   GET /teachers/{teacherId:guid}/students
export interface TeacherStudentDTO {
  // Temel profil
  id: string;
  name: string;
  email: string;
  avatar?: string;

  // Istatistikler (backend'de hesaplanirsa N+1'den kurtulur)
  weeklyProgress: number;       // 0-100
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  lastActive: string;           // yyyy-MM-dd
}

export interface TeacherStudent extends User {
  weeklyProgress: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  lastActive: string;
}
