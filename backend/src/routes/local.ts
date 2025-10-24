import { Express, Request, Response } from "express";
import fs from "node:fs";
import mime from "mime-types";
import { prisma } from "../prisma.js";

export function registerLocalStreamRoutes(app: Express) {
  app.get("/api/local/stream/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const media = await prisma.media.findUnique({ where: { id } });
      if (!media) {
        res.status(404).json({ error: "Media not found" });
        return;
      }

      const stat = fs.statSync(media.path);
      const fileSize = stat.size;
      const contentType = mime.lookup(media.path) || "application/octet-stream";
      const range = req.headers.range;

      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
        const start = Number.parseInt(startStr ?? "0", 10);
        const end = endStr ? Number.parseInt(endStr, 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": contentType,
        });

        fs.createReadStream(media.path, { start, end }).pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": contentType,
        });
        fs.createReadStream(media.path).pipe(res);
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
