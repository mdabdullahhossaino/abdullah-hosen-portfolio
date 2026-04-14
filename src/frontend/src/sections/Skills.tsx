import { motion, useInView } from "motion/react";
import { useRef } from "react";

// ── Skill data ────────────────────────────────────────────────────────────────

const SKILLS = [
  { label: "WordPress Development", pct: 95 },
  { label: "Frontend Engineering", pct: 90 },
  { label: "Malware Removal & Security", pct: 88 },
  { label: "Speed Optimization", pct: 92 },
  { label: "Bug Fixing", pct: 85 },
  { label: "AI Automation Integration", pct: 80 },
  { label: "Website Performance", pct: 90 },
  { label: "SEO & Analytics", pct: 75 },
];

// ── SkillBar ──────────────────────────────────────────────────────────────────

interface SkillBarProps {
  label: string;
  pct: number;
  index: number;
  active: boolean;
}

function SkillBar({ label, pct, index, active }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="group"
      data-ocid={`skill-bar-${label.toLowerCase().replace(/[\s&]+/g, "-")}`}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-medium text-sm text-foreground group-hover:text-primary transition-smooth">
          {label}
        </span>
        <motion.span
          className="font-mono text-xs font-semibold"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.08 + 0.3, duration: 0.4 }}
          style={{ color: "oklch(0.72 0.22 210)" }}
        >
          {pct}%
        </motion.span>
      </div>

      {/* Track */}
      <div className="h-2.5 w-full rounded-full bg-card/80 border border-border/30 overflow-hidden">
        {/* Fill */}
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={active ? { width: `${pct}%` } : { width: 0 }}
          transition={{
            duration: 1.1,
            delay: index * 0.08 + 0.15,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          style={{
            background:
              "linear-gradient(90deg, oklch(0.72 0.18 50), oklch(0.72 0.22 210))",
          }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.20) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={
              active
                ? { backgroundPosition: ["200% 0", "-200% 0"] }
                : { backgroundPosition: "200% 0" }
            }
            transition={{
              duration: 2,
              delay: index * 0.08 + 1.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Skills Section ────────────────────────────────────────────────────────────

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const leftSkills = SKILLS.slice(0, 4);
  const rightSkills = SKILLS.slice(4);

  return (
    <section
      id="skills"
      className="relative section-pad border-b border-border/30 overflow-hidden"
      data-ocid="section-skills"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 90% 30%, oklch(0.72 0.22 210 / 0.05) 0%, transparent 65%), radial-gradient(ellipse 45% 40% at 10% 70%, oklch(0.72 0.18 50 / 0.04) 0%, transparent 65%)",
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
            What I know
            <span className="inline-block w-6 h-px bg-accent/70 ml-2 align-middle" />
          </p>
          <h2 className="section-heading gradient-gold-cyan inline-block">
            My Skills
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
            Expertise honed over 5+ years building high-performance web
            solutions
          </p>
        </motion.div>

        {/* Skills grid — two columns */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
        >
          {leftSkills.map((skill, i) => (
            <SkillBar
              key={skill.label}
              label={skill.label}
              pct={skill.pct}
              index={i}
              active={inView}
            />
          ))}
          {rightSkills.map((skill, i) => (
            <SkillBar
              key={skill.label}
              label={skill.label}
              pct={skill.pct}
              index={i + 4}
              active={inView}
            />
          ))}
        </div>

        {/* Bottom proficiency note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-muted-foreground text-xs font-mono text-center mt-10 uppercase tracking-widest"
        >
          Percentage reflects practical proficiency, not just theoretical
          knowledge
        </motion.p>
      </div>
    </section>
  );
}
