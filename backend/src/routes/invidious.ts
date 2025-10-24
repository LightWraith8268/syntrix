import { Express, Request, Response } from "express";
import { getSettings } from "../services/settings.js";
import { invidiousChannel, invidiousPlaylist, invidiousSearch, invidiousVideo } from "../services/invidious.js";

export function registerInvidiousRoutes(app: Express) {
  app.get("/api/invidious/search", async (req: Request, res: Response) => {
    const query = String(req.query.q ?? "");
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    try {
      const settings = await getSettings();
      if (!settings.invidiousEnabled) {
        res.status(503).json({ error: "Invidious is disabled" });
        return;
      }

      const data = await invidiousSearch(query);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/invidious/channel/:id", async (req: Request, res: Response) => {
    try {
      const settings = await getSettings();
      if (!settings.invidiousEnabled) {
        res.status(503).json({ error: "Invidious is disabled" });
        return;
      }

      const data = await invidiousChannel(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/invidious/playlist/:id", async (req: Request, res: Response) => {
    try {
      const settings = await getSettings();
      if (!settings.invidiousEnabled) {
        res.status(503).json({ error: "Invidious is disabled" });
        return;
      }

      const data = await invidiousPlaylist(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/invidious/video/:id", async (req: Request, res: Response) => {
    try {
      const settings = await getSettings();
      if (!settings.invidiousEnabled) {
        res.status(503).json({ error: "Invidious is disabled" });
        return;
      }

      const data = await invidiousVideo(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
