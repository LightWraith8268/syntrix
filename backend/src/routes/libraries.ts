import { Express, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { v4 as uuid } from "uuid";

export function registerLibraryRoutes(app: Express) {
  app.get("/api/libraries", async (_req: Request, res: Response) => {
    try {
      const libraries = await prisma.library.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(libraries);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/libraries/:id/media", async (req: Request, res: Response) => {
    try {
      const media = await prisma.media.findMany({
        where: { libraryId: req.params.id },
        orderBy: { updatedAt: "desc" },
      });
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/libraries", async (req: Request, res: Response) => {
    const { name, type, path, metadataSource, accentColor } = req.body ?? {};

    if (!name || !type || !path) {
      res.status(400).json({ error: "name, type, and path are required" });
      return;
    }

    try {
      const libraryType = String(type).toLowerCase();
      const library = await prisma.library.create({
        data: {
          id: uuid(),
          name,
          type: libraryType,
          path,
          metadataSource,
          accentColor,
        },
      });
      res.status(201).json(library);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.delete("/api/libraries/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.media.deleteMany({ where: { libraryId: id } });
      await prisma.library.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
