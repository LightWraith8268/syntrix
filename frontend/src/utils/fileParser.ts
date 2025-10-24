export function prettifyTitle(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[\._]/g, " ")
    .replace(/\b(1080p|720p|2160p|bluray|webrip|x264|x265|aac|h264|h265)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatRuntime(seconds?: number | null) {
  if (!seconds || Number.isNaN(seconds)) {
    return null;
  }
  const mins = Math.round(seconds / 60);
  const hours = Math.floor(mins / 60);
  const remainder = mins % 60;
  if (hours === 0) {
    return `${mins} min`;
  }
  return `${hours}h ${remainder.toString().padStart(2, "0")}m`;
}
