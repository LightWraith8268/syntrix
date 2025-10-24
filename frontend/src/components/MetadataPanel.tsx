import type { Media } from "../types";
import { formatRuntime } from "../utils/fileParser";

interface Props {
  media?: Media | null;
}

export function MetadataPanel({ media }: Props) {
  if (!media) {
    return (
      <aside className="rounded-2xl bg-white/5 p-6 text-white/60">
        Select a title to see detailed metadata, synopsis, and artwork.
      </aside>
    );
  }

  return (
    <aside className="space-y-4 rounded-2xl bg-white/5 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-accent">{media.type}</p>
        <h3 className="mt-2 text-2xl font-semibold">{media.title}</h3>
        <p className="mt-1 text-sm text-white/60">{media.metadata?.description}</p>
      </div>
      <dl className="space-y-2 text-sm text-white/70">
        {media.metadata?.year ? (
          <div className="flex items-center justify-between">
            <dt className="uppercase tracking-widest text-xs text-white/40">Year</dt>
            <dd>{media.metadata.year}</dd>
          </div>
        ) : null}
        {media.metadata?.genres?.length ? (
          <div className="flex items-center justify-between">
            <dt className="uppercase tracking-widest text-xs text-white/40">Genres</dt>
            <dd>{media.metadata.genres.slice(0, 5).join(", ")}</dd>
          </div>
        ) : null}
        {media.metadata?.runtimeSeconds ? (
          <div className="flex items-center justify-between">
            <dt className="uppercase tracking-widest text-xs text-white/40">Runtime</dt>
            <dd>{formatRuntime(media.metadata.runtimeSeconds)}</dd>
          </div>
        ) : null}
        {media.metadata?.providers?.length ? (
          <div className="flex items-center justify-between">
            <dt className="uppercase tracking-widest text-xs text-white/40">Providers</dt>
            <dd>{media.metadata.providers.join(", ")}</dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}
