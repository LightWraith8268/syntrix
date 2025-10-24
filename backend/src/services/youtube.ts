import fetch from "node-fetch";
import ytdl from "ytdl-core";

const youtubeApiBase = "https://www.googleapis.com/youtube/v3";

function getApiKey() {
  return process.env.YOUTUBE_API_KEY;
}

async function youtubeRequest<T>(endpoint: string, params: Record<string, string>) {
  const key = getApiKey();
  if (!key) {
    throw new Error("YOUTUBE_API_KEY is not configured");
  }

  const url = new URL(`${youtubeApiBase}/${endpoint}`);
  for (const [param, value] of Object.entries(params)) {
    url.searchParams.set(param, value);
  }
  url.searchParams.set("key", key);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`YouTube API request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

export async function youtubeSearch(query: string) {
  return youtubeRequest<any>("search", {
    part: "snippet",
    q: query,
    maxResults: "25",
    type: "video",
  });
}

export async function youtubeChannel(id: string) {
  return youtubeRequest<any>("channels", {
    part: "snippet,contentDetails,statistics",
    id,
  });
}

export async function youtubePlaylist(id: string) {
  return youtubeRequest<any>("playlists", {
    part: "snippet,contentDetails",
    id,
  });
}

export async function youtubeVideo(id: string) {
  return youtubeRequest<any>("videos", {
    part: "snippet,contentDetails,statistics",
    id,
  });
}

export async function resolveYoutubeStream(id: string) {
  const info = await ytdl.getInfo(id);
  const format = ytdl.chooseFormat(info.formats, { quality: "highest", filter: "audioandvideo" });
  if (!format.url) {
    throw new Error("No playable stream URL found");
  }

  return {
    url: format.url,
    contentType: format.mimeType,
    qualityLabel: format.qualityLabel,
  };
}
