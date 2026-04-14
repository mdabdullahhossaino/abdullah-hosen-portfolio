import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_LINKS, SOCIAL_LINKS } from "@/types/portfolio";
import { Linkedin, Mail } from "lucide-react";
import { type Variants, motion } from "motion/react";
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

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function Sidebar() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <aside
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-[280px] z-40 border-r border-border/60"
      style={{
        background: "oklch(var(--card) / 0.90)",
        backdropFilter: "blur(20px)",
      }}
      data-ocid="sidebar"
    >
      {/* Decorative top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(var(--primary)), transparent)",
        }}
      />

      {/* Avatar + Identity */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center pt-10 pb-6 px-6"
      >
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-full ring-2 ring-primary/50 shadow-accent-glow overflow-hidden bg-muted animate-glow-pulse"
            style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-primary/40 via-card to-accent/30 flex items-center justify-center">
              <span className="text-3xl font-display font-bold gradient-gold-cyan">
                MA
              </span>
            </div>
          </div>
          {/* Online indicator */}
          <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-card" />
        </div>

        <h2 className="font-display font-bold text-foreground text-center leading-tight">
          Md Abdullah Hosen
        </h2>
        <p className="text-xs text-muted-foreground text-center mt-1.5 leading-relaxed">
          Expert WordPress Developer
          <br />& Frontend Engineer
        </p>

        {/* Thin accent divider */}
        <div
          className="mt-4 w-12 h-px"
          style={{ background: "var(--gradient-gold-cyan)" }}
        />
      </motion.div>

      {/* Nav */}
      <nav
        className="flex-1 px-4 overflow-y-auto scrollbar-thin"
        data-ocid="sidebar-nav"
      >
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-0.5"
        >
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <motion.li key={link.id} variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  data-ocid={`nav-${link.id}`}
                  className={`w-full text-left px-4 py-2.5 rounded-md font-display text-sm font-medium transition-smooth group flex items-center gap-2 ${
                    isActive
                      ? "text-accent bg-accent/10 border border-accent/20 shadow-accent-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
                  }`}
                >
                  {/* Active indicator bar */}
                  <span
                    className={`block w-1 h-4 rounded-full transition-smooth shrink-0 ${
                      isActive
                        ? "bg-accent"
                        : "bg-border group-hover:bg-muted-foreground"
                    }`}
                  />
                  {link.label}
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="px-6 py-5 border-t border-border/60 flex items-center gap-3"
      >
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            data-ocid={`social-${s.id}`}
            className="p-2 rounded-md text-muted-foreground hover:text-primary transition-smooth hover:bg-muted/40"
          >
            <SocialIcon icon={s.icon} />
          </a>
        ))}
      </motion.div>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(var(--accent)), transparent)",
        }}
      />
    </aside>
  );
}
