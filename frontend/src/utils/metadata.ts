import type { Media, MediaMetadata } from "../types";

export function resolveArtwork(media: Media): string | undefined {
  return media.metadata?.artwork ?? fallbackArtworkForType(media.type);
}

function fallbackArtworkForType(type: Media["type"]) {
  switch (type) {
    case "movie":
      return "/artwork/movie-placeholder.svg";
    case "tv":
      return "/artwork/tv-placeholder.svg";
    case "music":
      return "/artwork/music-placeholder.svg";
    case "audiobook":
      return "/artwork/audiobook-placeholder.svg";
    default:
      return "/artwork/fallback.svg";
  }
}

export function summarizeMetadata(metadata?: MediaMetadata | null) {
  if (!metadata) {
    return "";
  }

  const parts: string[] = [];
  if (metadata.year) {
    parts.push(metadata.year.toString());
  }
  if (metadata.genres?.length) {
    parts.push(metadata.genres.slice(0, 3).join(", "));
  }
  if (metadata.runtimeSeconds) {
    const mins = Math.round(metadata.runtimeSeconds / 60);
    parts.push(`${mins} min`);
  }
  return parts.join(" • ");
}
