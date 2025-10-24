import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "plyr/dist/plyr.css";
import { SidebarNav } from "./components/SidebarNav";
import { HomePage } from "./pages/Home";
import { LibraryViewPage } from "./pages/LibraryView";
import { ExplorePage } from "./pages/Explore";
import { PlaylistsPage } from "./pages/Playlists";
import { SettingsPage } from "./pages/Settings";
import { useSyntrixStore } from "./state/store";
import { api } from "./utils/api";
import type { Library, Media, Playlist, StreamInfo } from "./types";
import { Player } from "./components/Player";
import { MetadataPanel } from "./components/MetadataPanel";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function App() {
  const location = useLocation();
  const { setLibraries, setMediaForLibrary, setPlaylists, setLoading } = useSyntrixStore((state) => state.actions);
  const libraries = useSyntrixStore((state) => state.libraries);
  const loading = useSyntrixStore((state) => state.loading);
  const [nowPlaying, setNowPlaying] = useState<Media | null>(null);
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [details, setDetails] = useState<Media | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [{ data: libraryData }, { data: playlistData }] = await Promise.all([
          api.get<Library[]>("/api/libraries"),
          api.get<Playlist[]>("/api/playlists"),
        ]);
        setLibraries(libraryData);
        setPlaylists(playlistData);

        await Promise.all(
          libraryData.map(async (library) => {
            const mediaResponse = await api.get<Media[]>(`/api/libraries/${library.id}/media`);
            setMediaForLibrary(library.id, mediaResponse.data);
          }),
        );
      } catch (error) {
        console.error("Failed to load Syntrix data", error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [setLibraries, setLoading, setMediaForLibrary, setPlaylists]);

  const handlePlay = async (media: Media) => {
    setNowPlaying(media);

    if (media.type === "youtube") {
      const { data } = await api.get<StreamInfo>("/api/video", { params: { id: media.id } });
      setStreamInfo(data);
      setPlayerOpen(true);
      return;
    }

    setStreamInfo({
      backend: "local",
      url: `${api.defaults.baseURL}/api/local/stream/${media.id}`,
      contentType: undefined,
    });
    setPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setPlayerOpen(false);
    setNowPlaying(null);
    setStreamInfo(null);
  };

  const connectionIndicator = useMemo(() => {
    const host = window.location.hostname;
    if (host.endsWith(".ts.net")) {
      return "Remote via Tailscale";
    }
    return "Local";
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-white">
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-white/10 bg-black/40 p-8 lg:flex">
        <div className="mb-10 space-y-1">
          <p className="text-xs uppercase tracking-[0.6em] text-white/40">Syntrix</p>
          <h1 className="text-3xl font-display font-semibold text-accent">Hybrid Media Hub</h1>
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">{connectionIndicator}</p>
        </div>
        <SidebarNav />
        <footer className="mt-auto pt-6 text-xs text-white/40">
          Secure streaming powered by Tailscale - Metadata by TMDB, MusicBrainz, Audible, Invidious.
        </footer>
      </aside>

      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4 lg:hidden">
          <h1 className="text-xl font-bold">Syntrix</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{connectionIndicator}</p>
        </header>
        <div className="px-6 py-8 lg:px-12">
          {loading ? (
            <div className="flex h-[60vh] items-center justify-center text-white/50">Loading cinematic libraries…</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28 }}
              >
                <Routes location={location}>
                  <Route path="/" element={<HomePage onPlay={handlePlay} onDetails={setDetails} />} />
                  <Route path="/explore" element={<ExplorePage onPlay={handlePlay} onDetails={setDetails} />} />
                  <Route path="/playlists" element={<PlaylistsPage onPlay={handlePlay} onDetails={setDetails} />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route
                    path="/library/:id"
                    element={<LibraryViewPage onPlay={handlePlay} onDetails={setDetails} />}
                  />
                </Routes>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <Player open={playerOpen} media={nowPlaying} stream={streamInfo} onClose={handleClosePlayer} />

      <AnimatePresence>
        {details ? (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetails(null)}
          >
            <motion.div
              className="w-full max-w-3xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <MetadataPanel media={details} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
