import fetch from "node-fetch";
import { getSettings } from "./settings.js";

async function getBaseUrl() {
  const settings = await getSettings();
  return settings.invidiousInstance ?? process.env.INVIDIOUS_INSTANCE ?? "https://yewtu.be";
}

async function invidiousRequest<T>(path: string, params?: Record<string, string>) {
  const baseUrl = await getBaseUrl();
  const url = new URL(`/api/v1/${path}`, baseUrl);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Invidious request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function invidiousSearch(query: string) {
  return invidiousRequest<any[]>("search", { q: query });
}

export async function invidiousChannel(id: string) {
  return invidiousRequest<any>(`channels/${encodeURIComponent(id)}`);
}

export async function invidiousPlaylist(id: string) {
  return invidiousRequest<any>(`playlists/${encodeURIComponent(id)}`);
}

export async function invidiousVideo(id: string) {
  return invidiousRequest<any>(`videos/${encodeURIComponent(id)}`);
}
