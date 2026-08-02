import { Resend } from "resend";
import nodemailer, { type Transporter } from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  intent?: unknown;
  company?: unknown;
};

export type ContactResult =
  | { ok: true; mocked?: boolean }
  | { ok: false; status: number; error: string };

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

function buildMailContent(name: string, email: string, message: string, intent?: string) {
  const to = process.env.CONTACT_TO?.trim() || "samloiterstein@gmail.com";
  const from =
    process.env.CONTACT_FROM?.trim() || "Sam Loiterstein Website <noreply@sam-loiterstein.com>";
  const subject = intent
    ? `New contact: ${intent} from ${name}`
    : `New contact form message from ${name}`;
  const intentLine = intent ? `Topic: ${intent}` : "";
  const text = [`Name: ${name}`, `Email: ${email}`, intentLine, "", "Message:", message]
    .filter(Boolean)
    .join("\n");
  const intentHtml = intent
    ? `<p style="margin:0 0 16px;"><strong>Topic:</strong> ${escapeHtml(intent)}</p>`
    : "";
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif; color:#22221f; line-height:1.55;">
      <h2 style="margin:0 0 16px; font-weight:600;">New contact form message</h2>
      <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 16px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      ${intentHtml}
      <p style="margin:0 0 4px; color:#5e5e58; font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">Message</p>
      <div style="white-space:pre-wrap; padding:12px 14px; background:#f3f7f4; border:1px solid #c6d8c9; border-radius:8px;">${escapeHtml(message)}</div>
    </div>
  `;

  return { to, from, replyTo: email, subject, text, html };
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

async function deliverMail(mail: ReturnType<typeof buildMailContent>): Promise<void> {
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

function mailConfigured(): boolean {
  return resendConfigured() || smtpConfigured();
}

export async function handleContactSubmission(body: ContactPayload): Promise<ContactResult> {
  if (asString(body.company)) {
    return { ok: true };
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const message = asString(body.message);
  const intent = asString(body.intent);

  if (!name || !email || !message) {
    return { ok: false, status: 400, error: "All fields are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, status: 400, error: "Please provide a valid email." };
  }
  if (message.length > 5000) {
    return { ok: false, status: 400, error: "Message is too long." };
  }

  const mail = buildMailContent(name, email, message, intent || undefined);
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  if (!mailConfigured()) {
    if (isProduction) {
      return {
        ok: false,
        status: 503,
        error: "Contact delivery is not configured. Email samloiterstein@gmail.com directly.",
      };
    }

    console.log("\n[contact] (no mail transport configured). Message would have been sent:");
    console.log(mail.text, "\n");
    return { ok: true, mocked: true };
  }

  try {
    await deliverMail(mail);
    return { ok: true };
  } catch (err) {
    console.error("[contact] failed to send:", err);
    return {
      ok: false,
      status: 500,
      error: "Unable to send the message right now. Email samloiterstein@gmail.com directly.",
    };
  }
}

export async function sendContactTestEmail(): Promise<ContactResult> {
  return handleContactSubmission({
    name: "Website Contact Test",
    email: "noreply@sam-loiterstein.com",
    message:
      "This is an automated deliverability test from the sam-loiterstein.com contact form setup. If this lands in the inbox, delivery is working.",
  });
}
