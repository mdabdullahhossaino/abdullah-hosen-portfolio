import { Button } from "@/components/ui/button";
import { Award, Briefcase, Download, Star, Users } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Fade-up variant ───────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.15,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// ── Counter hook ──────────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - (1 - progress) ** 3;
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  delay: number;
  accentGold?: boolean;
}

function StatCard({
  icon,
  value,
  suffix,
  label,
  active,
  delay,
  accentGold,
}: StatCardProps) {
  const count = useCountUp(value, active);
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="relative flex flex-col items-center text-center p-5 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden group transition-smooth"
      style={{
        boxShadow: accentGold
          ? "0 4px 24px -8px oklch(0.72 0.18 50 / 0.25)"
          : "0 4px 24px -8px oklch(0.72 0.22 210 / 0.25)",
      }}
      data-ocid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Corner glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none"
        style={{
          background: accentGold
            ? "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.18 50 / 0.10) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.22 210 / 0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{
          background: accentGold
            ? "oklch(0.72 0.18 50 / 0.15)"
            : "oklch(0.72 0.22 210 / 0.15)",
          color: accentGold ? "oklch(0.72 0.18 50)" : "oklch(0.72 0.22 210)",
        }}
      >
        {icon}
      </div>
      <div className="font-display font-bold text-3xl mb-0.5">
        <span className={accentGold ? "gradient-gold-cyan" : "text-foreground"}>
          {count}
        </span>
        <span
          style={{
            color: accentGold ? "oklch(0.72 0.18 50)" : "oklch(0.72 0.22 210)",
          }}
        >
          {suffix}
        </span>
      </div>
      <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
}

// ── About Section ─────────────────────────────────────────────────────────────

const STATS = [
  {
    icon: <Briefcase size={18} />,
    value: 5,
    suffix: "+",
    label: "Years Experience",
    accentGold: true,
  },
  {
    icon: <Star size={18} />,
    value: 150,
    suffix: "+",
    label: "Projects Completed",
    accentGold: false,
  },
  {
    icon: <Users size={18} />,
    value: 80,
    suffix: "+",
    label: "Happy Clients",
    accentGold: true,
  },
  {
    icon: <Award size={18} />,
    value: 10,
    suffix: "+",
    label: "Certifications",
    accentGold: false,
  },
];

export function About() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      className="relative section-pad border-b border-border/30 overflow-hidden"
      data-ocid="section-about"
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 10% 50%, oklch(0.72 0.18 50 / 0.05) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 90% 60%, oklch(0.72 0.22 210 / 0.04) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
            <span className="inline-block w-6 h-px bg-primary/70 mr-2 align-middle" />
            Get to know me
            <span className="inline-block w-6 h-px bg-accent/70 ml-2 align-middle" />
          </p>
          <h2 className="section-heading gradient-gold-cyan inline-block">
            About Me
          </h2>
          {/* Decorative underline bar */}
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
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
          {/* Left — profile image */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div
                className="absolute -inset-3 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, oklch(0.72 0.18 50 / 0.4), oklch(0.72 0.22 210 / 0.4), oklch(0.72 0.18 50 / 0.4))",
                  filter: "blur(8px)",
                }}
              />
              {/* Inner border ring */}
              <div
                className="absolute -inset-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.18 50 / 0.8), oklch(0.72 0.22 210 / 0.8))",
                  padding: "2px",
                }}
              />
              {/* Profile image */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-border/30">
                <img
                  src="/assets/generated/profile-avatar.dim_400x400.jpg"
                  alt="Md Abdullah Hosen — Expert WordPress Developer & Frontend Engineer"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-full border border-border/40 bg-card/90 backdrop-blur-sm"
                style={{
                  boxShadow: "0 0 16px -4px oklch(0.72 0.18 50 / 0.4)",
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <span className="font-mono text-xs text-primary font-semibold">
                  Available for Work
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 ml-1.5 align-middle animate-pulse" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right — bio */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
              Expert WordPress Developer &{" "}
              <span className="gradient-gold-cyan">Frontend Engineer</span>
            </h3>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">
              Based in Bangladesh · Open to Remote
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Hi! I'm{" "}
              <span className="text-foreground font-semibold">
                Md Abdullah Hosen
              </span>
              , an Expert WordPress Developer & Frontend Engineer dedicated to
              building high-performance websites. Specializing in custom
              WordPress development, sleek Frontend designs, and critical
              Malware Removal.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether it's Speed Optimization, Bug Fixing, or ensuring your site
              is secure and fast, I deliver top-tier results. I also integrate{" "}
              <span className="text-foreground font-medium">AI Automation</span>{" "}
              to streamline your business workflows. Partner with me to take
              your digital presence to the next level!
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "WordPress Expert",
                "Frontend Dev",
                "Security Specialist",
                "AI Automation",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono rounded-full border border-border/50 text-muted-foreground bg-card/40"
                  style={{ borderColor: "oklch(0.72 0.22 210 / 0.25)" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Download CV button */}
            <Button
              asChild
              size="lg"
              className="font-display font-semibold gap-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.65 0.16 45))",
                color: "oklch(0.10 0.015 50)",
                boxShadow: "0 0 22px -4px oklch(0.72 0.18 50 / 0.45)",
              }}
              data-ocid="about-download-cv"
            >
              <a href="/cv-md-abdullah-hosen.pdf" download>
                <Download size={16} />
                Download CV
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              active={statsInView}
              delay={i * 0.1}
              accentGold={stat.accentGold}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
