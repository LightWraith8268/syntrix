import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSyntrixStore } from "../state/store";
import { LibraryCard } from "../components/LibraryCard";
import { MetadataPanel } from "../components/MetadataPanel";
import type { Media } from "../types";

interface Props {
  onPlay: (media: Media) => void;
  onDetails: (media: Media) => void;
}

export function LibraryViewPage({ onPlay, onDetails }: Props) {
  const params = useParams<{ id: string }>();
  const libraries = useSyntrixStore((state) => state.libraries);
  const media = useSyntrixStore((state) => state.media);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [search, setSearch] = useState("");

  const library = libraries.find((item) => item.id === params.id);
  const items = media[library?.id ?? ""] ?? [];

  const filtered = useMemo(() => {
    if (!search) {
      return items;
    }
    const query = search.toLowerCase();
    return items.filter((item) => item.title.toLowerCase().includes(query));
  }, [items, search]);

  if (!library) {
    return <p className="text-white/60">Library not found.</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{library.name}</h1>
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">{library.type}</p>
          </div>
          <input
            type="search"
            placeholder="Filter titles..."
            className="w-full max-w-sm rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </header>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/50">
            No media detected. Trigger a rescan from the Settings page after adding files to <strong>{library.path}</strong>.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <LibraryCard
                key={item.id}
                media={item}
                accentColor={library.accentColor}
                onPlay={(mediaItem) => {
                  setSelectedMedia(mediaItem);
                  onPlay(mediaItem);
                }}
                onDetails={(mediaItem) => {
                  setSelectedMedia(mediaItem);
                  onDetails(mediaItem);
                }}
              />
            ))}
          </div>
        )}
      </motion.section>
      <MetadataPanel media={selectedMedia} />
    </div>
  );
}
