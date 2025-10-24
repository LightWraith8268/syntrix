import { Express, Request, Response } from "express";
import { youtubeSearch, youtubeChannel, youtubePlaylist, youtubeVideo } from "../services/youtube.js";

export function registerYouTubeRoutes(app: Express) {
  app.get("/api/youtube/search", async (req: Request, res: Response) => {
    const query = String(req.query.q ?? "");
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    try {
      const results = await youtubeSearch(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/youtube/channel/:id", async (req: Request, res: Response) => {
    try {
      const channel = await youtubeChannel(req.params.id);
      res.json(channel);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/youtube/playlist/:id", async (req: Request, res: Response) => {
    try {
      const playlist = await youtubePlaylist(req.params.id);
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/youtube/video/:id", async (req: Request, res: Response) => {
    try {
      const video = await youtubeVideo(req.params.id);
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
