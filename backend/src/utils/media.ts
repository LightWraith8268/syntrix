import path from "node:path";
import { createHash } from "node:crypto";

const MOVIE_EXTENSIONS = [".mp4", ".mkv", ".mov", ".avi"];
const TV_EXTENSIONS = [".mp4", ".mkv", ".avi"];
const MUSIC_EXTENSIONS = [".mp3", ".flac", ".ogg", ".m4a", ".wav"];
const AUDIOBOOK_EXTENSIONS = [".m4b", ".mp3", ".aac", ".flac"];

export function getExtensionsForLibraryType(type: string) {
  switch (type) {
    case "movie":
      return MOVIE_EXTENSIONS;
    case "tv":
      return TV_EXTENSIONS;
    case "music":
      return MUSIC_EXTENSIONS;
    case "audiobook":
      return AUDIOBOOK_EXTENSIONS;
    default:
      return [...MOVIE_EXTENSIONS, ...TV_EXTENSIONS, ...MUSIC_EXTENSIONS, ...AUDIOBOOK_EXTENSIONS];
  }
}

export function inferTitle(filePath: string) {
  const filename = path.parse(filePath).name;
  return filename
    .replace(/[\._]/g, " ")
    .replace(/\b(1080p|720p|2160p|bluray|web\-dl|x264|x265|aac|h264|h265)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildMediaId(filePath: string) {
  return createHash("sha1").update(filePath).digest("hex");
}
