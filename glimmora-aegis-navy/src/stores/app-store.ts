import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  aiWidgetOpen: boolean;
  commandPaletteOpen: boolean;
  classificationLevel: string;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  toggleAIWidget: () => void;
  toggleCommandPalette: () => void;
  setClassification: (level: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  aiWidgetOpen: false,
  commandPaletteOpen: false,
  classificationLevel: "RESTRICTED -- FOR OFFICIAL USE ONLY",
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSidebarCollapse: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleAIWidget: () => set((s) => ({ aiWidgetOpen: !s.aiWidgetOpen })),
  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setClassification: (level) => set({ classificationLevel: level }),
}));
