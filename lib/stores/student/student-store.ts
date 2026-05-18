"use client";

import { create } from 'zustand';
import { User, Task } from '../../types';
import { mockUsers, mockTasks } from '../../mock-data';
import { StudentState, StudentWithStats, Mode } from '../../slices/student-types';

const createStudentSlice = (set: any, get: any) => ({
  mode: 'mock' as Mode,
  setMode: (m: Mode) => set({ mode: m }),
  selectedStudent: null as User | null,
  setSelectedStudent: (u: User | null) => set({ selectedStudent: u }),
  studentsWithStats: [] as StudentWithStats[],
  getStudentTasks: (studentId: string) => mockTasks.filter((t) => t.studentId === studentId),
  init: async () => {
    if (get().mode === 'remote') {
      // remote fetch stubs
      try {
        const [studentsRes, tasksRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/tasks'),
        ]);
        if (!studentsRes.ok || !tasksRes.ok) throw new Error('Remote fetch failed');
        const students: User[] = await studentsRes.json();
        const tasks: Task[] = await tasksRes.json();
        const stats = students.map((student) => {
          const studentTasks = tasks.filter((t) => t.studentId === student.id);
          const completedTasks = studentTasks.filter((t) => t.status === 'completed').length;
          const totalHours = studentTasks.reduce((sum, t) => sum + (t.hoursStudied || 0), 0);
          const totalQuestions = studentTasks.reduce((sum, t) => sum + (t.questionCount || 0), 0);
          const completedQuestions = studentTasks.reduce((sum, t) => sum + (t.completedQuestions || 0), 0);
          const weeklyProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

          const lastTaskUpdate = studentTasks
            .map((t) => new Date(t.updatedAt).getTime())
            .sort((a, b) => b - a)[0];

          const lastActive = lastTaskUpdate ? new Date(lastTaskUpdate).toLocaleDateString('tr-TR') : 'Aktivite yok';

          return {
            ...student,
            weeklyProgress,
            totalTasks: studentTasks.length,
            completedTasks,
            totalHours,
            lastActive,
          } as StudentWithStats;
        });
        set({ studentsWithStats: stats });
      } catch (e) {
        // fallback to mock
        const students = mockUsers.filter((u) => u.role === 'student');
        const stats = students.map((student) => {
          const studentTasks = mockTasks.filter((t) => t.studentId === student.id);
          const completedTasks = studentTasks.filter((t) => t.status === 'completed').length;
          const totalHours = studentTasks.reduce((sum, t) => sum + (t.hoursStudied || 0), 0);
          const totalQuestions = studentTasks.reduce((sum, t) => sum + (t.questionCount || 0), 0);
          const completedQuestions = studentTasks.reduce((sum, t) => sum + (t.completedQuestions || 0), 0);
          const weeklyProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

          const lastTaskUpdate = studentTasks
            .map((t) => new Date(t.updatedAt).getTime())
            .sort((a, b) => b - a)[0];

          const lastActive = lastTaskUpdate ? new Date(lastTaskUpdate).toLocaleDateString('tr-TR') : 'Aktivite yok';

          return {
            ...student,
            weeklyProgress,
            totalTasks: studentTasks.length,
            completedTasks,
            totalHours,
            lastActive,
          } as StudentWithStats;
        });
        set({ studentsWithStats: stats });
      }
    } else {
      const students = mockUsers.filter((u) => u.role === 'student');
      const stats = students.map((student) => {
        const studentTasks = mockTasks.filter((t) => t.studentId === student.id);
        const completedTasks = studentTasks.filter((t) => t.status === 'completed').length;
        const totalHours = studentTasks.reduce((sum, t) => sum + (t.hoursStudied || 0), 0);
        const totalQuestions = studentTasks.reduce((sum, t) => sum + (t.questionCount || 0), 0);
        const completedQuestions = studentTasks.reduce((sum, t) => sum + (t.completedQuestions || 0), 0);
        const weeklyProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

        const lastTaskUpdate = studentTasks
          .map((t) => new Date(t.updatedAt).getTime())
          .sort((a, b) => b - a)[0];

        const lastActive = lastTaskUpdate ? new Date(lastTaskUpdate).toLocaleDateString('tr-TR') : 'Aktivite yok';

        return {
          ...student,
          weeklyProgress,
          totalTasks: studentTasks.length,
          completedTasks,
          totalHours,
          lastActive,
        } as StudentWithStats;
      });

      set({ studentsWithStats: stats });
    }
  },
});

export const useStudentStore = create<StudentState>((set: any, get: any) => ({ ...createStudentSlice(set, get) }));
