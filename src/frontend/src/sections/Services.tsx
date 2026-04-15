import { useReveal } from "@/hooks/useReveal";
import { useState } from "react";

const SERVICES = [
  {
    id: "wordpress",
    emoji: "🔧",
    title: "Custom WordPress Development",
    desc: "Full custom WordPress themes, child themes, and plugin development tailored to your exact business requirements and goals.",
    accentGold: true,
  },
  {
    id: "frontend",
    emoji: "🎨",
    title: "Frontend Design & Development",
    desc: "Modern, responsive frontend interfaces built with React, HTML5, CSS3, and JavaScript for stunning, high-converting user experiences.",
    accentGold: false,
  },
  {
    id: "security",
    emoji: "🛡️",
    title: "Malware Removal & Security",
    desc: "Complete WordPress security audits, malware scanning and removal, security hardening, and ongoing monitoring for lasting protection.",
    accentGold: true,
  },
  {
    id: "speed",
    emoji: "⚡",
    title: "Speed & Performance Optimization",
    desc: "Website speed analysis, Core Web Vitals optimization, caching configuration, CDN setup, and image optimization for blazing-fast load times.",
    accentGold: false,
  },
  {
    id: "bugfix",
    emoji: "🔍",
    title: "Bug Fixing & Maintenance",
    desc: "Systematic debugging, error resolution, theme/plugin conflict diagnosis and fixes, and ongoing WordPress maintenance packages.",
    accentGold: true,
  },
  {
    id: "ai",
    emoji: "🤖",
    title: "AI Automation Integration",
    desc: "Integrate ChatGPT, OpenAI APIs, and automation workflows into your WordPress site to streamline operations and enhance user experience.",
    accentGold: false,
  },
] as const;

interface ServiceCardProps {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  accentGold: boolean;
  delay: number;
  visible: boolean;
}

function ServiceCard({
  id,
  emoji,
  title,
  desc,
  accentGold,
  delay,
  visible,
}: ServiceCardProps) {
  const color = accentGold ? "oklch(0.72 0.18 50)" : "oklch(0.72 0.22 210)";
  const colorAlpha = (a: number) =>
    accentGold ? `oklch(0.72 0.18 50 / ${a})` : `oklch(0.72 0.22 210 / ${a})`;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="service-card relative flex flex-col p-6 rounded-2xl overflow-hidden cursor-default"
      style={{
        background: "oklch(0.13 0.016 48)",
        border: `1px solid ${hovered ? colorAlpha(0.45) : "oklch(0.28 0.018 48 / 0.6)"}`,
        boxShadow: hovered ? `0 12px 40px -10px ${colorAlpha(0.3)}` : "none",
        transform: visible
          ? hovered
            ? "translateY(-8px)"
            : "translateY(0)"
          : "translateY(40px)",
        opacity: visible ? 1 : 0,
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`service-card-${id}`}
    >
      {/* Top gradient accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.72 0.18 50), oklch(0.72 0.22 210))",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Radial hover glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${colorAlpha(0.09)} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Emoji icon */}
      <div
        className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
        style={{
          background: colorAlpha(0.12),
          boxShadow: hovered ? `0 0 20px -6px ${colorAlpha(0.4)}` : "none",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}
      >
        {emoji}
      </div>

      <h3
        className="relative z-10 font-display font-bold text-xl lg:text-2xl mb-3 tracking-tight leading-tight"
        style={{
          color: hovered ? color : "oklch(0.93 0.008 60)",
          transition: "color 0.25s ease",
        }}
      >
        {title}
      </h3>

      <p className="relative z-10 text-muted-foreground text-base lg:text-lg leading-[1.7] flex-1 font-body">
        {desc}
      </p>

      <a
        href="#contact"
        className="relative z-10 inline-flex items-center gap-1 text-base lg:text-lg font-semibold mt-5 font-accent"
        style={{ color, opacity: 0.85, transition: "opacity 0.2s ease" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
        }}
        data-ocid={`service-link-${id}`}
      >
        Get Started <span aria-hidden="true">→</span>
      </a>

      {/* Bottom expanding accent line */}
      <div
        className="absolute bottom-0 left-0 h-[1px] rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent)`,
          width: hovered ? "100%" : "0%",
          transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

export function Services() {
  const { ref: headRef, visible: headVisible } = useReveal(0.1);
  const { ref: gridRef, visible: gridVisible } = useReveal(0.05);

  return (
    <section
      id="services"
      className="relative section-pad border-b border-border/30 overflow-hidden ambient-bg"
      style={{ background: "oklch(0.11 0.014 48)" }}
      data-ocid="section-services"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.72 0.18 50 / 0.04) 0%, transparent 65%), radial-gradient(ellipse 40% 35% at 80% 80%, oklch(0.72 0.22 210 / 0.05) 0%, transparent 65%)",
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
              background: "oklch(0.72 0.18 50 / 0.12)",
              color: "oklch(0.72 0.18 50)",
              border: "1px solid oklch(0.72 0.18 50 / 0.25)",
            }}
          >
            What I Do
          </span>
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
            Professional web development solutions tailored to your needs
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              id={svc.id}
              emoji={svc.emoji}
              title={svc.title}
              desc={svc.desc}
              accentGold={svc.accentGold}
              delay={i * 100}
              visible={gridVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
