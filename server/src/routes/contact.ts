import { Router } from "express";
import nodemailer, { type Transporter } from "nodemailer";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot. Bots fill this. Humans do not see it. */
  company?: unknown;
};

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

let transporterPromise: Promise<Transporter> | null = null;

function getTransporter(): Promise<Transporter> | null {
  if (!process.env.SMTP_HOST) return null;
  if (!transporterPromise) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASSWORD
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
            : undefined,
      })
    );
  }
  return transporterPromise;
}

router.post("/", async (req, res) => {
  const body = (req.body ?? {}) as ContactBody;

  if (asString(body.company)) {
    return res.json({ ok: true });
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const message = asString(body.message);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "All fields are required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "Please provide a valid email." });
  }
  if (message.length > 5000) {
    return res.status(400).json({ ok: false, error: "Message is too long." });
  }

  const to = process.env.CONTACT_TO || "samloiterstein@gmail.com";
  const from = process.env.CONTACT_FROM || `Website <noreply@sam-loiterstein.com>`;

  const subject = `New contact form message from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif; color:#22221f; line-height:1.55;">
      <h2 style="margin:0 0 16px; font-weight:600;">New contact form message</h2>
      <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 16px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 4px; color:#5e5e58; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Message</p>
      <div style="white-space:pre-wrap; padding:12px 14px; background:#f3f7f4; border:1px solid #c6d8c9; border-radius:8px;">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    const transporter = getTransporter();

    if (!transporter) {
      console.log("\n[contact] (no SMTP configured). Message would have been sent:");
      console.log(text, "\n");
      return res.json({ ok: true, mocked: true });
    }

    const t = await transporter;
    await t.sendMail({
      to,
      from,
      replyTo: email,
      subject,
      text,
      html,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to send:", err);
    return res.status(500).json({
      ok: false,
      error: "Unable to send your message right now. Please email me directly.",
    });
  }
});

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default router;
