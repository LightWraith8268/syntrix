import { FormEvent, useState } from "react";
import { api } from "../utils/api";
import { useSyntrixStore } from "../state/store";
import { useLibraryScanner } from "../state/useLibraryScanner";
import { FolderPicker } from "./FolderPicker";
import type { Library, LibraryType } from "../types";

const LIBRARY_TYPES: Array<{ value: LibraryType; label: string }> = [
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
  { value: "music", label: "Music" },
  { value: "audiobook", label: "Audiobooks" },
  { value: "youtube", label: "YouTube Folders" },
  { value: "custom", label: "Custom" },
];

export function LibraryManager() {
  const { scanLibrary, scanning } = useLibraryScanner();
  const { setLibraries } = useSyntrixStore((state) => state.actions);
  const libraries = useSyntrixStore((state) => state.libraries);

  const [name, setName] = useState("");
  const [type, setType] = useState<LibraryType>("movie");
  const [path, setPath] = useState("");
  const [accentColor, setAccentColor] = useState("#E50914");

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !path) {
      return;
    }

    const { data } = await api.post<Library>("/api/libraries", {
      name,
      type,
      path,
      accentColor,
    });
    setLibraries([data, ...libraries]);
    setName("");
    void scanLibrary(data.id, true);
  };

  return (
    <section className="space-y-6 rounded-2xl bg-white/5 p-6">
      <header>
        <h2 className="text-xl font-semibold">Libraries</h2>
        <p className="text-sm text-white/60">
          Add folders for movies, shows, music, audiobooks, or custom content. Syntrix scans, fetches metadata, and
          builds cinematic carousels automatically.
        </p>
      </header>

      <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-widest text-white/60">Name</label>
          <input
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Cinematic Movies"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-widest text-white/60">Type</label>
          <select
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            value={type}
            onChange={(event) => setType(event.target.value as LibraryType)}
          >
            {LIBRARY_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <FolderPicker label="Folder Path" value={path} onChange={setPath} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-widest text-white/60">Accent Color</label>
          <input
            type="color"
            value={accentColor}
            onChange={(event) => setAccentColor(event.target.value)}
            className="h-12 w-full rounded-lg border border-white/10 bg-white/5"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={scanning}
            className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-50"
          >
            {scanning ? "Scanning…" : "Add Library"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">Existing Libraries</h3>
        {libraries.length === 0 ? (
          <p className="text-sm text-white/50">No libraries yet. Add one above to begin your cinematic hub.</p>
        ) : (
          <ul className="space-y-2 text-sm text-white/80">
            {libraries.map((library) => (
              <li key={library.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span>
                  <strong className="font-semibold">{library.name}</strong>{" "}
                  <span className="text-white/50">({library.type})</span>
                </span>
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/80 hover:border-accent hover:text-accent"
                  onClick={() => scanLibrary(library.id)}
                >
                  Rescan
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
