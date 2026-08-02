import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import contactRouter from "./routes/contact.js";
import substackRouter from "./routes/substack.js";
import musicRouter from "./routes/music.js";
import genreFeedRouter from "./routes/genreFeed.js";

const app = express();
const isProd = process.env.NODE_ENV === "production";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json({ limit: "32kb" }));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: isProd ? "production" : "development" });
});

app.use("/api/contact", contactRouter);
app.use("/api/substack-feed", substackRouter);
app.use("/api/music", musicRouter);
app.use("/api/demo/genre", genreFeedRouter);

if (isProd) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientDist = path.resolve(__dirname, "../../client/dist");

  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[server] error:", err);
  const message = err instanceof Error ? err.message : "Unexpected error";
  res.status(500).json({ ok: false, error: message });
});

export default app;
