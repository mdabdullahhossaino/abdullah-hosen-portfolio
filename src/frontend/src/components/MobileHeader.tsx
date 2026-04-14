import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_LINKS, SOCIAL_LINKS } from "@/types/portfolio";
import { Linkedin, Mail, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiGithub, SiX } from "react-icons/si";

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SocialIcon({ icon }: { icon: string }) {
  const cls = "w-4 h-4";
  if (icon === "github") return <SiGithub className={cls} />;
  if (icon === "linkedin") return <Linkedin className={cls} />;
  if (icon === "twitter") return <SiX className={cls} />;
  return <Mail className={cls} />;
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  const handleNav = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollTo(id), 100);
  };

  return (
    <>
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 border-b border-border"
        style={{
          background: "oklch(var(--card) / 0.95)",
          backdropFilter: "blur(16px)",
        }}
        data-ocid="mobile-header"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full ring-2 ring-primary/40 overflow-hidden bg-muted shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
          </div>
          <span className="font-display font-semibold text-sm text-foreground truncate">
            Md Abdullah Hosen
          </span>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle menu"
          data-ocid="mobile-menu-toggle"
          type="button"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col pt-16 pb-8 px-6 overflow-y-auto scrollbar-thin border-r border-border"
              style={{
                background: "oklch(var(--card) / 0.98)",
                backdropFilter: "blur(20px)",
              }}
              data-ocid="mobile-drawer"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="w-20 h-20 rounded-full ring-2 ring-primary/50 shadow-accent-glow overflow-hidden bg-muted">
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-foreground">
                    Md Abdullah Hosen
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    WordPress Dev & Frontend Engineer
                  </p>
                </div>
              </div>

              <nav className="flex flex-col gap-1 flex-1">
                {NAV_LINKS.map((link) => {
                  const isActive = active === link.id;
                  return (
                    <button
                      type="button"
                      key={link.id}
                      onClick={() => handleNav(link.id)}
                      data-ocid={`mobile-nav-${link.id}`}
                      className={`text-left px-4 py-2.5 rounded-md font-display text-sm font-medium transition-smooth ${
                        isActive
                          ? "text-accent bg-accent/10 border border-accent/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-smooth hover:bg-muted/50"
                  >
                    <SocialIcon icon={s.icon} />
                  </a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
