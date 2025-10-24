export type LibraryType = "movie" | "tv" | "music" | "audiobook" | "youtube" | "custom";

export interface Library {
  id: string;
  name: string;
  type: LibraryType;
  path: string;
  metadataSource?: string | null;
  accentColor?: string | null;
  createdAt?: string;
}

export interface Media {
  id: string;
  libraryId: string;
  title: string;
  type: LibraryType;
  path: string;
  metadata?: MediaMetadata | null;
  progress?: number | null;
  updatedAt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  mediaIds: string[];
}

export interface Settings {
  id: number;
  port: number;
  tailscaleEnabled: boolean;
  invidiousEnabled: boolean;
  invidiousInstance: string;
  accessToken?: string | null;
}

export interface TailscaleInfo {
  ok: boolean;
  hostname?: string;
  tailnet?: string;
  address?: string;
  raw?: unknown;
  error?: string;
}

export interface MediaMetadata {
  title: string;
  description?: string;
  year?: number;
  genres?: string[];
  runtimeSeconds?: number;
  artwork?: string;
  providers?: string[];
  raw?: Record<string, unknown>;
}

export interface StreamInfo {
  backend: "invidious" | "youtube" | "local";
  url: string;
  type?: string;
  quality?: string;
  contentType?: string;
  qualityLabel?: string;
}
