import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_LINKS, SOCIAL_LINKS } from "@/types/portfolio";
import { Linkedin, Mail, MapPin, Menu, X } from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiFacebook, SiGithub, SiX } from "react-icons/si";

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
  if (icon === "facebook") return <SiFacebook className={cls} />;
  return <Mail className={cls} />;
}

const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.055, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: -10, transition: { duration: 0.15 } },
};

const socialVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.06, duration: 0.3 },
  }),
};

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollTo(id), 130);
  };

  return (
    <>
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{
          background: "oklch(0.10 0.012 48 / 0.94)",
          backdropFilter: "blur(22px) saturate(1.5)",
          borderBottom: "1px solid oklch(0.22 0.016 48 / 0.7)",
        }}
        data-ocid="mobile-header"
      >
        {/* Top accent glow line */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.72 0.18 50 / 0.9) 35%, oklch(0.72 0.22 210 / 0.65) 65%, transparent 100%)",
            boxShadow: "0 0 8px 0px oklch(0.72 0.18 50 / 0.4)",
          }}
        />

        {/* Left: mini avatar + name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-full overflow-hidden shrink-0"
            style={{
              boxShadow: "0 0 0 2px oklch(0.72 0.18 50 / 0.45)",
              background: "oklch(0.15 0.016 48)",
            }}
          >
            <img
              src="/assets/generated/profile-avatar.dim_400x400.jpg"
              alt="Md Abdullah Hosen"
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.style.display = "none";
                const p = t.parentElement;
                if (p)
                  p.style.background =
                    "linear-gradient(135deg, oklch(0.72 0.18 50 / 0.4), oklch(0.72 0.22 210 / 0.4))";
              }}
            />
          </div>
          <div className="min-w-0">
            <span className="font-display font-semibold text-sm text-foreground block truncate leading-tight">
              Md Abdullah Hosen
            </span>
            <span
              className="font-mono text-[10px] block truncate"
              style={{ color: "oklch(0.55 0.012 55 / 0.85)" }}
            >
              WP Dev &amp; Frontend Engineer
            </span>
          </div>
        </div>

        {/* Right: hamburger toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-lg transition-smooth"
          style={{ color: "oklch(0.55 0.012 55)" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "oklch(0.93 0.008 60)";
            el.style.background = "oklch(0.22 0.016 48 / 0.5)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "oklch(0.55 0.012 55)";
            el.style.background = "";
          }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-ocid="mobile-menu-toggle"
          type="button"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="block"
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="block"
              >
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{
                background: "oklch(0.06 0.01 48 / 0.75)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => setOpen(false)}
            />

            {/* Slide-in drawer */}
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] flex flex-col overflow-y-auto scrollbar-thin"
              style={{
                background: "oklch(0.12 0.013 48 / 0.99)",
                backdropFilter: "blur(28px)",
                borderRight: "1px solid oklch(0.22 0.016 48 / 0.7)",
              }}
              data-ocid="mobile-drawer"
              aria-label="Mobile navigation drawer"
            >
              {/* Drawer top glow line */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(0.72 0.18 50 / 0.9) 40%, oklch(0.72 0.22 210 / 0.6) 70%, transparent 100%)",
                  boxShadow: "0 0 10px oklch(0.72 0.18 50 / 0.3)",
                }}
              />

              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 pt-5 pb-4"
                style={{ borderBottom: "1px solid oklch(0.22 0.016 48 / 0.5)" }}
              >
                <span className="font-display font-bold text-sm gradient-gold-cyan">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg transition-smooth"
                  style={{ color: "oklch(0.55 0.012 55)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.93 0.008 60)";
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(0.22 0.016 48 / 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "oklch(0.55 0.012 55)";
                    (e.currentTarget as HTMLElement).style.background = "";
                  }}
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile mini card */}
              <div
                className="flex flex-col items-center gap-3 py-7 px-5"
                style={{ borderBottom: "1px solid oklch(0.22 0.016 48 / 0.5)" }}
              >
                <div className="relative">
                  {/* Outer spinning gold ring */}
                  <div
                    aria-hidden="true"
                    className="absolute rounded-full"
                    style={{
                      inset: "-6px",
                      background:
                        "conic-gradient(from 0deg, oklch(0.72 0.18 50 / 0.0), oklch(0.72 0.18 50 / 0.8), oklch(0.72 0.22 210 / 0.55), oklch(0.72 0.18 50 / 0.0))",
                      borderRadius: "50%",
                      animation: "ring-rotate-cw 5s linear infinite",
                    }}
                  />
                  {/* Inner cyan ring */}
                  <div
                    aria-hidden="true"
                    className="absolute rounded-full"
                    style={{
                      inset: "-2px",
                      background:
                        "conic-gradient(from 180deg, oklch(0.72 0.22 210 / 0.0), oklch(0.72 0.22 210 / 0.65), oklch(0.72 0.18 50 / 0.4), oklch(0.72 0.22 210 / 0.0))",
                      borderRadius: "50%",
                      animation: "ring-rotate-ccw 3.5s linear infinite",
                    }}
                  />
                  <div
                    className="relative w-20 h-20 rounded-full overflow-hidden border-2"
                    style={{ borderColor: "oklch(0.20 0.016 48)" }}
                  >
                    <img
                      src="/assets/generated/profile-avatar.dim_400x400.jpg"
                      alt="Md Abdullah Hosen"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const t = e.currentTarget as HTMLImageElement;
                        t.style.display = "none";
                        const p = t.parentElement;
                        if (p)
                          p.style.background =
                            "linear-gradient(135deg, oklch(0.72 0.18 50 / 0.3), oklch(0.72 0.22 210 / 0.3))";
                      }}
                    />
                  </div>
                  <span
                    className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2"
                    style={{
                      background: "oklch(0.75 0.2 145)",
                      borderColor: "oklch(0.12 0.013 48)",
                      boxShadow: "0 0 6px oklch(0.75 0.2 145 / 0.5)",
                      animation: "badge-pulse 2.2s ease-in-out infinite",
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-foreground text-sm">
                    Md Abdullah Hosen
                  </p>
                  <p
                    className="text-[11px] font-mono mt-0.5"
                    style={{ color: "oklch(0.55 0.012 55)" }}
                  >
                    WordPress Dev &amp; Frontend Engineer
                  </p>
                  <p
                    className="flex items-center justify-center gap-1 text-[11px] font-mono mt-1"
                    style={{ color: "oklch(0.55 0.012 55 / 0.65)" }}
                  >
                    <MapPin size={9} style={{ color: "oklch(0.72 0.18 50)" }} />
                    Bangladesh
                  </p>
                </div>
              </div>

              {/* Nav links with staggered animation */}
              <div className="flex flex-col gap-0.5 p-3 flex-1">
                {NAV_LINKS.map((link, i) => {
                  const isActive = active === link.id;
                  return (
                    <motion.button
                      type="button"
                      key={link.id}
                      custom={i}
                      variants={navItemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleNav(link.id)}
                      data-ocid={`mobile-nav-${link.id}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`text-left px-4 py-3 rounded-lg font-display text-[13px] font-medium transition-smooth flex items-center gap-3 relative overflow-hidden ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                      }`}
                      style={
                        isActive
                          ? {
                              background:
                                "linear-gradient(90deg, oklch(0.72 0.18 50 / 0.1), oklch(0.72 0.22 210 / 0.06))",
                            }
                          : {}
                      }
                    >
                      {/* Active left border */}
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                        style={{
                          height: isActive ? "65%" : "0%",
                          background: isActive
                            ? "linear-gradient(to bottom, oklch(0.72 0.18 50), oklch(0.72 0.22 210))"
                            : "transparent",
                          boxShadow: isActive
                            ? "2px 0 8px oklch(0.72 0.18 50 / 0.45)"
                            : "none",
                          transition: "height 0.2s ease",
                        }}
                      />
                      {link.label}
                      {isActive && (
                        <span
                          className="ml-auto text-[10px] font-mono shrink-0"
                          style={{ color: "oklch(0.72 0.22 210 / 0.7)" }}
                        >
                          ›
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Social + hire — staggered */}
              <div
                className="px-5 py-5"
                style={{ borderTop: "1px solid oklch(0.22 0.016 48 / 0.5)" }}
              >
                {/* Available badge */}
                <div
                  className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
                  style={{
                    background: "oklch(0.72 0.18 50 / 0.06)",
                    border: "1px solid oklch(0.72 0.18 50 / 0.2)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: "oklch(0.75 0.2 145)",
                      animation: "badge-pulse 2.2s ease-in-out infinite",
                    }}
                  />
                  <span className="text-[11px] font-mono text-primary tracking-wide">
                    Available for hire
                  </span>
                </div>

                {/* Social icons with stagger */}
                <div className="flex items-center gap-2">
                  {SOCIAL_LINKS.map((s, i) => (
                    <motion.a
                      key={s.id}
                      custom={i}
                      variants={socialVariants}
                      initial="hidden"
                      animate="visible"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      data-ocid={`mobile-social-${s.id}`}
                      className="flex-1 flex items-center justify-center p-2 rounded-lg transition-smooth"
                      style={{ color: "oklch(0.55 0.012 55)" }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = "oklch(0.72 0.18 50)";
                        el.style.background = "oklch(0.72 0.18 50 / 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = "oklch(0.55 0.012 55)";
                        el.style.background = "";
                      }}
                    >
                      <SocialIcon icon={s.icon} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
