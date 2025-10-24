import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { LibraryCard } from "../components/LibraryCard";
import { api } from "../utils/api";
import { useInvidious } from "../state/useInvidious";
import type { Media } from "../types";

interface Props {
  onPlay: (media: Media) => void;
  onDetails: (media: Media) => void;
}

export function ExplorePage({ onPlay, onDetails }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const { enabled: invidiousEnabled } = useInvidious();

  const performSearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!query) {
      return;
    }
    setLoading(true);
    try {
      if (invidiousEnabled) {
        const { data } = await api.get<any[]>("/api/invidious/search", { params: { q: query } });
        setResults(
          data
            .filter((item) => item.type === "video" && item.videoId)
            .map((item) => ({
              id: item.videoId,
              libraryId: "invidious",
              title: item.title,
              type: "youtube",
              path: item.videoId,
              metadata: {
                artwork: item.videoThumbnails?.[3]?.url ?? item.videoThumbnails?.[0]?.url,
                description: item.description,
                providers: ["Invidious"],
              },
            })),
        );
      } else {
        const { data } = await api.get<any>("/api/youtube/search", { params: { q: query } });
        setResults(
          data.items.map((item: any) => ({
            id: item.id.videoId,
            libraryId: "youtube",
            title: item.snippet.title,
            type: "youtube",
            path: item.id.videoId,
            metadata: {
              artwork: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
              description: item.snippet.description,
              providers: ["YouTube"],
            },
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-sm text-white/60">
          Search YouTube with Invidious proxy or official API, add channels to your collections, and queue ad-free
          playback.
        </p>
        <form onSubmit={performSearch} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            placeholder="Search YouTube titles, channels, or playlists"
            className="w-full flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            required
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
            disabled={loading}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>
      </header>

      {results.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/50">
          Results appear here once you search.
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {results.map((item) => (
            <LibraryCard key={item.id} media={item} onPlay={onPlay} onDetails={onDetails} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
