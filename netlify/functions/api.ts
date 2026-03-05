import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// Normalize Netlify function base path and ensure /api prefix
app.use((req, _res, next) => {
  if (req.url.startsWith("/.netlify/functions/api")) {
    req.url = req.url.replace("/.netlify/functions/api", "") || "/";
  }

  if (!req.url.startsWith("/api/")) {
    req.url = req.url.startsWith("/") ? `/api${req.url}` : `/api/${req.url}`;
  }

  next();
});

let routesReady: Promise<void> | null = null;
const ensureRoutes = async () => {
  if (!routesReady) {
    routesReady = registerRoutes(app).then(() => undefined);
  }
  return routesReady;
};

const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  await ensureRoutes();
  return serverlessHandler(event, context);
};
