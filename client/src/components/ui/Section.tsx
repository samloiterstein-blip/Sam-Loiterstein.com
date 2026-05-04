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
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-24 sm:py-28 lg:py-32", className)}
    >
      <div className={cn("container-page", containerClassName)}>
        {(eyebrow || title || description) && (
          <motion.header
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={headerVariants}
            className="mb-12 max-w-3xl sm:mb-16"
          >
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2 className="heading mt-5">{title}</h2>}
            {description && <p className="subheading">{description}</p>}
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
