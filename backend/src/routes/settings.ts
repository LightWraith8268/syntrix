import { Express, Request, Response } from "express";
import { getSettings, updateSettings } from "../services/settings.js";
import { getTailscaleStatus } from "../services/tailscale.js";

export function registerSettingsRoutes(app: Express) {
  app.get("/api/settings", async (_req: Request, res: Response) => {
    try {
      const settings = await getSettings();
      const tailscale = settings.tailscaleEnabled ? await getTailscaleStatus() : null;
      res.json({ settings, tailscale });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/settings", async (req: Request, res: Response) => {
    const { port, tailscaleEnabled, invidiousEnabled, invidiousInstance, accessToken } = req.body ?? {};

    const updates: Record<string, unknown> = {};
    if (port !== undefined) {
      updates.port = Number(port);
    }
    if (tailscaleEnabled !== undefined) {
      updates.tailscaleEnabled = Boolean(tailscaleEnabled);
    }
    if (invidiousEnabled !== undefined) {
      updates.invidiousEnabled = Boolean(invidiousEnabled);
    }
    if (invidiousInstance !== undefined) {
      updates.invidiousInstance = String(invidiousInstance);
    }
    if (accessToken !== undefined) {
      updates.accessToken = accessToken ? String(accessToken) : null;
    }

    try {
      const settings = await updateSettings(updates);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });
}
