import { Express, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { v4 as uuid } from "uuid";

function parseMediaIds(input: string | string[] | undefined) {
  if (!input) {
    return [];
  }
  if (Array.isArray(input)) {
    return input;
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return input.split(",").map((id) => id.trim());
    }
  }
  return [];
}

export function registerPlaylistRoutes(app: Express) {
  app.get("/api/playlists", async (_req: Request, res: Response) => {
    try {
      const playlists = await prisma.playlist.findMany();
      res.json(
        playlists.map((playlist) => ({
          ...playlist,
          mediaIds: parseMediaIds(playlist.mediaIds),
        })),
      );
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/playlists", async (req: Request, res: Response) => {
    const { name, mediaIds } = req.body ?? {};
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }

    try {
      const playlist = await prisma.playlist.create({
        data: {
          id: uuid(),
          name,
          mediaIds: JSON.stringify(mediaIds ?? []),
        },
      });
      res.status(201).json({ ...playlist, mediaIds: parseMediaIds(playlist.mediaIds) });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/playlists/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, mediaIds } = req.body ?? {};

    try {
      const playlist = await prisma.playlist.update({
        where: { id },
        data: {
          ...(name ? { name } : {}),
          ...(mediaIds !== undefined ? { mediaIds: JSON.stringify(mediaIds) } : {}),
        },
      });
      res.json({ ...playlist, mediaIds: parseMediaIds(playlist.mediaIds) });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/playlists/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.playlist.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
