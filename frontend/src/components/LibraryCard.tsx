import { motion } from "framer-motion";
import classNames from "classnames";
import type { Media } from "../types";
import { resolveArtwork, summarizeMetadata } from "../utils/metadata";

interface Props {
  media: Media;
  accentColor?: string | null;
  onPlay?: (media: Media) => void;
  onDetails?: (media: Media) => void;
}

export function LibraryCard({ media, accentColor, onPlay, onDetails }: Props) {
  const artwork = resolveArtwork(media);
  const badgeStyle = accentColor
    ? {
        borderColor: accentColor,
        color: accentColor,
      }
    : undefined;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-48 cursor-pointer overflow-hidden rounded-xl bg-[#141414] shadow-lg"
      onClick={() => onDetails?.(media)}
    >
      <div className="relative h-64">
        <img src={artwork} alt={media.title} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button
          type="button"
          className={classNames(
            "absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent text-accent transition-colors",
          )}
          onClick={(event) => {
            event.stopPropagation();
            onPlay?.(media);
          }}
        >
          ▶
        </button>
      </div>
      <div className="p-4">
        <p className="mb-1 line-clamp-1 text-sm uppercase tracking-wider text-white/60" style={badgeStyle}>
          {media.type}
        </p>
        <h3 className="line-clamp-2 text-base font-semibold text-white">{media.title}</h3>
        <p className="mt-1 text-xs text-white/60">{summarizeMetadata(media.metadata)}</p>
        {media.progress ? (
          <div className="mt-3 h-1 w-full rounded-full bg-white/10">
            <div className="h-full rounded-full bg-accent" style={{ width: `${media.progress * 100}%` }} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
