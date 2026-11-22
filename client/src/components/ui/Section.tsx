import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  displayHeader?: boolean;
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 } },
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerClassName,
  displayHeader = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-12 sm:py-14 lg:py-8", className)}
    >
      <div className={cn("container-page", containerClassName)}>
        {(eyebrow || title || description) && (
          <div className={cn("h-px bg-sage-300/80", displayHeader ? "" : "mb-8 sm:mb-10")} />
        )}
        {(eyebrow || title || description) && (
          <motion.header
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={headerVariants}
            className={cn(displayHeader ? "mb-8 sm:mb-10" : "mb-6 max-w-3xl lg:mb-5")}
          >
            {eyebrow &&
              (displayHeader ? (
                <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-sage-800 sm:mt-10 sm:text-xs">
                  {eyebrow}
                </p>
              ) : (
                <span className="eyebrow">{eyebrow}</span>
              ))}
            {title &&
              (displayHeader ? (
                <h2 className="mt-3 text-center font-display text-4xl font-medium tracking-tightish text-ink-900 sm:text-5xl lg:text-6xl">
                  {title}
                </h2>
              ) : (
                <h2 className="heading mt-5">{title}</h2>
              ))}
            {description &&
              (displayHeader ? (
                <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-ink-600 sm:text-lg">
                  {description}
                </p>
              ) : (
                <p className="subheading">{description}</p>
              ))}
          </motion.header>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={childVariants}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
