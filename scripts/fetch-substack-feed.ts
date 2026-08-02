import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchSubstackFeed } from "../server/src/lib/substackFeed.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const host =
  process.env.SUBSTACK_PUBLICATION?.trim() ||
  process.env.VITE_SUBSTACK_PUBLICATION?.trim() ||
  "sloiterstein.substack.com";

async function main() {
  try {
    const feed = await fetchSubstackFeed(host, 8);
    const outPath = path.join(root, "client/public/substack-feed.json");
    writeFileSync(outPath, `${JSON.stringify(feed, null, 2)}\n`, "utf8");
    console.log(`[substack] Wrote ${feed.posts.length} posts to ${outPath}`);
  } catch (err) {
    console.warn("[substack] Feed fetch failed during build. Using empty snapshot.");
    console.warn(err instanceof Error ? err.message : err);
    const fallback = {
      publicationHost: host.replace(/^https?:\/\//, "").replace(/\/.*$/, ""),
      publicationUrl: `https://${host.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}`,
      fetchedAt: new Date().toISOString(),
      posts: [],
    };
    const outPath = path.join(root, "client/public/substack-feed.json");
    writeFileSync(outPath, `${JSON.stringify(fallback, null, 2)}\n`, "utf8");
    process.exit(0);
  }
}

main();
