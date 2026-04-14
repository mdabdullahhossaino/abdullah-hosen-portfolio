import { Button } from "@/components/ui/button";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { SOCIAL_LINKS } from "@/types/portfolio";
import { ChevronDown, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useEffect, useRef } from "react";
import { SiFacebook } from "react-icons/si";

// ── Particle canvas ───────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  isGold: boolean;
  opacity: number;
  opacityDir: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // gold ≈ oklch(0.72 0.18 50) → rgb(201,161,76)
    // cyan ≈ oklch(0.65 0.20 210) → rgb(14,165,233)
    const COUNT = reducedMotion ? 0 : 90;
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      size: Math.random() * 2.0 + 0.7,
      isGold: Math.random() > 0.5,
      opacity: Math.random() * 0.5 + 0.15,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacityDir * 0.003;
        if (p.opacity > 0.68 || p.opacity < 0.1) p.opacityDir *= -1;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.isGold) {
          ctx.fillStyle = `rgba(201,161,76,${p.opacity})`;
          ctx.shadowColor = "rgba(201,161,76,0.55)";
        } else {
          ctx.fillStyle = `rgba(14,165,233,${p.opacity})`;
          ctx.shadowColor = "rgba(14,165,233,0.55)";
        }
        ctx.shadowBlur = p.size * 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Connecting lines within 120px
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.09;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.isGold
              ? `rgba(201,161,76,${alpha})`
              : `rgba(14,165,233,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={-1}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ── Subtle dot-grid overlay ───────────────────────────────────────────────────

function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, oklch(0.72 0.18 50 / 0.06) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        maskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      }}
    />
  );
}

// ── Social icon map ───────────────────────────────────────────────────────────

function SocialIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    github: <Github size={16} />,
    linkedin: <Linkedin size={16} />,
    twitter: <Twitter size={16} />,
    facebook: <SiFacebook size={16} />,
    email: <Mail size={16} />,
  };
  return icons[id] ?? null;
}

// ── Typing roles ──────────────────────────────────────────────────────────────

const ROLES = [
  "WordPress Developer",
  "Frontend Engineer",
  "UI/UX Designer",
  "Speed Optimizer",
];

// ── Avatar with glowing ring ──────────────────────────────────────────────────

function GlowingAvatar() {
  return (
    <div
      className="hero-item relative flex-shrink-0 mb-8"
      style={{ animationDelay: "0.1s" }}
    >
      {/* Outer glow ring — gold */}
      <div
        className="absolute inset-0 rounded-full"
        aria-hidden="true"
        style={{
          background:
            "conic-gradient(from 0deg, oklch(0.72 0.18 50 / 0.8), oklch(0.72 0.22 210 / 0.8), oklch(0.72 0.18 50 / 0.8))",
          padding: "2.5px",
          borderRadius: "50%",
          animation: "ring-rotate-cw 6s linear infinite",
          filter: "blur(1px)",
        }}
      />
      {/* Static border ring */}
      <div
        className="absolute rounded-full"
        aria-hidden="true"
        style={{
          inset: "-4px",
          border: "1.5px solid oklch(0.72 0.18 50 / 0.3)",
          borderRadius: "50%",
          boxShadow:
            "0 0 28px -6px oklch(0.72 0.18 50 / 0.55), inset 0 0 18px -8px oklch(0.72 0.22 210 / 0.2)",
        }}
      />
      {/* Avatar image container */}
      <div
        className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2"
        style={{
          borderColor: "oklch(0.22 0.016 48)",
          background: "oklch(0.13 0.014 48)",
          boxShadow:
            "0 0 0 3px oklch(0.72 0.18 50 / 0.12), 0 8px 32px -8px rgba(0,0,0,0.6)",
        }}
      >
        <img
          src="/assets/images/profile.jpg"
          alt="Abdullah Hosen — Expert WordPress Developer & Frontend Engineer"
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = "none";
            const parent = el.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="w-full h-full flex items-center justify-center text-3xl font-display font-bold" style="background:linear-gradient(135deg,oklch(0.72 0.18 50),oklch(0.72 0.22 210));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">AH</span>`;
            }
          }}
        />
      </div>
    </div>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────────────────

