import { Bot, Code2, Layout, ShieldCheck, Wrench, Zap } from "lucide-react";
import { motion } from "motion/react";

// ── Service data ──────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "wordpress",
    icon: Code2,
    title: "Custom WordPress Development",
    desc: "Crafting bespoke WordPress themes and plugins tailored to your brand. From WooCommerce stores to complex multi-site networks — built for performance.",
    accentGold: true,
  },
  {
    id: "frontend",
    icon: Layout,
    title: "Frontend Design",
    desc: "Translating design mockups into pixel-perfect, responsive interfaces. Modern HTML5, CSS3, and React-powered experiences that delight users.",
    accentGold: false,
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Malware Removal & Security",
    desc: "Comprehensive site auditing, malware scanning and removal, and hardening against future attacks. Keep your site clean and your users protected.",
    accentGold: true,
  },
  {
    id: "speed",
    icon: Zap,
    title: "Speed Optimization",
    desc: "Achieving sub-2s load times through caching, image optimization, CDN setup, and code minification. Fast sites rank higher and convert better.",
    accentGold: false,
  },
  {
    id: "bugfix",
    icon: Wrench,
    title: "Bug Fixing",
    desc: "Rapid diagnosis and resolution of WordPress and frontend bugs — from white screens to broken layouts. I fix it right the first time.",
    accentGold: true,
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI Automation Integration",
    desc: "Embedding AI-powered automations into your business workflows — from chatbots to content pipelines — saving hours and driving growth.",
    accentGold: false,
  },
];

// ── Service Card ──────────────────────────────────────────────────────────────

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  accentGold: boolean;
  index: number;
}

function ServiceCard({
  icon: Icon,
  title,
  desc,
  accentGold,
  index,
}: ServiceCardProps) {
  const goldColor = "oklch(0.72 0.18 50)";
  const cyanColor = "oklch(0.72 0.22 210)";
  const activeColor = accentGold ? goldColor : cyanColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative flex flex-col p-6 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm group overflow-hidden cursor-default"
      style={{
        transition:
          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = `0 12px 40px -10px ${activeColor.replace("oklch", "oklch").replace(")", " / 0.30)")}`;
        el.style.borderColor = activeColor.replace(")", " / 0.45)");
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "";
        el.style.borderColor = "";
      }}
      data-ocid={`service-card-${SERVICES.find((s) => s.title === title)?.id ?? index}`}
    >
      {/* Radial hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${activeColor.replace(")", " / 0.09)")} 0%, transparent 70%)`,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Icon */}
      <div
        className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-smooth group-hover:scale-110"
        style={{
          background: `${activeColor.replace(")", " / 0.12)")}`,
          color: activeColor,
          boxShadow: `0 0 20px -6px ${activeColor.replace(")", " / 0.25)")}`,
        }}
      >
        <Icon size={22} />
      </div>

      {/* Title */}
      <h3
        className="relative z-10 font-display font-bold text-lg text-foreground mb-3 group-hover:transition-smooth"
        style={{ transition: "color 0.25s ease" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-muted-foreground text-sm leading-relaxed flex-1">
        {desc}
      </p>

      {/* Bottom accent line */}
      <div
        className="relative z-10 h-px w-0 group-hover:w-full mt-5 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${activeColor}, transparent)`,
          transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </motion.div>
  );
}

// ── Services Section ──────────────────────────────────────────────────────────

export function Services() {
  return (
    <section
      id="services"
      className="relative section-pad border-b border-border/30 overflow-hidden"
      style={{ background: "oklch(0.13 0.018 50)" }}
      data-ocid="section-services"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.72 0.18 50 / 0.04) 0%, transparent 65%), radial-gradient(ellipse 40% 35% at 80% 80%, oklch(0.72 0.22 210 / 0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
            <span className="inline-block w-6 h-px bg-primary/70 mr-2 align-middle" />
            What I offer
            <span className="inline-block w-6 h-px bg-accent/70 ml-2 align-middle" />
          </p>
          <h2 className="section-heading gradient-gold-cyan inline-block">
            My Services
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="h-1 w-16 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.72 0.18 50), oklch(0.72 0.22 210))",
              }}
            />
            <div className="h-px w-24 rounded-full bg-border/50" />
          </div>
          <p className="section-subheading mt-3">
            End-to-end solutions for WordPress, Frontend, and beyond
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              icon={svc.icon}
              title={svc.title}
              desc={svc.desc}
              accentGold={svc.accentGold}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
