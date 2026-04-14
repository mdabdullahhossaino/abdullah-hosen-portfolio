import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/useReveal";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return count;
}

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  accentGold: boolean;
  delay: number;
  visible: boolean;
}

function StatCard({
  value,
  suffix,
  label,
  active,
  accentGold,
  delay,
  visible,
}: StatCardProps) {
  const count = useCountUp(value, active);
  const color = accentGold ? "oklch(0.72 0.18 50)" : "oklch(0.72 0.22 210)";
  const glow = accentGold
    ? "0 4px 24px -8px oklch(0.72 0.18 50 / 0.3)"
    : "0 4px 24px -8px oklch(0.72 0.22 210 / 0.3)";

  return (
    <div
      className="stat-card relative flex flex-col items-center text-center p-5 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        boxShadow: glow,
      }}
      data-ocid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${color.replace(")", " / 0.12)")} 0%, transparent 70%)`,
        }}
      />
      <div
        className="font-mono font-bold text-3xl mb-1 relative z-10"
        style={{ color }}
      >
        {count}
        <span>{suffix}</span>
      </div>
      <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider relative z-10">
        {label}
      </p>
    </div>
  );
}

const STATS = [
  { value: 5, suffix: "+", label: "Years Experience", accentGold: true },
  { value: 200, suffix: "+", label: "Projects Done", accentGold: false },
  { value: 50, suffix: "+", label: "Happy Clients", accentGold: true },
  { value: 100, suffix: "%", label: "Satisfaction Rate", accentGold: false },
];

const SKILL_TAGS = [
  "WordPress",
  "PHP",
  "React",
  "JavaScript",
  "CSS/SASS",
  "Figma",
  "SEO",
  "Performance",
];

export function About() {
  const { ref: sectionRef, visible: sectionVisible } = useReveal(0.1);
  const { ref: statsRef, visible: statsVisible } = useReveal(0.2);

  return (
    <section
      id="about"
      className="relative section-pad border-b border-border/30 overflow-hidden"
      style={{ background: "oklch(0.13 0.016 48)" }}
      data-ocid="section-about"
    >
      {/* Ambient glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 10% 50%, oklch(0.72 0.18 50 / 0.05) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 90% 60%, oklch(0.72 0.22 210 / 0.04) 0%, transparent 65%)",
        }}
      />

      <div ref={sectionRef} className="relative z-10 max-w-5xl mx-auto">
        {/* Section label */}
        <div
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? "translateY(0)" : "translateY(30px)",
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
            About Me
          </span>
          <h2 className="section-heading gradient-gold-cyan inline-block">
            WordPress Developer &amp; Frontend Engineer
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
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-14">
          {/* LEFT — profile image */}
          <div
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? "translateX(0)" : "translateX(-50px)",
              transition:
                "opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s",
            }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 0deg, oklch(0.72 0.18 50 / 0.35), oklch(0.72 0.22 210 / 0.35), oklch(0.72 0.18 50 / 0.35))",
                  filter: "blur(10px)",
                }}
                aria-hidden="true"
              />
              <div
                className="relative w-64 h-72 md:w-72 md:h-80 rounded-2xl overflow-hidden border border-border/30 profile-card"
                style={{ background: "oklch(0.13 0.016 48)" }}
              >
                <img
                  src="/assets/generated/profile-avatar.dim_400x400.jpg"
                  alt="Abdullah Hosen — Expert WordPress Developer & Frontend Engineer"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const fallback = el.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full items-center justify-center text-5xl font-display font-bold gradient-gold-cyan"
                  style={{ display: "none" }}
                >
                  AH
                </div>
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 profile-card-glow pointer-events-none"
                  style={{
                    boxShadow:
                      "inset 0 0 0 2px oklch(0.72 0.18 50 / 0.6), 0 0 30px -5px oklch(0.72 0.18 50 / 0.4)",
                    transition: "opacity 0.3s ease",
                  }}
                />
              </div>
              {/* Available badge */}
              <div
                className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-full border border-border/40 bg-card/90 backdrop-blur-sm flex items-center gap-1.5"
                style={{ boxShadow: "0 0 16px -4px oklch(0.72 0.18 50 / 0.4)" }}
              >
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: "oklch(0.72 0.18 50)" }}
                >
                  Available for Work
                </span>
                <span
                  className="inline-block w-2 h-2 rounded-full badge-pulse"
                  style={{ background: "oklch(0.72 0.55 145)" }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — bio */}
          <div
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? "translateX(0)" : "translateX(50px)",
              transition:
                "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
            }}
          >
            <p
              className="font-mono text-xs uppercase tracking-widest mb-5"
              style={{ color: "oklch(0.55 0.012 55)" }}
            >
              Based in Bangladesh · Open to Remote
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I'm{" "}
              <span className="text-foreground font-semibold">
                Abdullah Hosen
              </span>
              , a passionate WordPress developer and Frontend Engineer based in
              Bangladesh with 5+ years of professional experience. I specialize
              in building high-performance, visually stunning websites that
              drive real business results.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-7">
              My expertise spans custom WordPress theme development, plugin
              integration, frontend design systems, security hardening, and AI
              automation integration. I'm dedicated to delivering pixel-perfect
              solutions that exceed client expectations every time.
            </p>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {SKILL_TAGS.map((tag, i) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono rounded-full skill-tag"
                  style={{
                    background:
                      i % 2 === 0
                        ? "oklch(0.72 0.18 50 / 0.10)"
                        : "oklch(0.72 0.22 210 / 0.10)",
                    color:
                      i % 2 === 0
                        ? "oklch(0.72 0.18 50)"
                        : "oklch(0.72 0.22 210)",
                    border: `1px solid ${i % 2 === 0 ? "oklch(0.72 0.18 50 / 0.25)" : "oklch(0.72 0.22 210 / 0.25)"}`,
                    transition: "all 0.25s ease",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="font-display font-semibold gap-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.65 0.16 45))",
                color: "oklch(0.10 0.015 50)",
                boxShadow: "0 0 22px -4px oklch(0.72 0.18 50 / 0.45)",
                border: "none",
              }}
              data-ocid="about-download-cv"
            >
              <a href="/cv-md-abdullah-hosen.pdf" download>
                <Download size={16} />
                Download CV
              </a>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              active={statsVisible}
              accentGold={stat.accentGold}
              delay={i * 100}
              visible={statsVisible}
            />
          ))}
        </div>
      </div>

      <style>{`
        .profile-card:hover .profile-card-glow { opacity: 1 !important; }
        .skill-tag:hover { transform: translateY(-2px); filter: brightness(1.15); }
        .stat-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .stat-card:hover { transform: translateY(-6px) !important; }
      `}</style>
    </section>
  );
}
