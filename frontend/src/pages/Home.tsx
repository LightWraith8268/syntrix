import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSyntrixStore } from "../state/store";
import { CarouselRow } from "../components/CarouselRow";
import { LibraryCard } from "../components/LibraryCard";
import type { Media } from "../types";
import { resolveArtwork } from "../utils/metadata";

interface Props {
  onPlay: (media: Media) => void;
  onDetails: (media: Media) => void;
}

export function HomePage({ onPlay, onDetails }: Props) {
  const libraries = useSyntrixStore((state) => state.libraries);
  const media = useSyntrixStore((state) => state.media);

  const heroMedia = useMemo(() => {
    for (const library of libraries) {
      const items = media[library.id];
      if (items?.length) {
        return items[0];
      }
    }
    return null;
  }, [libraries, media]);

  return (
    <div className="space-y-12">
      {heroMedia ? (
        <motion.section
          className="relative overflow-hidden rounded-3xl bg-[#101018] p-10 shadow-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={resolveArtwork(heroMedia)}
            alt={heroMedia.title}
            className="absolute inset-0 h-full w-full object-cover opacity-30 blur-xl"
          />
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-accent">Continue Watching</p>
            <h1 className="text-4xl font-bold md:text-5xl">{heroMedia.title}</h1>
            <p className="max-w-2xl text-base text-white/70">{heroMedia.metadata?.description}</p>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em]"
                onClick={() => onPlay(heroMedia)}
              >
                Play
              </button>
              <button
                type="button"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/80"
                onClick={() => onDetails(heroMedia)}
              >
                Details
              </button>
            </div>
          </div>
        </motion.section>
      ) : null}

      {libraries.map((library) => {
        const items = media[library.id] ?? [];
        if (items.length === 0) {
          return null;
        }
        return (
          <CarouselRow key={library.id} title={library.name}>
            {items.map((item) => (
              <LibraryCard
                key={item.id}
                media={item}
                accentColor={library.accentColor}
                onPlay={onPlay}
                onDetails={onDetails}
              />
            ))}
          </CarouselRow>
        );
      })}
    </div>
  );
}
