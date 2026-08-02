import "dotenv/config";
import { testSupabaseConnection } from "../src/lib/genreFeedService.js";

const result = await testSupabaseConnection();
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);
