import { useReveal } from "@/hooks/useReveal";
import { useState } from "react";

interface SkillBarProps {
  label: string;
  pct: number;
  index: number;
  active: boolean;
  fillStyle: "gold" | "cyan" | "mixed";
}

const FILL_GRADIENTS = {
  gold: "linear-gradient(90deg, oklch(0.72 0.18 50), oklch(0.68 0.16 45))",
  cyan: "linear-gradient(90deg, oklch(0.62 0.22 210), oklch(0.72 0.22 210))",
  mixed: "linear-gradient(90deg, oklch(0.72 0.18 50), oklch(0.72 0.22 210))",
};

function SkillBar({ label, pct, index, active, fillStyle }: SkillBarProps) {
  return (
    <div
      className="group"
      data-ocid={`skill-bar-${label.toLowerCase().replace(/[\s/&.]+/g, "-")}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body text-sm text-foreground">{label}</span>
        <span
          className="font-mono text-xs font-semibold"
          style={{
            opacity: active ? 1 : 0,
            transition: `opacity 0.4s ease ${index * 80 + 300}ms`,
            color:
              fillStyle === "cyan"
                ? "oklch(0.72 0.22 210)"
                : "oklch(0.72 0.18 50)",
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        className="h-[3px] w-full rounded-full overflow-hidden"
        style={{ background: "oklch(0.22 0.016 48)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: active ? `${pct}%` : "0%",
            background: FILL_GRADIENTS[fillStyle],
            transition: `width 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${index * 80 + 150}ms`,
          }}
        />
      </div>
    </div>
  );
}

interface SkillCategory {
  title: string;
  icon: string;
  iconColor: "gold" | "cyan";
  fillStyle: "gold" | "cyan" | "mixed";
  skills: { label: string; pct: number }[];
}

const CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: "🖥️",
    iconColor: "cyan",
    fillStyle: "gold",
    skills: [
      { label: "HTML/CSS", pct: 95 },
      { label: "JavaScript", pct: 90 },
      { label: "WordPress", pct: 92 },
      { label: "Elementor", pct: 88 },
      { label: "PHP", pct: 75 },
    ],
  },
  {
    title: "Backend & CMS",
    icon: "⚙️",
    iconColor: "gold",
    fillStyle: "cyan",
    skills: [
      { label: "MySQL", pct: 80 },
      { label: "cPanel / WHM", pct: 85 },
      { label: "Git / GitHub", pct: 88 },
      { label: "WP Security", pct: 90 },
      { label: "WooCommerce", pct: 87 },
    ],
  },
  {
    title: "Tools & Workflow",
    icon: "🛠️",
    iconColor: "cyan",
    fillStyle: "mixed",
    skills: [
      { label: "VS Code", pct: 95 },
      { label: "Figma", pct: 82 },
      { label: "AI Tools", pct: 85 },
      { label: "Photoshop", pct: 75 },
      { label: "Page Speed Opt.", pct: 93 },
    ],
  },
];

interface CategoryCardProps {
  category: SkillCategory;
  delay: number;
  visible: boolean;
}

function CategoryCard({ category, delay, visible }: CategoryCardProps) {
  const { ref, visible: cardActive } = useReveal(0.2);
  const iconBg =
    category.iconColor === "gold"
      ? "oklch(0.72 0.18 50 / 0.12)"
      : "oklch(0.72 0.22 210 / 0.12)";
  const iconColor =
    category.iconColor === "gold"
      ? "oklch(0.72 0.18 50)"
      : "oklch(0.72 0.22 210)";

  return (
    <div
      ref={ref}
      className="flex flex-col p-6 rounded-2xl border border-border/30 overflow-hidden"
      style={{
        background: "oklch(0.13 0.016 48)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
      data-ocid={`skills-card-${category.title.toLowerCase().replace(/[\s&/]+/g, "-")}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {category.icon}
        </div>
        <h3 className="font-display font-semibold text-base text-foreground">
          {category.title}
        </h3>
        <div
          className="flex-1 h-px ml-auto"
          style={{ background: `${iconColor.replace(")", " / 0.2)")}` }}
        />
      </div>

      <div className="flex flex-col gap-4">
        {category.skills.map((skill, i) => (
          <SkillBar
            key={skill.label}
            label={skill.label}
            pct={skill.pct}
            index={i}
            active={cardActive}
            fillStyle={category.fillStyle}
          />
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const { ref: headRef, visible: headVisible } = useReveal(0.1);
  const { ref: gridRef, visible: gridVisible } = useReveal(0.1);

  return (
    <section
      id="skills"
      className="relative section-pad border-b border-border/30 overflow-hidden"
      data-ocid="section-skills"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 90% 30%, oklch(0.72 0.22 210 / 0.05) 0%, transparent 65%), radial-gradient(ellipse 45% 40% at 10% 70%, oklch(0.72 0.18 50 / 0.04) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div
          ref={headRef}
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
          className="mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-4"
            style={{
              background: "oklch(0.72 0.22 210 / 0.12)",
              color: "oklch(0.72 0.22 210)",
              border: "1px solid oklch(0.72 0.22 210 / 0.25)",
            }}
          >
            My Expertise
          </span>
          <h2 className="section-heading gradient-gold-cyan inline-block">
            Technical Skills
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
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.title}
              category={cat}
              delay={i * 100}
              visible={gridVisible}
            />
          ))}
        </div>

        <p
          className="text-muted-foreground text-xs font-mono text-center mt-10 uppercase tracking-widest"
          style={{
            opacity: gridVisible ? 1 : 0,
            transition: "opacity 0.6s ease-out 500ms",
          }}
        >
          Percentage reflects practical proficiency, not just theoretical
          knowledge
        </p>
      </div>
    </section>
  );
}
