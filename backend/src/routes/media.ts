import { Express, Request, Response } from "express";
import { prisma } from "../prisma.js";

export function registerMediaRoutes(app: Express) {
  app.get("/api/media/:id", async (req: Request, res: Response) => {
    try {
      const media = await prisma.media.findUnique({ where: { id: req.params.id } });
      if (!media) {
        res.status(404).json({ error: "Media not found" });
        return;
      }
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.patch("/api/media/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { progress } = req.body ?? {};

    try {
      const updated = await prisma.media.update({
        where: { id },
        data: {
          ...(progress !== undefined ? { progress: Number(progress) } : {}),
          updatedAt: new Date(),
        },
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
