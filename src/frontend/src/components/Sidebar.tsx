import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_LINKS, SOCIAL_LINKS } from "@/types/portfolio";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { SiFacebook, SiGithub, SiX } from "react-icons/si";

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

const NAV_ICONS: Record<string, string> = {
  hero: "⌂",
  about: "ℹ",
  skills: "◈",
  services: "◧",
  portfolio: "⊞",
  experience: "◴",
  contact: "✉",
};

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

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Sidebar() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <aside
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-[280px] z-40 border-r border-white/[0.06]"
      style={{
        background: "oklch(0.12 0.013 48 / 0.97)",
        backdropFilter: "blur(28px) saturate(1.5)",
      }}
      data-ocid="sidebar"
    >
      {/* Top decorative gold-to-cyan gradient line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.72 0.18 50 / 0.95) 35%, oklch(0.72 0.22 210 / 0.75) 65%, transparent 100%)",
          boxShadow: "0 0 12px 0px oklch(0.72 0.18 50 / 0.5)",
        }}
      />

      {/* Avatar + Identity block */}
      <motion.div
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center pt-10 pb-6 px-6"
      >
        {/* Profile avatar with premium pulsing rings */}
        <div className="relative mb-5">
          {/* Outer gold spinning ring */}
          <div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              inset: "-8px",
              background:
                "conic-gradient(from 0deg, oklch(0.72 0.18 50 / 0.0), oklch(0.72 0.18 50 / 0.85), oklch(0.72 0.22 210 / 0.6), oklch(0.72 0.18 50 / 0.0))",
              borderRadius: "50%",
              animation: "ring-rotate-cw 5s linear infinite",
            }}
          />
          {/* Inner cyan spinning ring */}
          <div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              inset: "-3px",
              background:
                "conic-gradient(from 180deg, oklch(0.72 0.22 210 / 0.0), oklch(0.72 0.22 210 / 0.7), oklch(0.72 0.18 50 / 0.45), oklch(0.72 0.22 210 / 0.0))",
              borderRadius: "50%",
              animation: "ring-rotate-ccw 3.5s linear infinite",
            }}
          />
          {/* Pulsing glow backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.72 0.22 210 / 0.15) 0%, transparent 70%)",
              animation: "glow-pulse-anim 3s ease-in-out infinite",
            }}
          />
          {/* Avatar image — studio photo */}
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden border-2"
            style={{ borderColor: "oklch(0.20 0.016 48)" }}
          >
            <img
              src="/assets/profile-studio.jpg"
              alt="Md Abdullah Hosen — professional headshot"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = "/assets/generated/profile-avatar.dim_400x400.jpg";
                target.onerror = () => {
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.background =
                      "linear-gradient(135deg, oklch(0.20 0.016 48), oklch(0.18 0.016 48))";
                    parent.innerHTML =
                      '<span style="display:flex;align-items:center;justify-content:center;height:100%;font-family:var(--font-display);font-weight:800;font-size:1.75rem;background:linear-gradient(135deg,oklch(0.72 0.18 50),oklch(0.72 0.22 210));-webkit-background-clip:text;-webkit-text-fill-color:transparent">AH</span>';
                  }
                };
              }}
            />
          </div>

          {/* Online / available dot */}
          <span
            className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2"
            style={{
              background: "oklch(0.75 0.2 145)",
              borderColor: "oklch(0.12 0.013 48)",
              boxShadow: "0 0 8px 2px oklch(0.75 0.2 145 / 0.5)",
            }}
            title="Available for work"
            aria-label="Status: available for work"
          />
        </div>

        {/* Name */}
        <h2 className="font-display font-bold text-xl lg:text-2xl text-foreground text-center leading-tight mb-1 tracking-tight">
          Md Abdullah Hosen
        </h2>

        {/* Title */}
        <p className="text-sm lg:text-base font-accent text-muted-foreground text-center leading-relaxed mb-2 px-2">
          WordPress Developer &amp; Frontend Engineer
        </p>

        {/* Location */}
        <p
          className="flex items-center gap-1 text-xs lg:text-sm font-accent"
          style={{ color: "oklch(0.55 0.012 55 / 0.75)" }}
        >
          <MapPin
            size={10}
            style={{ color: "oklch(0.72 0.18 50)" }}
            className="shrink-0"
          />
          Bangladesh
        </p>

        {/* Accent divider */}
        <div
          className="mt-4 w-14 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.72 0.18 50), oklch(0.72 0.22 210))",
          }}
        />
      </motion.div>

      {/* Navigation */}
      <nav
        className="flex-1 px-3 overflow-y-auto scrollbar-thin"
        data-ocid="sidebar-nav"
        aria-label="Main navigation"
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
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full text-left px-3 py-[11px] rounded-lg font-accent text-sm lg:text-base font-medium transition-smooth flex items-center gap-3 group relative overflow-hidden ${
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
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                    style={{
                      height: isActive ? "68%" : "0%",
                      background: isActive
                        ? "linear-gradient(to bottom, oklch(0.72 0.18 50), oklch(0.72 0.22 210))"
                        : "transparent",
                      boxShadow: isActive
                        ? "2px 0 8px oklch(0.72 0.18 50 / 0.5)"
                        : "none",
                      transition: "height 0.25s ease",
                    }}
                  />
                  <span
                    className={`text-[13px] leading-none w-4 text-center shrink-0 font-mono transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/50 group-hover:text-muted-foreground"
                    }`}
                  >
                    {NAV_ICONS[link.id] ?? "·"}
                  </span>
                  {link.label}
                  {isActive && (
                    <span
                      className="ml-auto text-[10px] font-mono shrink-0"
                      style={{ color: "oklch(0.72 0.22 210 / 0.7)" }}
                    >
                      ›
                    </span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      {/* Social + Hire badge */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="px-5 py-4 border-t"
        style={{ borderColor: "oklch(0.22 0.016 48 / 0.5)" }}
      >
        <div
          className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
          style={{
            background: "oklch(0.72 0.18 50 / 0.06)",
            border: "1px solid oklch(0.72 0.18 50 / 0.2)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: "oklch(0.75 0.2 145)",
              animation: "badge-pulse 2.2s ease-in-out infinite",
              boxShadow: "0 0 6px 2px oklch(0.75 0.2 145 / 0.4)",
            }}
          />
          <span className="text-xs lg:text-sm font-accent text-primary tracking-wide">
            Available for hire
          </span>
        </div>

        <div className="flex items-center gap-1">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              data-ocid={`social-${s.id}`}
              className="flex-1 flex items-center justify-center p-2 rounded-lg transition-smooth group relative"
              style={{ color: "oklch(0.55 0.012 55)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "oklch(0.72 0.18 50)";
                el.style.background = "oklch(0.72 0.18 50 / 0.08)";
                el.style.boxShadow = "0 0 12px -3px oklch(0.72 0.18 50 / 0.45)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "oklch(0.55 0.012 55)";
                el.style.background = "";
                el.style.boxShadow = "";
              }}
            >
              <SocialIcon icon={s.icon} />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Bottom cyan glow line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, oklch(0.72 0.22 210 / 0.6) 50%, transparent 95%)",
        }}
      />
    </aside>
  );
}
