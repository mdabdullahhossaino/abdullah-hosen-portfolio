import { useEffect, useRef } from "react";

interface TimelineItem {
  id: number;
  title: string;
  org: string;
  period: string;
  description: string;
}

const WORK_EXPERIENCE: TimelineItem[] = [
  {
    id: 1,
    title: "Senior WordPress Developer",
    org: "Freelance / Self-employed",
    period: "2019 – Present",
    description:
      "Delivering custom WordPress solutions to international clients — high-performance themes, WooCommerce stores, security hardening, and AI automation integrations.",
  },
  {
    id: 2,
    title: "Frontend Developer",
    org: "Web Agency Bangladesh",
    period: "2021 – 2023",
    description:
      "Built responsive frontend interfaces and WordPress themes for 50+ client projects across e-commerce, corporate, and portfolio verticals.",
  },
  {
    id: 3,
    title: "WP Support Specialist",
    org: "Remote Tech Support Co.",
    period: "2020 – 2022",
    description:
      "Handled malware removal, plugin conflict resolution, speed optimization, and emergency bug fixes for a diverse client base. 99%+ satisfaction rating.",
  },
];

const EDUCATION: TimelineItem[] = [
  {
    id: 1,
    title: "B.Sc. in Computer Science & IT",
    org: "University of Bangladesh",
    period: "2015 – 2019",
    description:
      "Major in Computer Science. Coursework in data structures, algorithms, web technologies, databases, and software engineering.",
  },
  {
    id: 2,
    title: "Full-Stack Web Dev Bootcamp",
    org: "Online (Udemy / Coursera)",
    period: "2019",
    description:
      "Intensive frontend + WordPress development program covering React, TypeScript, modern CSS, and WordPress plugin development.",
  },
  {
    id: 3,
    title: "WordPress Security Certification",
    org: "WPSec Academy",
    period: "2020",
    description:
      "Certified training in WordPress security hardening, malware removal, firewall configuration, and incident response procedures.",
  },
];

function useRevealList(
  containerRef: React.RefObject<Element | null>,
  itemSelector: string,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const items = Array.from(container.querySelectorAll(itemSelector));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number.parseInt(el.dataset.delay ?? "0", 10);
            setTimeout(() => el.classList.add("revealed"), delay);
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1 },
    );
    for (const el of items) observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, itemSelector]);
}

function TimelineColumn({
  items,
  accent,
  dotGlow,
}: {
  items: TimelineItem[];
  accent: "gold" | "cyan";
  dotGlow: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useRevealList(
    containerRef as React.RefObject<Element>,
    "[data-timeline-item]",
  );

  const dotColor =
    accent === "gold" ? "oklch(0.72 0.18 50)" : "oklch(0.72 0.22 210)";
  const lineColor =
    accent === "gold"
      ? "linear-gradient(to bottom, oklch(0.72 0.18 50/0.9), oklch(0.72 0.18 50/0.3))"
      : "linear-gradient(to bottom, oklch(0.72 0.22 210/0.9), oklch(0.72 0.22 210/0.3))";
  const orgColorClass = accent === "gold" ? "text-primary" : "text-accent";

  return (
    <div ref={containerRef} className="relative pl-7">
      {/* Vertical accent line */}
      <div
        className="absolute left-[11px] top-4 bottom-4 w-0.5 rounded-full"
        style={{ background: lineColor }}
      />

      {items.map((item, i) => (
        <div
          key={item.id}
          className="relative mb-8 last:mb-0 reveal-fade-up"
          data-timeline-item
          data-delay={i * 120}
        >
          {/* Glow dot */}
          <div
            className="timeline-dot absolute -left-[1px] top-5 w-3 h-3 rounded-full z-10 transition-smooth"
            style={{
              background: dotColor,
              boxShadow: dotGlow,
            }}
          />

          {/* Card */}
          <div
            className="bg-card rounded-xl border border-border/40 p-4 transition-smooth group hover:border-border/70"
            style={{
              transition:
                "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateX(4px)";
              el.style.boxShadow = `0 4px 20px -8px ${dotColor}55`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateX(0)";
              el.style.boxShadow = "none";
            }}
          >
            <span className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              {item.period}
            </span>
            <h3 className="font-display font-semibold text-sm text-foreground leading-snug mb-0.5">
              {item.title}
            </h3>
            <p className={`text-xs font-mono mb-2 ${orgColorClass}`}>
              {item.org}
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Experience() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      className="relative section-pad border-b border-border/30 overflow-hidden"
      style={{ background: "oklch(0.12 0.015 48)" }}
      data-ocid="section-experience"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 20% 60%, oklch(0.72 0.18 50 / 0.04) 0%, transparent 70%), radial-gradient(ellipse 45% 35% at 80% 30%, oklch(0.72 0.22 210 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div ref={headingRef} className="reveal-fade-up mb-12">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest mb-3"
            style={{
              background: "oklch(0.72 0.18 50 / 0.12)",
              color: "oklch(0.72 0.18 50)",
              border: "1px solid oklch(0.72 0.18 50 / 0.3)",
            }}
          >
            My Journey
          </span>
          <h2 className="section-heading gradient-gold-cyan inline-block">
            Experience &amp; Education
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

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div>
            <div className="flex items-center gap-2 mb-7">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg text-base"
                style={{ background: "oklch(0.72 0.18 50 / 0.12)" }}
              >
                💼
              </span>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Work Experience
              </p>
            </div>
            <TimelineColumn
              items={WORK_EXPERIENCE}
              accent="gold"
              dotGlow="0 0 10px 3px oklch(0.72 0.18 50/0.55), 0 0 4px 1px oklch(0.72 0.18 50/0.35)"
            />
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-2 mb-7">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg text-base"
                style={{ background: "oklch(0.72 0.22 210 / 0.12)" }}
              >
                🎓
              </span>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Education &amp; Certifications
              </p>
            </div>
            <TimelineColumn
              items={EDUCATION}
              accent="cyan"
              dotGlow="0 0 10px 3px oklch(0.72 0.22 210/0.55), 0 0 4px 1px oklch(0.72 0.22 210/0.35)"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
