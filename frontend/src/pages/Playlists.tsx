import { FormEvent, useState } from "react";
import { useSyntrixStore } from "../state/store";
import { api } from "../utils/api";
import type { Media, Playlist } from "../types";
import { LibraryCard } from "../components/LibraryCard";

interface Props {
  onPlay: (media: Media) => void;
  onDetails: (media: Media) => void;
}

export function PlaylistsPage({ onPlay, onDetails }: Props) {
  const playlists = useSyntrixStore((state) => state.playlists);
  const media = useSyntrixStore((state) => state.media);
  const libraries = useSyntrixStore((state) => state.libraries);
  const { setPlaylists } = useSyntrixStore((state) => state.actions);

  const [name, setName] = useState("");

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name) {
      return;
    }
    const { data } = await api.post<Playlist>("/api/playlists", { name, mediaIds: [] });
    setPlaylists([data, ...playlists]);
    setName("");
  };

  const resolveMediaById = (mediaId: string) => {
    for (const library of libraries) {
      const items = media[library.id] ?? [];
      const match = items.find((item) => item.id === mediaId);
      if (match) {
        return match;
      }
    }
    return undefined;
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Playlists</h1>
        <p className="text-sm text-white/60">
          Curate cross-media playlists mixing local films, music, audiobooks, and YouTube favorites.
        </p>
      </header>

      <form onSubmit={handleCreate} className="flex max-w-md gap-3">
        <input
          type="text"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40"
          placeholder="Late Night Queue"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white"
        >
          Create
        </button>
      </form>

      {playlists.length === 0 ? (
        <p className="text-sm text-white/50">No playlists yet. Create one and add titles from cards across the app.</p>
      ) : (
        <div className="space-y-10">
          {playlists.map((playlist) => {
            const items = playlist.mediaIds.map((id) => resolveMediaById(id)).filter(Boolean) as Media[];
            return (
              <section key={playlist.id} className="space-y-4">
                <header className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{playlist.name}</h2>
                    <p className="text-sm text-white/50">{items.length} items</p>
                  </div>
                </header>
                {items.length ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((item) => (
                      <LibraryCard key={item.id} media={item} onPlay={onPlay} onDetails={onDetails} />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/50">
                    Empty playlist. Use the + button on cards to add media here.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
