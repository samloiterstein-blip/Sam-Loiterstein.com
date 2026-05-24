import "dotenv/config";
import { sendContactTestEmail } from "../src/lib/contact.js";

const result = await sendContactTestEmail();

if (!result.ok) {
  console.error("Contact test failed:", result.error);
  process.exit(1);
}

if (result.mocked) {
  console.log("SMTP is not configured. Message was logged to the console only.");
  process.exit(0);
}

console.log("Contact test email sent to", process.env.CONTACT_TO || "samloiterstein@gmail.com");
