import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Github, Linkedin, Loader2 } from "lucide-react";
import { Section } from "./ui/Section";
import { contact, site, substack } from "@/data/content";
import { cn } from "@/lib/cn";
import { CONTACT_INTENT_EVENT, readContactIntent } from "@/lib/contactIntent";

const v = contact.form.validation;

const ContactSchema = z.object({
  name: z.string().trim().min(2, v.nameRequired),
  email: z
    .string()
    .trim()
    .min(1, v.emailRequired)
    .email(v.emailInvalid),
  message: z.string().trim().min(10, v.messageShort).max(5000, v.messageLong),
  intent: z.string().optional(),
  company: z.string().max(0, v.spam).optional().or(z.literal("")),
});

type ContactValues = z.infer<typeof ContactSchema>;

type Status =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [messagePlaceholder, setMessagePlaceholder] = useState<string>(
    contact.form.placeholders.message
  );
  const f = contact.form;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", message: "", intent: "", company: "" },
    mode: "onTouched",
  });

  const intentValue = watch("intent");

  useEffect(() => {
    const apply = () => {
      const intent = readContactIntent();
      if (contact.intents.some((item) => item.id === intent)) {
        setValue("intent", intent, { shouldDirty: false });
      }
    };
    apply();
    window.addEventListener(CONTACT_INTENT_EVENT, apply);
    window.addEventListener("popstate", apply);
    return () => {
      window.removeEventListener(CONTACT_INTENT_EVENT, apply);
      window.removeEventListener("popstate", apply);
    };
  }, [setValue]);

  useEffect(() => {
    const intent = contact.intents.find((i) => i.id === intentValue);
    setMessagePlaceholder(intent?.placeholder ?? contact.form.placeholders.message);
  }, [intentValue]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ kind: "idle" });

    const intentLabel = contact.intents.find((i) => i.id === values.intent)?.label;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, intent: intentLabel ?? values.intent }),
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
      displayHeader
    >
      <div className="grid items-start gap-6 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
            <a
              href={`mailto:${site.email}`}
              data-analytics="contact:email"
              className="flex flex-col items-center text-center"
            >
              <img
                src="/images/email-profile.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl object-cover"
              />
              <div className="mt-3">
                <div className="text-xs uppercase tracking-[0.16em] text-ink-500">{contact.emailLabel}</div>
                <div className="mt-0.5 font-medium text-ink-900">{site.email}</div>
                <div className="mt-1 text-sm text-ink-500">{contact.emailHint}</div>
              </div>
            </a>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-ink-100 pt-4">
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                data-analytics="contact:linkedin"
                className="inline-flex items-center gap-2 text-sm font-medium text-sage-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
              >
                <Linkedin size={16} aria-hidden />
                LinkedIn
              </a>
              <a
                href={substack.publicationUrl}
                target="_blank"
                rel="noreferrer"
                data-analytics="contact:substack"
                className="inline-flex items-center gap-2 text-sm font-medium text-sage-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="fill-current">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
                Substack
              </a>
              <a
                href={site.socials.github}
                target="_blank"
                rel="noreferrer"
                data-analytics="contact:github"
                className="inline-flex items-center gap-2 text-sm font-medium text-sage-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
              >
                <Github size={16} aria-hidden />
                GitHub
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-sage-200 bg-sage-50/60 p-5 text-sm leading-relaxed text-ink-700">
            <p className="font-medium text-ink-900">{contact.nextLabel}</p>
            <p className="mt-2">{contact.nextBody}</p>
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
            data-analytics="form:contact"
            className="rr-block rounded-2xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8"
          >
            <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="company" className="sr-only">
                Company
              </label>
              <input
                id="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
              />
            </div>

            <Field label={f.intentLabel} htmlFor="intent" className="mb-5">
              <select
                id="intent"
                className={inputClasses(false)}
                {...register("intent")}
                onChange={(e) => {
                  register("intent").onChange(e);
                  if (!watch("message")) {
                    const intent = contact.intents.find((i) => i.id === e.target.value);
                    if (intent) setValue("message", "");
                  }
                }}
              >
                <option value="">{f.intentDefault}</option>
                {contact.intents.map((intent) => (
                  <option key={intent.id} value={intent.id}>
                    {intent.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" htmlFor="name" error={errors.name?.message} required>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  aria-required="true"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={inputClasses(!!errors.name)}
                  placeholder={f.placeholders.name}
                  {...register("name")}
                />
              </Field>

              <Field label="Email" htmlFor="email" error={errors.email?.message} required>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputClasses(!!errors.email)}
                  placeholder={f.placeholders.email}
                  {...register("email")}
                />
              </Field>
            </div>

            <Field label="Message" htmlFor="message" error={errors.message?.message} className="mt-5" required>
              <textarea
                id="message"
                rows={5}
                required
                minLength={10}
                aria-required="true"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={cn(inputClasses(!!errors.message), "min-h-[140px] resize-y")}
                placeholder={messagePlaceholder}
                {...register("message")}
              />
            </Field>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                data-analytics="cta:contact-submit"
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
    "w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400",
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
  required = false,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-500"
      >
        {label}
        {required ? <span className="sr-only"> required</span> : null}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

