import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Linkedin, Loader2, Mail } from "lucide-react";
import { Section } from "./ui/Section";
import { contact, site } from "@/data/content";
import { cn } from "@/lib/cn";

const v = contact.form.validation;

const ContactSchema = z.object({
  name: z.string().trim().min(2, v.nameRequired),
  email: z
    .string()
    .trim()
    .min(1, v.emailRequired)
    .email(v.emailInvalid),
  message: z.string().trim().min(10, v.messageShort).max(5000, v.messageLong),
  // Honeypot. Bots fill this in, humans do not see it.
  company: z.string().max(0, v.spam).optional().or(z.literal("")),
});

type ContactValues = z.infer<typeof ContactSchema>;

type Status =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const f = contact.form;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ kind: "idle" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || v.generic);
      }

      setStatus({ kind: "success" });
      reset();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : v.generic,
      });
    }
  });

  return (
    <Section
      id="contact"
      eyebrow={contact.eyebrow}
      title={contact.title}
      description={contact.description}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
            <a
              href={`mailto:${site.email}`}
              className="group flex items-start gap-4 text-left"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sage-100 text-sage-800 transition-colors group-hover:bg-sage-700 group-hover:text-cream">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-ink-500">{contact.emailLabel}</div>
                <div className="mt-0.5 font-medium text-ink-900">{site.email}</div>
                <div className="mt-1 text-sm text-ink-500">{contact.emailHint}</div>
              </div>
            </a>
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-3">
            <SocialTile href={site.socials.linkedin} label="LinkedIn">
              <Linkedin size={18} />
            </SocialTile>
            <SocialTile href={site.socials.email} label="Email">
              <Mail size={18} />
            </SocialTile>
          </ul>

          <div className="mt-6 rounded-2xl border border-sage-200 bg-sage-50/60 p-5 text-sm text-ink-700">
            <div className="font-medium text-ink-900">{contact.currently.heading}</div>
            <p className="mt-1">{contact.currently.body}</p>
          </div>
        </div>

        {status.kind === "success" ? (
          <SuccessCard onReset={() => setStatus({ kind: "idle" })} />
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8"
          >
            <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="company">Company (do not fill)</label>
              <input
                id="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" htmlFor="name" error={errors.name?.message}>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={inputClasses(!!errors.name)}
                  placeholder={f.placeholders.name}
                  {...register("name")}
                />
              </Field>

              <Field label="Email" htmlFor="email" error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={inputClasses(!!errors.email)}
                  placeholder={f.placeholders.email}
                  {...register("email")}
                />
              </Field>
            </div>

            <Field label="Message" htmlFor="message" error={errors.message?.message} className="mt-5">
              <textarea
                id="message"
                rows={5}
                className={cn(inputClasses(!!errors.message), "min-h-[140px] resize-y")}
                placeholder={f.placeholders.message}
                {...register("message")}
              />
            </Field>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-sage-700 px-5 text-sm font-medium text-cream transition-all duration-200 hover:bg-sage-800 active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {f.sendingLabel}
                  </>
                ) : (
                  <>
                    {f.sendButton}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div aria-live="polite" className="text-sm">
                {status.kind === "error" && (
                  <span className="text-red-700">{status.message}</span>
                )}
              </div>
            </div>
          </motion.form>
        )}
      </div>
    </Section>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  const f = contact.form;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-start gap-4 rounded-2xl border border-sage-200 bg-sage-50/70 p-8 shadow-soft sm:p-10"
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-sage-700 text-cream">
        <CheckCircle2 size={20} />
      </div>
      <div>
        <div className="font-display text-2xl text-ink-900 sm:text-3xl">{f.successHeading}</div>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-600">{f.successBody}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 text-sm font-medium text-sage-800 underline-offset-4 hover:underline"
      >
        {f.successAction}
      </button>
    </motion.div>
  );
}

function inputClasses(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:bg-white",
    hasError
      ? "border-red-300 focus:border-red-500"
      : "border-ink-200 focus:border-sage-500"
  );
}

function Field({
  label,
  htmlFor,
  children,
  className,
  error,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-500"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function SocialTile({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  return (
    <li>
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        aria-label={label}
        className="group flex h-14 flex-col items-center justify-center rounded-2xl border border-ink-100 bg-white text-ink-700 shadow-soft transition-all duration-200 hover:border-sage-400 hover:text-sage-800"
      >
        <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
          {children}
        </span>
        <span className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink-400 group-hover:text-sage-700">
          {label}
        </span>
      </a>
    </li>
  );
}
