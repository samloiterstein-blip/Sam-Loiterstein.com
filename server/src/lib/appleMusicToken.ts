import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readPrivateKey(): string | null {
  const inline = process.env.APPLE_MUSIC_PRIVATE_KEY;
  if (inline) return inline.replace(/\\n/g, "\n");

  const keyPath = process.env.APPLE_MUSIC_PRIVATE_KEY_PATH;
  if (!keyPath) return null;

  const resolved = path.isAbsolute(keyPath)
    ? keyPath
    : path.resolve(__dirname, "..", "..", keyPath);

  if (!fs.existsSync(resolved)) return null;
  return fs.readFileSync(resolved, "utf8");
}

export function createAppleDeveloperToken(): string {
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const privateKey = readPrivateKey();

  if (!teamId || !keyId || !privateKey) {
    throw new Error("Apple Music credentials are not configured");
  }

  return jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "1h",
    issuer: teamId,
    header: { alg: "ES256", kid: keyId },
  });
}
