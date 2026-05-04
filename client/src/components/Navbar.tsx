import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems, site } from "@/data/content";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/cn";

const sectionIds = navItems.map((item) => item.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="container-page">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full border px-4 py-2 transition-all duration-300 sm:px-5",
            scrolled
              ? "border-ink-200/70 bg-cream/80 shadow-soft backdrop-blur-md"
              : "border-transparent bg-transparent"
          )}
        >
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "top")}
            className="group flex items-center gap-2 text-sm font-medium text-ink-900"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-sage-700 text-cream text-[11px] font-semibold tracking-tight">
              {site.initials}
            </span>
            <span className="hidden font-display text-base sm:inline">{site.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={cn(
                      "relative rounded-full px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "text-sage-900"
                        : "text-ink-600 hover:text-ink-900"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-sage-100"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full border border-ink-200 px-3.5 py-1.5 text-sm text-ink-700 transition hover:border-sage-400 hover:text-sage-800 md:inline-block"
            >
              LinkedIn
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="hidden rounded-full bg-sage-700 px-4 py-1.5 text-sm text-cream transition hover:bg-sage-800 md:inline-block"
            >
              Contact
            </a>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-800 md:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 overflow-hidden rounded-2xl border border-ink-200/70 bg-cream/95 p-2 shadow-soft backdrop-blur md:hidden"
            >
              <ul className="flex flex-col">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className="block rounded-xl px-4 py-3 text-sm text-ink-800 hover:bg-sage-50 hover:text-sage-900"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="mt-1 border-t border-ink-100 pt-1">
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, "contact")}
                    className="block rounded-xl bg-sage-700 px-4 py-3 text-center text-sm text-cream"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
