import { Express } from "express";
import { registerLibraryRoutes } from "./libraries.js";
import { registerPlaylistRoutes } from "./playlists.js";
import { registerSettingsRoutes } from "./settings.js";
import { registerScanRoutes } from "./scan.js";
import { registerMetadataRoutes } from "./metadata.js";
import { registerInvidiousRoutes } from "./invidious.js";
import { registerYouTubeRoutes } from "./youtube.js";
import { registerVideoRoutes } from "./video.js";
import { registerMediaRoutes } from "./media.js";
import { registerLocalStreamRoutes } from "./local.js";

export function registerRoutes(app: Express) {
  registerLibraryRoutes(app);
  registerScanRoutes(app);
  registerMetadataRoutes(app);
  registerInvidiousRoutes(app);
  registerYouTubeRoutes(app);
  registerVideoRoutes(app);
  registerPlaylistRoutes(app);
  registerSettingsRoutes(app);
  registerMediaRoutes(app);
  registerLocalStreamRoutes(app);
}
