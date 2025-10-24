import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "node:http";
import { registerRoutes } from "./routes/index.js";
import { getSettings, updateSettings } from "./services/settings.js";

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  registerRoutes(app);

  const server = http.createServer(app);

  const settings = await getSettings();
  const envPort = process.env.PORT ? Number(process.env.PORT) : undefined;
  const port = envPort ?? settings.port ?? 37915;

  if (envPort && envPort !== settings.port) {
    await updateSettings({ port: envPort });
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`Syntrix backend listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start Syntrix backend", error);
  process.exitCode = 1;
});
