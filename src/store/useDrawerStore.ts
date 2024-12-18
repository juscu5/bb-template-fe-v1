import { create } from "zustand";

interface MinimizeDrawerProps {
  minimized: boolean;
  setMinimized: (minimize: boolean) => void;
}

export const useMinimizeDrawer = create<MinimizeDrawerProps>((set) => ({
  minimized: true,
  setMinimized: (minimized) => set({ minimized }),
}));
