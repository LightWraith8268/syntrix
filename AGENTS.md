# Repository Guidelines

## Project Structure & Module Organization
- `backend/`: Node.js + Express API with Prisma ORM, metadata services, and Tailscale integrations. TypeScript sources live in `backend/src`, schema at `backend/prisma/schema.prisma`.
- `frontend/`: React/Vite SPA using TailwindCSS, Framer Motion, and Plyr. Entry point `frontend/src/App.tsx`; public assets (icons, artwork) under `frontend/public/`.
- `tauri/`: Desktop shell configuration. Rust bootstrap in `tauri/src-tauri/src/main.rs`, settings in `tauri/tauri.conf.json`.
- `README.md`: Environment setup and workflow overview. `AGENTS.md` (this file) supplements contributor expectations.

## Build, Test, and Development Commands
- Backend dev server: `cd backend && npm install && npm run dev` — starts Express with hot-reload via `ts-node-dev`.
- Backend build: `npm run build` — emits compiled JS under `backend/dist`.
- Frontend dev: `cd frontend && npm install && npm run dev` — launches Vite at `5173` with API proxying to the backend.
- Frontend build: `npm run build` — produces optimized assets in `frontend/dist`.
- Tauri dev: `cd tauri && npm install && npm run dev` — runs the desktop shell (requires backend running separately).
- Prisma migrations: `npx prisma migrate dev --name <migration>` — creates/updates the SQLite schema.

## Coding Style & Naming Conventions
- TypeScript preferred throughout; keep files in strict module directories (`routes`, `services`, `components`, `state`, `utils`).
- Use 2-space indentation (default in project files); maintain existing import groupings.
- Component filenames in PascalCase (`LibraryCard.tsx`), hooks in camelCase (`useLibraryScanner.ts`), and services in camelCase (`metadataFetcher.ts`).
- Run formatters/linters from toolchain (e.g., rely on TypeScript compiler and Tailwind classes). If adding Prettier/ESLint, document in README.

## Testing Guidelines
- No automated test suite yet; when introducing tests, colocate under `backend/tests` or `frontend/src/__tests__` and note the chosen framework.
- Name test files after the module (`libraryScanner.test.ts`, `LibraryCard.test.tsx`).
- Ensure commands to run tests are added to package scripts (e.g., `npm test`) when tests exist.

## Commit & Pull Request Guidelines
- Follow conventional, descriptive commit messages (e.g., `feat: add metadata refresh hook`, `fix: guard tailscale status`).
- Keep commits focused; prefer multiple targeted commits over a single broad change set.
- PRs should include: summary of changes, testing notes (commands executed), screenshots/gifs for UI tweaks, and linked issue references if applicable.
- Ensure README/AGENTS updates accompany changes that alter setup, scripts, or contributor expectations.
