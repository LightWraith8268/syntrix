# Syntrix Hybrid Media Platform

Syntrix is a self-hosted, cinematic media hub that blends the polish of Netflix and Disney+ with local library management, ad-free YouTube browsing, and secure remote streaming via Tailscale. It ships as a full-stack TypeScript application (React + Node.js) with an optional Tauri desktop wrapper and uses SQLite through Prisma for persistence.

## Key Features

- **Unified media collections** — Movies, TV shows, music, audiobooks, and custom libraries with fast glob scanning and ffprobe-assisted metadata parsing.
- **Dynamic metadata enrichment** — Integrations with TMDB, OMDb, MusicBrainz, Audible (placeholder), and local ffprobe details that cache directly in SQLite.
- **YouTube & Invidious integration** — Toggle between the official YouTube Data API or Invidious proxy for search, channels, playlists, and stream URL resolution.
- **Tailscale-powered remote streaming** — Backend listens on `0.0.0.0:37915` (configurable) to serve remote devices across a tailnet with WireGuard encryption and automatic status reporting.
- **Plyr-driven playback** — Custom HTML5 player with resume support, progress syncing, and auto-buffer tuning for local vs. remote connections.
- **Cross-platform desktop** — Tauri wrapper packages the React frontend and Node backend for Windows/macOS/Linux with file system access scoped for local media libraries.

## Repository Structure

```
backend/      # Node.js + Express API, Prisma schema, metadata engines, Tailscale integration
frontend/     # React + Vite + Tailwind SPA with Framer Motion and Plyr
tauri/        # Tauri configuration and Rust bootstrap for desktop packaging
```

## Backend Setup (`backend/`)

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Fill in API keys as needed (`TMDB_API_KEY`, `OMDB_API_KEY`, `YOUTUBE_API_KEY`, `INVIDIOUS_INSTANCE`, etc.). The server defaults to port `37915`.
3. Generate Prisma client and apply migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start the API (development):
   ```bash
   npm run dev
   ```
   The Express server exposes REST endpoints under `/api/*` and listens on all interfaces for Tailscale access.

### Notable API Routes

- `GET /api/libraries` / `POST /api/libraries` — Manage library records.
- `POST /api/scan` — Recursively scan a library path and hydrate metadata.
- `GET /api/libraries/:id/media` — List media records for a library.
- `GET /api/metadata/:id?refresh=true` — Retrieve or refresh metadata for a media item.
- `GET /api/local/stream/:id` — Range-enabled streaming for local files.
- `GET /api/video?id=` — Resolve YouTube/Invidious stream URLs.
- `GET /api/invidious/*` & `/api/youtube/*` — Proxy search and metadata.
- `GET /api/settings` / `PUT /api/settings` — Manage port, Tailscale, and Invidious toggles.
- `GET /api/playlists` / `POST /api/playlists` — Manage cross-library playlists.

## Frontend Setup (`frontend/`)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Environment:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_SERVER_ORIGIN` if the backend runs on a different host or custom port.
3. Run the Vite dev server:
   ```bash
   npm run dev
   ```
   The UI defaults to `http://localhost:5173` and proxies `/api/*` to the backend.

### UI Highlights

- Sidebar navigation with live library listing (`SidebarNav`).
- Netflix-style carousels (`HomePage`, `CarouselRow`, `LibraryCard`).
- Library detail views with filtering and metadata drawer.
- Explore view for YouTube/Invidious searches and instant playback.
- Plyr-based modal player (`Player`) with local vs. remote buffering heuristics.
- Settings dashboard showing Tailscale status, port configuration, and Invidious controls.

## Desktop Packaging (`tauri/`)

1. Install the Tauri CLI:
   ```bash
   cd tauri
   npm install
   ```
2. Development mode (spawns the Vite dev server defined in `tauri.conf.json`):
   ```bash
   npm run dev
   ```
   Ensure the backend API is running separately before launching the desktop shell.
3. Build installers/bundles:
   ```bash
   npm run build
   ```

Tauri is configured with broad filesystem access (scoped to `**`) so libraries can be read locally. Adjust `tauri/tauri.conf.json` if you need stricter policies.

## Tailscale Integration

- Run `tailscale up` on the host machine.
- From Settings → Remote Access, Syntrix surfaces hostname, tailnet suffix, and tailnet IP via `tailscale status --json`.
- Remote clients can reach the UI using `http://<hostname>.<tailnet>.ts.net:PORT`. Example: `http://riley-pc.tailnet-riley.ts.net:37915`.
- Optional `ACCESS_TOKEN` can enforce bearer-style auth across tailnet devices.

## Invidious Toggle

- Enabled by default (`settings.invidiousEnabled`).
- Update via Settings page or REST (`PUT /api/settings`).
- Change instance URL in the same panel or via `.env`.
- Automatic fallback to YouTube Data API (or `ytdl-core`) if the Invidious request fails.

## Database & Metadata Cache

- SQLite database located at `backend/syntrix.db` (ignored via `.gitignore`).
- Metadata cached in `media.metadata` JSON with provider provenance.
- Local artwork cached under `frontend/public/artwork/` placeholders; extend with actual posters if desired.

## Sample Workflows

1. **Create a movie library:** Use Settings → Libraries to pick a folder, Syntrix scans via `fast-glob`, infers titles, and fetches TMDB data.
2. **Search YouTube ad-free:** Explore → Search with Invidious enabled for instant playback via `/api/video`.
3. **Stream remotely:** Launch backend (`npm run dev`), front-end (`npm run dev`), connect devices over Tailscale, and play from a phone using the tailnet URL.
4. **Desktop mode:** Package with Tauri for a native window that leverages the same backend.

## Testing & Next Steps

- Automated tests are not yet included; recommended next steps involve adding Jest/Playwright suites and integration tests for scanning workflows.
- Consider expanding playlist editing (drag-and-drop), Supabase sync, or FFmpeg-based transcoding as outlined in future enhancements.

## Troubleshooting

- **Port in use:** Update port via Settings or `.env`, then restart the backend.
- **Metadata missing:** Trigger a library rescan or run `GET /api/metadata/:id?refresh=true`.
- **Invidious offline:** Disable toggle in Settings to fall back to YouTube Data API.
- **Tauri backend access:** Start the backend manually before launching the desktop shell, or extend `src-tauri/src/main.rs` to spawn a Node sidecar during startup.

---

Happy streaming! 🎬🎧📺
