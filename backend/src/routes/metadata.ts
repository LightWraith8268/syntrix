import { Express, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { resolveMetadata } from "../services/metadataFetcher.js";

export function registerMetadataRoutes(app: Express) {
  app.get("/api/metadata/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const refresh = req.query.refresh === "true";

    try {
      const media = await prisma.media.findUnique({
        where: { id },
        include: { library: true },
      });

      if (!media) {
        res.status(404).json({ error: "Media not found" });
        return;
      }

      if (refresh) {
        const metadata = await resolveMetadata(
          media.library.type as any,
          media.title,
          media.path,
        );
        if (metadata) {
          await prisma.media.update({
            where: { id },
            data: { metadata },
          });
          media.metadata = metadata as any;
        }
      }

      res.json(media);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
