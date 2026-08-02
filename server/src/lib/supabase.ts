import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let client: SupabaseClient | null = null;
let lastKeyUsed: string | null = null;

function readSecretKeyFile(): string | null {
  const configured = process.env.SUPABASE_SECRET_KEY_PATH;
  const candidates = [
    configured,
    path.resolve(__dirname, "../../secrets/supabase-secret.key"),
    path.resolve(__dirname, "../../secrets/supabase-secret.txt"),
  ].filter(Boolean) as string[];

  for (const filePath of candidates) {
    const resolved = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(__dirname, "../..", filePath);
    if (fs.existsSync(resolved)) {
      const value = fs.readFileSync(resolved, "utf8").trim();
      if (value) return value;
    }
  }
  return null;
}

export function resolveSupabaseKey(): string | null {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    readSecretKeyFile() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    null
  );
}

export function isLegacyKeyDisabledError(message: string): boolean {
  return message.toLowerCase().includes("legacy api keys are disabled");
}

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = resolveSupabaseKey();

  if (!url || !key) return null;

  if (!client || lastKeyUsed !== key) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    lastKeyUsed = key;
  }
  return client;
}

export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  keyType: "secret" | "legacy" | "missing";
  eventCount?: number;
  error?: string;
}> {
  const key = resolveSupabaseKey();
  if (!key) {
    return { ok: false, keyType: "missing", error: "No Supabase secret key configured" };
  }

  const keyType = key.startsWith("sb_secret_") ? "secret" : "legacy";
  const sb = getSupabase();
  if (!sb) {
    return { ok: false, keyType, error: "Supabase client could not be created" };
  }

  const now = new Date().toISOString();
  const { count, error } = await sb
    .from("events")
    .select("id", { count: "exact", head: true })
    .gte("event_date", now);

  if (error) {
    const msg =
      error.message ||
      (error as { hint?: string }).hint ||
      "Supabase query failed";
    return { ok: false, keyType, error: msg };
  }

  return { ok: true, keyType, eventCount: count ?? 0 };
}
