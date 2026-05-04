import "dotenv/config";
import app from "./app.js";
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  if (!process.env.SMTP_HOST) {
    console.log("[server] SMTP not configured. Contact submissions will be logged to the console.");
  }
});
