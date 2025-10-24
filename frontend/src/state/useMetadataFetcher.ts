import { useCallback } from "react";
import { api } from "../utils/api";
import { useSyntrixStore } from "./store";
import type { Media } from "../types";

export function useMetadataFetcher() {
  const { setMediaForLibrary } = useSyntrixStore((state) => state.actions);
  const libraries = useSyntrixStore((state) => state.libraries);
  const mediaByLibrary = useSyntrixStore((state) => state.media);

  const refreshMetadata = useCallback(
    async (mediaId: string) => {
      const { data } = await api.get<Media & { library: { id: string } }>(`/api/metadata/${mediaId}`, {
        params: { refresh: "true" },
      });

      const { library: libraryInfo, ...rest } = data;

      const libraryId =
        libraryInfo?.id ??
        libraries.find((library) => mediaByLibrary[library.id]?.some((item) => item.id === mediaId))?.id;
      if (libraryId) {
        const mediaList = mediaByLibrary[libraryId] ?? [];
        const updated: Media[] = mediaList.map((item) =>
          item.id === mediaId ? { ...item, ...(rest as Media) } : item,
        );
        setMediaForLibrary(libraryId, updated);
      }
      return data;
    },
    [libraries, mediaByLibrary, setMediaForLibrary],
  );

  return { refreshMetadata };
}
