import { useReveal } from "@/hooks/useReveal";

interface SkillBarProps {
  label: string;
  pct: number;
  index: number;
  active: boolean;
  fillStyle: "gold" | "cyan" | "mixed";
}

const FILL_GRADIENTS = {
  gold: "linear-gradient(90deg, oklch(0.65 0.18 50), oklch(0.72 0.18 50), oklch(0.76 0.16 55))",
  cyan: "linear-gradient(90deg, oklch(0.60 0.22 210), oklch(0.72 0.22 210), oklch(0.76 0.20 215))",
  mixed:
    "linear-gradient(90deg, oklch(0.72 0.18 50), oklch(0.70 0.22 230), oklch(0.72 0.22 210))",
};

function SkillBar({ label, pct, index, active, fillStyle }: SkillBarProps) {
  return (
    <div
      className="group"
      data-ocid={`skill-bar-${label.toLowerCase().replace(/[\s/&.]+/g, "-")}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-accent text-base lg:text-lg text-foreground font-medium">
          {label}
        </span>
        <span
          className="font-mono text-sm lg:text-base font-bold tabular-nums"
          style={{
            opacity: active ? 1 : 0,
            transition: `opacity 0.4s ease ${index * 80 + 300}ms`,
            color:
              fillStyle === "cyan"
                ? "oklch(0.72 0.22 210)"
                : fillStyle === "gold"
                  ? "oklch(0.72 0.18 50)"
                  : "oklch(0.76 0.20 215)",
          }}
        >
          {pct}%
        </span>
      </div>
      {/* Track */}
      <div
        className="h-[4px] w-full rounded-full overflow-hidden relative"
        style={{ background: "oklch(0.20 0.016 48)" }}
      >
        {/* Glow shimmer under bar */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            width: active ? `${pct}%` : "0%",
            background: FILL_GRADIENTS[fillStyle],
            boxShadow: `0 0 8px 1px ${fillStyle === "cyan" ? "oklch(0.72 0.22 210 / 0.5)" : fillStyle === "gold" ? "oklch(0.72 0.18 50 / 0.5)" : "oklch(0.72 0.22 210 / 0.4)"}`,
            transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${index * 80 + 150}ms`,
          }}
        />
        {/* Fill */}
        <div
          className="h-full rounded-full relative z-10"
          style={{
            width: active ? `${pct}%` : "0%",
            background: FILL_GRADIENTS[fillStyle],
            transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${index * 80 + 150}ms`,
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
    iconColor: "gold",
    fillStyle: "gold",
    skills: [
      { label: "WordPress", pct: 100 },
      { label: "Elementor", pct: 98 },
      { label: "HTML/CSS", pct: 90 },
      { label: "PHP", pct: 90 },
      { label: "JavaScript", pct: 80 },
    ],
  },
  {
    title: "Backend & CMS",
    icon: "⚙️",
    iconColor: "cyan",
    fillStyle: "cyan",
    skills: [
      { label: "cPanel / WHM", pct: 95 },
      { label: "WP Security", pct: 98 },
      { label: "Bug Fix", pct: 95 },
      { label: "Malware Remove", pct: 99 },
      { label: "WooCommerce", pct: 90 },
    ],
  },
  {
    title: "Tools & Workflow",
    icon: "🛠️",
    iconColor: "gold",
    fillStyle: "mixed",
    skills: [
      { label: "AI Tools", pct: 90 },
      { label: "AI Automation", pct: 94 },
      { label: "Figma", pct: 92 },
      { label: "Photoshop", pct: 85 },
      { label: "Page Speed Opt.", pct: 98 },
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
  const borderTop =
    category.iconColor === "gold"
      ? "oklch(0.72 0.18 50 / 0.45)"
      : "oklch(0.72 0.22 210 / 0.45)";

  return (
    <div
      ref={ref}
      className="skills-card flex flex-col p-6 rounded-2xl border border-border/30 overflow-hidden relative group"
      style={{
        background: "oklch(0.13 0.016 48)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
      data-ocid={`skills-card-${category.title.toLowerCase().replace(/[\s&/]+/g, "-")}`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${borderTop}, transparent)`,
        }}
        aria-hidden="true"
      />
      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-400 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${iconColor.replace(")", " / 0.07)")} 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: iconBg, color: iconColor }}
        >
          {category.icon}
        </div>
        <h3 className="font-display font-bold text-lg lg:text-xl text-foreground tracking-tight">
          {category.title}
        </h3>
        <div
          className="flex-1 h-px ml-auto"
          style={{ background: `${iconColor.replace(")", " / 0.18)")}` }}
        />
      </div>

      <div className="flex flex-col gap-5 relative z-10">
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
      className="relative section-pad border-b border-border/30 overflow-hidden ambient-bg"
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

      <div className="relative z-10 max-w-6xl mx-auto">
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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs lg:text-sm font-accent font-semibold uppercase tracking-widest mb-4"
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
          className="text-muted-foreground text-xs lg:text-sm font-accent text-center mt-10 uppercase tracking-widest"
          style={{
            opacity: gridVisible ? 1 : 0,
            transition: "opacity 0.6s ease-out 500ms",
          }}
        >
          Percentage reflects practical proficiency, not just theoretical
          knowledge
        </p>
      </div>

      <style>{`
        .skills-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .skills-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px -12px oklch(0.72 0.18 50 / 0.18); }
      `}</style>
    </section>
  );
}
