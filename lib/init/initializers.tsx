"use client";

import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth/auth-store';
import { useStudentStore } from '../stores/student/student-store';

export function AuthInitializer() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => { init(); }, [init]);
  return null;
}

export function StudentInitializer() {
  const init = useStudentStore((s) => s.init);
  useEffect(() => { init(); }, [init]);
  return null;
}
