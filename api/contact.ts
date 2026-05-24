import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import nodemailer, { type Transporter } from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function smtpConfigured(): boolean {
  const host = process.env.SMTP_HOST?.trim();
  return Boolean(host && host !== "smtp.example.com");
}

let transporterPromise: Promise<Transporter> | null = null;

function getTransporter(): Promise<Transporter> | null {
  if (!smtpConfigured()) return null;

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

function mailConfigured(): boolean {
  return resendConfigured() || smtpConfigured();
}

async function deliverMail(
  mail: {
    to: string;
    from: string;
    replyTo: string;
    subject: string;
    text: string;
    html: string;
  }
): Promise<void> {
  if (resendConfigured()) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: mail.from,
      to: [mail.to],
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      headers: {
        "X-Contact-Form": "sam-loiterstein.com",
      },
    });

    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("No mail transport configured");
  }

  const t = await transporter;
  await t.sendMail({
    to: mail.to,
    from: mail.from,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    headers: {
      "X-Contact-Form": "sam-loiterstein.com",
    },
  });
}

async function handleContactSubmission(body: ContactBody) {
  if (asString(body.company)) {
    return { ok: true as const };
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const message = asString(body.message);

  if (!name || !email || !message) {
    return { ok: false as const, status: 400, error: "All fields are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false as const, status: 400, error: "Please provide a valid email." };
  }
  if (message.length > 5000) {
    return { ok: false as const, status: 400, error: "Message is too long." };
  }

  const to = process.env.CONTACT_TO?.trim() || "samloiterstein@gmail.com";
  const from =
    process.env.CONTACT_FROM?.trim() || "Sam Loiterstein Website <noreply@sam-loiterstein.com>";
  const subject = `New contact form message from ${name}`;
  const text = [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n");
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif; color:#22221f; line-height:1.55;">
      <h2 style="margin:0 0 16px; font-weight:600;">New contact form message</h2>
      <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 16px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 4px; color:#5e5e58; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Message</p>
      <div style="white-space:pre-wrap; padding:12px 14px; background:#f3f7f4; border:1px solid #c6d8c9; border-radius:8px;">${escapeHtml(message)}</div>
    </div>
  `;

  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  if (!mailConfigured()) {
    if (isProduction) {
      return {
        ok: false as const,
        status: 503,
        error: "Contact delivery is not configured. Email samloiterstein@gmail.com directly.",
      };
    }

    console.log("\n[contact] (no mail transport configured). Message would have been sent:");
    console.log(text, "\n");
    return { ok: true as const, mocked: true as const };
  }

  try {
    await deliverMail({ to, from, replyTo: email, subject, text, html });
    return { ok: true as const };
  } catch (err) {
    console.error("[contact] failed to send:", err);
    return {
      ok: false as const,
      status: 500,
      error: "Unable to send the message right now. Email samloiterstein@gmail.com directly.",
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const result = await handleContactSubmission(req.body ?? {});

  if (!result.ok) {
    return res.status(result.status).json({ ok: false, error: result.error });
  }

  return res.json({ ok: true, ...(result.mocked ? { mocked: true } : {}) });
}
