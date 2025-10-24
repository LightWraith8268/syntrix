import { Express, Request, Response } from "express";
import { scanLibrary } from "../services/libraryScanner.js";

export function registerScanRoutes(app: Express) {
  app.post("/api/scan", async (req: Request, res: Response) => {
    const { libraryId, refreshMetadata = true, dryRun = false } = req.body ?? {};

    if (!libraryId) {
      res.status(400).json({ error: "libraryId is required" });
      return;
    }

    try {
      const result = await scanLibrary(libraryId, { refreshMetadata, dryRun });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
