import fg from "fast-glob";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../prisma.js";
import { buildMediaId, getExtensionsForLibraryType, inferTitle } from "../utils/media.js";
import { resolveMetadata, type MediaType } from "./metadataFetcher.js";

interface ScanOptions {
  refreshMetadata?: boolean;
  dryRun?: boolean;
}

export async function scanLibrary(libraryId: string, options: ScanOptions = {}) {
  const library = await prisma.library.findUnique({ where: { id: libraryId } });
  if (!library) {
    throw new Error("Library not found");
  }

  await assertPathExists(library.path);

  const extensions = getExtensionsForLibraryType(library.type);
  const patterns = extensions.map((ext) => `**/*${ext}`);

  const files = await fg(patterns, {
    cwd: library.path,
    dot: false,
    onlyFiles: true,
    absolute: true,
    ignore: ["**/node_modules/**", "**/.git/**", "**/.DS_Store"],
  });

  const existingMedia = await prisma.media.findMany({ where: { libraryId } });
  const existingById = new Map(existingMedia.map((item) => [item.id, item]));

  const seenIds = new Set<string>();
  const results = [];

  for (const filePath of files) {
    const id = buildMediaId(filePath);
    seenIds.add(id);

    const title = inferTitle(filePath);
    const libraryType = normalizeLibraryType(library.type);
    const metadata = options.refreshMetadata
      ? await resolveMetadata(libraryType, title, filePath)
      : existingById.get(id)?.metadata ?? undefined;

    if (options.dryRun) {
      results.push({
        id,
        title,
        path: filePath,
        metadata,
      });
      continue;
    }

    const record = await prisma.media.upsert({
      where: { id },
      create: {
        id,
        libraryId,
        title,
        type: libraryType,
        path: filePath,
        metadata: metadata ?? undefined,
      },
      update: {
        title,
        path: filePath,
        metadata: metadata ?? undefined,
      },
    });

    results.push(record);
  }

  const mediaToRemove = existingMedia.filter((item) => !seenIds.has(item.id));
  if (!options.dryRun && mediaToRemove.length > 0) {
    await prisma.media.deleteMany({
      where: {
        id: { in: mediaToRemove.map((item) => item.id) },
      },
    });
  }

  return {
    library,
    added: results.length,
    removed: mediaToRemove.length,
    media: results,
  };
}

async function assertPathExists(targetPath: string) {
  try {
    const stats = await fs.stat(targetPath);
    if (!stats.isDirectory()) {
      throw new Error("Path is not a directory");
    }
  } catch (error) {
    throw new Error(`Library path not accessible: ${targetPath} (${(error as Error).message})`);
  }
}

function normalizeLibraryType(type: string | null | undefined): MediaType {
  const normalized = (type ?? "movie").toLowerCase();
  if (["movie", "tv", "music", "audiobook", "youtube"].includes(normalized)) {
    return normalized as MediaType;
  }
  return "movie";
}
