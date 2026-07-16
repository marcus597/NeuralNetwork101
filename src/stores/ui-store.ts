import { create } from "zustand";

type UiStoreState = {
  reducedMotion: boolean;
  activeHint: string | null;
  mobileBannerVisible: boolean;
};

type UiStoreActions = {
  setReducedMotion: (value: boolean) => void;
  setActiveHint: (hint: string | null) => void;
  setMobileBannerVisible: (visible: boolean) => void;
};

export const useUiStore = create<UiStoreState & UiStoreActions>((set) => ({
  reducedMotion: false,
  activeHint: null,
  mobileBannerVisible: false,

  setReducedMotion: (value) => set({ reducedMotion: value }),
  setActiveHint: (hint) => set({ activeHint: hint }),
  setMobileBannerVisible: (visible) => set({ mobileBannerVisible: visible }),
}));
