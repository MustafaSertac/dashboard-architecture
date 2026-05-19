/**
 * Teacher Entity - Teacher Domain
 * Represents teacher information and management data
 */

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
  avatar?: string;
  createdAt?: string;
}

export interface TeacherStats {
  totalStudents: number;
  totalTasks: number;
  completedTasks: number;
  avgStudentProgress: number;
}

export interface TeacherDashboard {
  teacher: Teacher;
  stats: TeacherStats;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'task_created' | 'exam_added' | 'note_added' | 'student_added';
  description: string;
  timestamp: string;
  relatedStudentId?: string;
}

export interface TeacherResponse {
  data: any | null;
  success: boolean;
  error?: string;
}
