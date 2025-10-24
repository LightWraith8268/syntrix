import { createStore, get, set } from "idb-keyval";

const store = createStore("syntrix", "preferences");

export async function getPlaybackProgress(mediaId: string) {
  const value = await get<number>(`progress:${mediaId}`, store);
  return value ?? 0;
}

export async function setPlaybackProgress(mediaId: string, progress: number) {
  await set(`progress:${mediaId}`, progress, store);
}

export async function saveSettings(settings: Record<string, unknown>) {
  await set("settings", settings, store);
}

export async function loadSettings<T extends Record<string, unknown>>() {
  const stored = await get<T>("settings", store);
  return stored ?? ({} as T);
}
