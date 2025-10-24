import { FFprobeCommand } from "ffprobe-client";
import fetch, { RequestInit } from "node-fetch";

export type MediaType = "movie" | "tv" | "music" | "audiobook" | "youtube";

export interface MetadataResult {
  title: string;
  description?: string;
  year?: number;
  genres?: string[];
  runtimeSeconds?: number;
  artwork?: string;
  providers: string[];
  raw?: Record<string, unknown>;
}

const tmdbBaseUrl = "https://api.themoviedb.org/3";

async function fetchJson<T>(input: string | URL, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(input, init);
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn("Metadata fetch failed", error);
    return null;
  }
}

async function getTmdbMetadata(title: string, type: "movie" | "tv"): Promise<MetadataResult | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return null;
  }

  const searchUrl = new URL(`${tmdbBaseUrl}/search/${type}`);
  searchUrl.searchParams.set("api_key", apiKey);
  searchUrl.searchParams.set("query", title);

  const data = await fetchJson<{ results: any[] }>(searchUrl.toString());
  if (!data || data.results.length === 0) {
    return null;
  }

  const entry = data.results[0];
  return {
    title: entry.title ?? entry.name ?? title,
    description: entry.overview ?? undefined,
    year: entry.release_date
      ? Number.parseInt(entry.release_date.split("-")[0]!, 10)
      : entry.first_air_date
      ? Number.parseInt(entry.first_air_date.split("-")[0]!, 10)
      : undefined,
    genres: entry.genre_ids ?? undefined,
    artwork: entry.poster_path ? `https://image.tmdb.org/t/p/w780${entry.poster_path}` : undefined,
    providers: ["tmdb"],
    raw: entry,
  };
}

async function getOmdbMetadata(title: string): Promise<MetadataResult | null> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    return null;
  }

  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("t", title);

  const data = await fetchJson<any>(url.toString());
  if (!data || data.Response === "False") {
    return null;
  }

  return {
    title: data.Title ?? title,
    description: data.Plot ?? undefined,
    year: data.Year ? Number.parseInt(data.Year, 10) : undefined,
    genres: data.Genre?.split(",").map((g: string) => g.trim()),
    runtimeSeconds: data.Runtime ? Number.parseInt(data.Runtime, 10) * 60 : undefined,
    artwork: data.Poster && data.Poster !== "N/A" ? data.Poster : undefined,
    providers: ["omdb"],
    raw: data,
  };
}

async function getMusicbrainzMetadata(title: string, artist?: string): Promise<MetadataResult | null> {
  const appName = process.env.MUSICBRAINZ_APP_NAME ?? "Syntrix";
  const appVersion = process.env.MUSICBRAINZ_APP_VERSION ?? "0.1.0";
  const contact = process.env.MUSICBRAINZ_APP_CONTACT ?? "";

  const headers: Record<string, string> = {
    "User-Agent": `${appName}/${appVersion} (${contact})`,
  };

  const params = new URLSearchParams();
  params.set("query", artist ? `recording:${title} AND artist:${artist}` : title);
  params.set("fmt", "json");

  const data = await fetchJson<any>(`https://musicbrainz.org/ws/2/recording?${params.toString()}`, {
    headers,
  });

  if (!data || !data.recordings || data.recordings.length === 0) {
    return null;
  }

  const recording = data.recordings[0];
  return {
    title: recording.title ?? title,
    description: artist ?? recording["artist-credit"]?.[0]?.name,
    year: recording["first-release-date"]
      ? Number.parseInt(recording["first-release-date"].slice(0, 4), 10)
      : undefined,
    providers: ["musicbrainz"],
    raw: recording,
  };
}

async function probeMedia(filePath: string): Promise<MetadataResult | null> {
  try {
    const command = new FFprobeCommand(filePath);
    const result = await command.run();
    const format = result.format ?? {};
    return {
      title: format.tags?.title ?? format.filename ?? filePath,
      description: format.tags?.comment ?? undefined,
      runtimeSeconds: format.duration ? Number.parseFloat(format.duration) : undefined,
      providers: ["ffprobe"],
      raw: result,
    };
  } catch (error) {
    console.warn("ffprobe failed", error);
    return null;
  }
}

export async function resolveMetadata(
  type: MediaType,
  title: string,
  filePath: string,
  artist?: string,
): Promise<MetadataResult | null> {
  const providers: Array<() => Promise<MetadataResult | null>> = [];

  if (type === "movie" || type === "tv") {
    providers.push(() => getTmdbMetadata(title, type === "movie" ? "movie" : "tv"));
    providers.push(() => getOmdbMetadata(title));
  }

  if (type === "music" || type === "audiobook") {
    providers.push(() => getMusicbrainzMetadata(title, artist));
  }

  providers.push(() => probeMedia(filePath));

  for (const provider of providers) {
    const result = await provider();
    if (result) {
      return result;
    }
  }

  return null;
}
