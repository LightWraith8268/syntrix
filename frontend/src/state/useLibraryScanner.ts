import { useCallback } from "react";
import { api } from "../utils/api";
import { useSyntrixStore } from "./store";
import type { Media } from "../types";

interface ScanResponse {
  library: {
    id: string;
  };
  media: Media[];
  added: number;
  removed: number;
}

export function useLibraryScanner() {
  const { setMediaForLibrary, setLibraries, setLoading } = useSyntrixStore((state) => state.actions);
  const loading = useSyntrixStore((state) => state.loading);

  const scanLibrary = useCallback(
    async (libraryId: string, refreshMetadata = true) => {
      setLoading(true);
      try {
        const { data } = await api.post<ScanResponse>("/api/scan", { libraryId, refreshMetadata });
        if (data.library?.id) {
          setMediaForLibrary(data.library.id, data.media ?? []);
        }
        const listResponse = await api.get("/api/libraries");
        setLibraries(listResponse.data);
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setLibraries, setMediaForLibrary, setLoading],
  );

  return { scanLibrary, scanning: loading };
}
