import create from "zustand";

interface StudentUiState {
  selectedStudentId?: string;
  setSelected: (id?: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useStudentUiStore = create<StudentUiState>((set) => ({
  selectedStudentId: undefined,
  setSelected: (id) => set({ selectedStudentId: id }),
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}));