export function Hero() {
  const { displayText } = useTypingEffect({
    words: ROLES,
    typeSpeed: 70,
    deleteSpeed: 38,
    pauseDuration: 2100,
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-ocid="section-hero"
    >
      {/* ── Particle background ─────────────────────────────────────────── */}
      <ParticleCanvas />

      {/* ── Subtle dot grid ─────────────────────────────────────────────── */}
      <GridOverlay />

      {/* ── Radial ambient glow ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 80% 55% at 50% 55%, oklch(0.72 0.22 210 / 0.055) 0%, transparent 68%)",
            "radial-gradient(ellipse 60% 42% at 52% 46%, oklch(0.72 0.18 50 / 0.05) 0%, transparent 62%)",
            "radial-gradient(ellipse 40% 60% at 80% 20%, oklch(0.72 0.22 210 / 0.04) 0%, transparent 55%)",
            "radial-gradient(ellipse 35% 50% at 20% 80%, oklch(0.72 0.18 50 / 0.035) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* ── Decorative rotating rings ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: 580,
          height: 580,
          top: "50%",
          left: "50%",
          borderRadius: "50%",
          border: "1px solid oklch(0.72 0.22 210 / 0.08)",
          boxShadow: "0 0 80px -20px oklch(0.72 0.22 210 / 0.15)",
          animation: "ring-rotate-cw 20s linear infinite",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          top: "50%",
          left: "50%",
          borderRadius: "50%",
          border: "1px dashed oklch(0.72 0.18 50 / 0.08)",
          animation: "ring-rotate-ccw 26s linear infinite",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: 240,
          height: 240,
          top: "50%",
          left: "50%",
          borderRadius: "50%",
          border: "1px solid oklch(0.72 0.22 210 / 0.06)",
          animation: "ring-rotate-cw 15s linear infinite",
          animationDelay: "-5s",
        }}
      />

      {/* ── Hero content ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        {/* Glowing avatar — animates in first */}
        <GlowingAvatar />

        {/* Available badge */}
        <div className="hero-item mb-6" style={{ animationDelay: "0.25s" }}>
          <span
            className="badge-pulse inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-semibold tracking-wider uppercase"
            style={{
              borderColor: "oklch(0.72 0.22 210 / 0.4)",
              background: "oklch(0.72 0.22 210 / 0.08)",
              color: "oklch(0.72 0.22 210)",
            }}
            data-ocid="hero-badge"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "oklch(0.72 0.22 210)" }}
            />
            Available for Hire ✓
          </span>
        </div>

        {/* Greeting + name */}
        <div className="hero-item mb-3" style={{ animationDelay: "0.42s" }}>
          <p className="text-muted-foreground text-sm font-mono uppercase tracking-[0.22em] mb-3">
            Hello, I&apos;m
          </p>
          <h1
            className="gradient-gold-cyan hero-headline"
            style={{
              textShadow:
                "0 0 50px oklch(0.72 0.18 50 / 0.3), 0 0 90px oklch(0.72 0.22 210 / 0.18)",
            }}
          >
            Abdullah Hosen
          </h1>
        </div>

        {/* Typing role */}
        <div
          className="hero-item h-10 flex items-center justify-center mb-5"
          style={{ animationDelay: "0.62s" }}
          aria-live="polite"
          aria-atomic="true"
          data-ocid="hero-typing-role"
        >
          <span className="font-display text-xl md:text-2xl text-muted-foreground font-medium">
            I am a&nbsp;
          </span>
          <span
            className="font-display text-xl md:text-2xl font-bold pr-0.5 typing-cursor"
            style={{ color: "oklch(0.72 0.22 210)" }}
          >
            {displayText}
          </span>
        </div>

        {/* Location badge */}
        <div
          className="hero-item flex items-center gap-1.5 mb-5"
          style={{ animationDelay: "0.72s" }}
        >
          <span
            className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider"
            style={{ color: "oklch(0.72 0.18 50 / 0.75)" }}
          >
            <span aria-hidden="true">📍</span>
            Bangladesh
          </span>
          <span
            className="w-1 h-1 rounded-full"
            aria-hidden="true"
            style={{ background: "oklch(0.72 0.18 50 / 0.4)" }}
          />
          <span
            className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider"
            style={{ color: "oklch(0.72 0.18 50 / 0.75)" }}
          >
            5+ Years Experience
          </span>
        </div>

        {/* Bio */}
        <p
          className="hero-item text-muted-foreground text-base md:text-lg leading-relaxed mb-9"
          style={{ animationDelay: "0.82s", maxWidth: "58ch" }}
        >
          Building premium WordPress sites &amp; high-performance frontends with{" "}
          <span className="text-foreground font-medium">5+ years</span> of
          expertise in custom development, speed optimization &amp; security.
        </p>

        {/* CTA buttons */}
        <div
          className="hero-item flex flex-wrap items-center justify-center gap-4 mb-9"
          style={{ animationDelay: "1.0s" }}
        >
          <Button
            size="lg"
            className="font-display font-semibold px-7 py-3 text-base transition-smooth rounded-sm"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.62 0.17 45))",
              color: "oklch(0.10 0.015 50)",
              boxShadow: "0 0 26px -4px oklch(0.72 0.18 50 / 0.5)",
              border: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 36px -2px oklch(0.72 0.18 50 / 0.75), 0 4px 16px -4px rgba(0,0,0,0.4)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 26px -4px oklch(0.72 0.18 50 / 0.5)";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
            onClick={() => scrollToSection("portfolio")}
            data-ocid="cta-view-work"
          >
            View My Work
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="font-display font-semibold px-7 py-3 text-base transition-smooth rounded-sm"
            style={{
              borderColor: "oklch(0.72 0.22 210 / 0.5)",
              color: "oklch(0.72 0.22 210)",
              background: "transparent",
              boxShadow:
                "0 0 18px -6px oklch(0.72 0.22 210 / 0.3), inset 0 0 14px -8px oklch(0.72 0.22 210 / 0.08)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "oklch(0.72 0.22 210 / 0.1)";
              el.style.boxShadow =
                "0 0 28px -4px oklch(0.72 0.22 210 / 0.55), inset 0 0 18px -6px oklch(0.72 0.22 210 / 0.12)";
              el.style.borderColor = "oklch(0.72 0.22 210 / 0.75)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.boxShadow =
                "0 0 18px -6px oklch(0.72 0.22 210 / 0.3), inset 0 0 14px -8px oklch(0.72 0.22 210 / 0.08)";
              el.style.borderColor = "oklch(0.72 0.22 210 / 0.5)";
              el.style.transform = "";
            }}
            onClick={() => scrollToSection("contact")}
            data-ocid="cta-get-in-touch"
          >
            Get In Touch
          </Button>
        </div>

        {/* Social links */}
        <div
          className="hero-item-fade flex items-center gap-3 mb-16"
          style={{ animationDelay: "1.2s" }}
        >
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target={s.id !== "email" ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-smooth"
              style={{
                borderColor: "oklch(0.72 0.18 50 / 0.28)",
                color: "oklch(0.72 0.18 50 / 0.7)",
                background: "oklch(0.15 0.016 48 / 0.5)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "oklch(0.72 0.22 210 / 0.7)";
                el.style.color = "oklch(0.72 0.22 210)";
                el.style.boxShadow =
                  "0 0 16px -3px oklch(0.72 0.22 210 / 0.55)";
                el.style.background = "oklch(0.72 0.22 210 / 0.08)";
                el.style.transform = "scale(1.14) translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "oklch(0.72 0.18 50 / 0.28)";
                el.style.color = "oklch(0.72 0.18 50 / 0.7)";
                el.style.boxShadow = "";
                el.style.background = "oklch(0.15 0.016 48 / 0.5)";
                el.style.transform = "";
              }}
              data-ocid={`social-${s.id}`}
            >
              <SocialIcon id={s.id} />
            </a>
          ))}
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          onClick={() => scrollToSection("about")}
          className="hero-item-fade flex flex-col items-center gap-1 text-muted-foreground transition-smooth group"
          style={{ animationDelay: "1.5s" }}
          aria-label="Scroll to About section"
          data-ocid="scroll-indicator"
        >
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 group-hover:opacity-100 transition-smooth">
            Scroll Down
          </span>
          <span className="bounce-scroll opacity-50 group-hover:opacity-100 group-hover:text-primary transition-smooth">
            <ChevronDown size={18} />
          </span>
        </button>
      </div>
    </section>
  );
}
