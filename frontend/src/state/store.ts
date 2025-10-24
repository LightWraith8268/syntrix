import { create } from "zustand";
import type { Library, Media, Playlist, Settings, TailscaleInfo } from "../types";

interface SyntrixState {
  libraries: Library[];
  media: Record<string, Media[]>;
  playlists: Playlist[];
  settings?: Settings;
  tailscale?: TailscaleInfo | null;
  loading: boolean;
  actions: {
    setLibraries: (libraries: Library[]) => void;
    upsertLibrary: (library: Library) => void;
    removeLibrary: (libraryId: string) => void;
    setMediaForLibrary: (libraryId: string, items: Media[]) => void;
    setPlaylists: (playlists: Playlist[]) => void;
    setSettings: (settings: Settings) => void;
    setTailscale: (info: TailscaleInfo | null) => void;
    setLoading: (loading: boolean) => void;
  };
}

export const useSyntrixStore = create<SyntrixState>((set) => ({
  libraries: [],
  media: {},
  playlists: [],
  loading: false,
  actions: {
    setLibraries: (libraries) => set({ libraries }),
    upsertLibrary: (library) =>
      set((state) => {
        const exists = state.libraries.find((item) => item.id === library.id);
        if (exists) {
          return {
            libraries: state.libraries.map((item) => (item.id === library.id ? library : item)),
          };
        }
        return {
          libraries: [library, ...state.libraries],
        };
      }),
    removeLibrary: (libraryId) =>
      set((state) => ({
        libraries: state.libraries.filter((item) => item.id !== libraryId),
      })),
    setMediaForLibrary: (libraryId, items) =>
      set((state) => ({
        media: {
          ...state.media,
          [libraryId]: items,
        },
      })),
    setPlaylists: (playlists) => set({ playlists }),
    setSettings: (settings) => set({ settings }),
    setTailscale: (info) => set({ tailscale: info }),
    setLoading: (loading) => set({ loading }),
  },
}));
