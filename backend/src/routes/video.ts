import { Express, Request, Response } from "express";
import { getSettings } from "../services/settings.js";
import { invidiousVideo } from "../services/invidious.js";
import { resolveYoutubeStream } from "../services/youtube.js";

export function registerVideoRoutes(app: Express) {
  app.get("/api/video", async (req: Request, res: Response) => {
    const id = String(req.query.id ?? "");
    if (!id) {
      res.status(400).json({ error: "id is required" });
      return;
    }

    try {
      const settings = await getSettings();

      if (settings.invidiousEnabled) {
        try {
          const video = await invidiousVideo(id);
          const format =
            video.formatStreams?.find((f: any) => f.quality === "hd720") ??
            video.formatStreams?.[0] ??
            video.adaptiveFormats?.[0];

          if (format?.url) {
            res.json({
              backend: "invidious",
              url: format.url,
              type: format.type,
              quality: format.quality,
            });
            return;
          }
        } catch (error) {
          console.warn("Invidious streaming fallback", error);
        }
      }

      const stream = await resolveYoutubeStream(id);
      res.json({ backend: "youtube", ...stream });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
