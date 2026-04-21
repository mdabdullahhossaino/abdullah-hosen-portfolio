import { useTypingEffect } from "@/hooks/useTypingEffect";
import { SOCIAL_LINKS } from "@/types/portfolio";
import { ChevronDown, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiFacebook } from "react-icons/si";

// ── Enhanced Interactive Particle Canvas ──────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  origVx: number;
  origVy: number;
  size: number;
  isGold: boolean;
  opacity: number;
  opacityDir: number;
}

interface GeoShape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  type: "triangle" | "hexagon";
  opacity: number;
  isGold: boolean;
}

interface TrailDot {
  x: number;
  y: number;
  alpha: number;
  radius: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const scrollRef = useRef(0);
  const clickRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const trailRef = useRef<TrailDot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // Explicit null guard — getContext can return null on some environments
    if (!ctx) {
      console.error("[ParticleCanvas] Failed to get 2D context");
      return;
    }

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

    const COUNT = reducedMotion ? 0 : 90;
    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const vx = (Math.random() - 0.5) * 0.32;
      const vy = (Math.random() - 0.5) * 0.32;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx,
        vy,
        origVx: vx,
        origVy: vy,
        size: Math.random() * 2.0 + 0.7,
        isGold: Math.random() > 0.5,
        opacity: Math.random() * 0.5 + 0.15,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
      };
    });

    const GEO_COUNT = reducedMotion ? 0 : 8;
    const geoShapes: GeoShape[] = Array.from({ length: GEO_COUNT }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      size: Math.random() * 18 + 10,
      type: Math.random() > 0.5 ? "triangle" : "hexagon",
      opacity: Math.random() * 0.08 + 0.03,
      isGold: Math.random() > 0.5,
    }));

    // Mouse interaction — listen on the PARENT container (not the canvas itself)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      trailRef.current.push({
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        alpha: 0.7,
        radius: 3,
      });
      if (trailRef.current.length > 18) trailRef.current.shift();
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      clickRef.current = { x: cx, y: cy, time: Date.now() };
      // Burst particles from click point
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          origVx: 0,
          origVy: 0,
          size: Math.random() * 3 + 1,
          isGold: Math.random() > 0.5,
          opacity: 0.9,
          opacityDir: -1,
        });
      }
      if (particles.length > 200) particles.splice(0, particles.length - 200);
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const parentEl = canvas.parentElement;
    if (parentEl) {
      parentEl.addEventListener("mousemove", handleMouseMove);
      parentEl.addEventListener("click", handleClick);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    function drawHexagon(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
    ) {
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
    }

    function drawTriangle(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
    ) {
      c.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
    }

    const draw = () => {
      const { x: mx, y: my } = mouseRef.current;
      const scrollFactor = Math.min(scrollRef.current / 1000, 1);
      const speedMult = 1 + scrollFactor * 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cursor trail
      for (let i = 0; i < trailRef.current.length; i++) {
        const dot = trailRef.current[i];
        const t = i / trailRef.current.length;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * t, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.72 0.22 210 / ${dot.alpha * t * 0.6})`;
        ctx.fill();
        dot.alpha *= 0.9;
      }
      trailRef.current = trailRef.current.filter((d) => d.alpha > 0.02);

      // Geo shapes
      for (const g of geoShapes) {
        g.x += g.vx * speedMult;
        g.y += g.vy * speedMult;
        g.rotation += g.rotationSpeed;

        if (g.x < -g.size) g.x = canvas.width + g.size;
        if (g.x > canvas.width + g.size) g.x = -g.size;
        if (g.y < -g.size) g.y = canvas.height + g.size;
        if (g.y > canvas.height + g.size) g.y = -g.size;

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rotation);
        ctx.globalAlpha = g.opacity + scrollFactor * 0.04;
        ctx.strokeStyle = g.isGold
          ? "oklch(0.72 0.18 50 / 0.85)"
          : "oklch(0.72 0.22 210 / 0.85)";
        ctx.lineWidth = 1;

        if (g.type === "hexagon") {
          drawHexagon(ctx, 0, 0, g.size);
        } else {
          drawTriangle(ctx, 0, 0, g.size);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Particles
      for (const p of particles) {
        // Repel from mouse
        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;
        const REPEL_RADIUS = 100;

        if (distSq < REPEL_RADIUS * REPEL_RADIUS && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.vx += (dx / dist) * force * 0.8;
          p.vy += (dy / dist) * force * 0.8;
        } else {
          // Drift back to original velocity
          p.vx += (p.origVx - p.vx) * 0.04;
          p.vy += (p.origVy - p.vy) * 0.04;
        }

        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;
        p.opacity += p.opacityDir * 0.003;
        if (p.opacity > 0.68 || p.opacity < 0.1) p.opacityDir *= -1;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Near mouse: glow brighter
        const nearMouse = distSq < 80 * 80;
        const glowOpacity = nearMouse ? p.opacity * 2 : p.opacity;
        const size = nearMouse ? p.size * 1.6 : p.size;
        // Scroll: shift to darker drama
        const colorShift = scrollFactor * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        if (p.isGold) {
          ctx.fillStyle = `rgba(${Math.round(201 - colorShift * 40)},${Math.round(161 - colorShift * 30)},76,${glowOpacity})`;
          ctx.shadowColor = nearMouse
            ? "rgba(255,220,100,0.8)"
            : "rgba(201,161,76,0.55)";
        } else {
          ctx.fillStyle = `rgba(14,${Math.round(165 - colorShift * 60)},${Math.round(233 - colorShift * 80)},${glowOpacity})`;
          ctx.shadowColor = nearMouse
            ? "rgba(100,240,255,0.8)"
            : "rgba(14,165,233,0.55)";
        }
        ctx.shadowBlur = nearMouse ? size * 10 : size * 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Connection lines
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
      if (parentEl) {
        parentEl.removeEventListener("mousemove", handleMouseMove);
        parentEl.removeEventListener("click", handleClick);
      }
      window.removeEventListener("scroll", handleScroll);
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

// ── Service showcase carousel ─────────────────────────────────────────────────

const SERVICES_CAROUSEL = [
  {
    emoji: "🔧",
    title: "Custom WordPress Development",
    tagline: "Full custom themes & plugin solutions",
    isGold: true,
  },
  {
    emoji: "🎨",
    title: "Frontend Design & Development",
    tagline: "Modern, high-converting interfaces",
    isGold: false,
  },
  {
    emoji: "🛡️",
    title: "Malware Removal & Security",
    tagline: "Full audits & security hardening",
    isGold: true,
  },
  {
    emoji: "⚡",
    title: "Speed & Performance Optimization",
    tagline: "Core Web Vitals & blazing load times",
    isGold: false,
  },
  {
    emoji: "🔍",
    title: "Bug Fixing & Maintenance",
    tagline: "Fast diagnosis & conflict resolution",
    isGold: true,
  },
  {
    emoji: "🤖",
    title: "AI Automation Integration",
    tagline: "ChatGPT & workflow automation",
    isGold: false,
  },
];

function ServiceCarousel() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const activeRef = useRef(0);

  // Keep ref in sync with state to use in timeout callbacks without stale closure
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    // Trigger initial enter
    const initTimer = setTimeout(() => setPhase("visible"), 50);

    const id = setInterval(() => {
      setPhase("exit");
      setTimeout(() => {
        const next = (activeRef.current + 1) % SERVICES_CAROUSEL.length;
        setActive(next);
        setPhase("enter");
        setTimeout(() => setPhase("visible"), 50);
      }, 350);
    }, 3000);

    return () => {
      clearInterval(id);
      clearTimeout(initTimer);
    };
  }, []);

  const svc = SERVICES_CAROUSEL[active];
  const goldColor = "oklch(0.72 0.18 50)";
  const cyanColor = "oklch(0.72 0.22 210)";
  const color = svc.isGold ? goldColor : cyanColor;

  const translateY =
    phase === "enter" || phase === "exit"
      ? phase === "enter"
        ? "translateY(22px)"
        : "translateY(-18px)"
      : "translateY(0)";
  const opacity = phase === "visible" ? 1 : 0;

  return (
    <div
      className="hero-item w-full max-w-sm mx-auto mb-8"
      style={{ animationDelay: "0.85s" }}
      data-ocid="hero-service-carousel"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-4"
        style={{
          background: "oklch(0.14 0.016 48 / 0.85)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${svc.isGold ? "oklch(0.72 0.18 50 / 0.35)" : "oklch(0.72 0.22 210 / 0.35)"}`,
          boxShadow: `0 0 30px -8px ${color.replace(")", " / 0.25)")}`,
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        {/* Gradient shimmer bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
          aria-hidden="true"
        />

        {/* Icon */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{
            background: svc.isGold
              ? "oklch(0.72 0.18 50 / 0.14)"
              : "oklch(0.72 0.22 210 / 0.14)",
            transition: "transform 0.3s ease, opacity 0.3s ease",
            transform: translateY,
            opacity,
          }}
        >
          {svc.emoji}
        </div>

        {/* Text */}
        <div
          className="flex-1 min-w-0"
          style={{
            transform: translateY,
            opacity,
            transition:
              "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
          }}
        >
          <p className="font-display font-bold text-sm lg:text-base text-foreground leading-snug tracking-tight truncate">
            {svc.title}
          </p>
          <p
            className="font-accent text-xs mt-0.5 truncate"
            style={{ color: "oklch(0.55 0.012 55)" }}
          >
            {svc.tagline}
          </p>
        </div>

        {/* Arrow */}
        <span
          className="shrink-0 text-sm font-mono"
          style={{
            color,
            transform: translateY,
            opacity,
            transition:
              "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94) 0.05s, opacity 0.4s ease 0.05s",
          }}
          aria-hidden="true"
        >
          →
        </span>
      </div>

      {/* Dot indicators */}
      <div
        className="flex items-center justify-center gap-1.5 mt-3"
        role="tablist"
        aria-label="Service indicator"
      >
        {SERVICES_CAROUSEL.map((svcItem, i) => (
          <button
            key={svcItem.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Service ${i + 1}`}
            onClick={() => {
              setActive(i);
              setPhase("enter");
              setTimeout(() => setPhase("visible"), 50);
            }}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === active ? "20px" : "6px",
              height: "6px",
              background:
                i === active
                  ? svc.isGold
                    ? goldColor
                    : cyanColor
                  : "oklch(0.30 0.016 48)",
            }}
            data-ocid={`carousel-dot-${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Avatar with premium glowing ring ─────────────────────────────────────────

function GlowingAvatar() {
  return (
    <div
      className="hero-item relative flex-shrink-0 mb-8"
      style={{ animationDelay: "0.1s" }}
    >
      {/* Outer glow halo */}
      <div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: "-18px",
          background:
            "radial-gradient(circle, oklch(0.72 0.18 50 / 0.18) 0%, oklch(0.72 0.22 210 / 0.10) 55%, transparent 75%)",
          filter: "blur(6px)",
        }}
      />
      {/* Spinning conic gradient ring */}
      <div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: "-6px",
          background:
            "conic-gradient(from 0deg, oklch(0.72 0.18 50 / 0.85), oklch(0.72 0.22 210 / 0.7), oklch(0.72 0.18 50 / 0.0), oklch(0.72 0.18 50 / 0.85))",
          borderRadius: "50%",
          animation: "ring-rotate-cw 5s linear infinite",
          filter: "blur(1px)",
        }}
      />
      {/* CCW counter-ring */}
      <div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: "-2px",
          background:
            "conic-gradient(from 180deg, oklch(0.72 0.22 210 / 0.0), oklch(0.72 0.22 210 / 0.65), oklch(0.72 0.18 50 / 0.4), oklch(0.72 0.22 210 / 0.0))",
          borderRadius: "50%",
          animation: "ring-rotate-ccw 3.5s linear infinite",
        }}
      />
      {/* Static border ring */}
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          inset: "-4px",
          border: "1.5px solid oklch(0.72 0.18 50 / 0.25)",
          borderRadius: "50%",
          boxShadow:
            "0 0 32px -6px oklch(0.72 0.18 50 / 0.6), inset 0 0 18px -8px oklch(0.72 0.22 210 / 0.2)",
        }}
      />
      {/* Avatar image container */}
      <div
        className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2"
        style={{
          borderColor: "oklch(0.22 0.016 48)",
          background: "oklch(0.13 0.014 48)",
          boxShadow:
            "0 0 0 3px oklch(0.72 0.18 50 / 0.15), 0 12px 40px -10px rgba(0,0,0,0.7)",
        }}
      >
        <img
          src="/assets/profile-studio.jpg"
          alt="Abdullah Hosen — Expert WordPress Developer & Frontend Engineer"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.src = "/assets/generated/profile-avatar.dim_400x400.jpg";
            el.onerror = () => {
              el.style.display = "none";
              const parent = el.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="w-full h-full flex items-center justify-center text-3xl font-display font-bold" style="background:linear-gradient(135deg,oklch(0.72 0.18 50),oklch(0.72 0.22 210));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">AH</span>`;
              }
            };
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
      <ParticleCanvas />
      <GridOverlay />

      {/* Radial ambient glow */}
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

      {/* Decorative rotating rings */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: 580,
          height: 580,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
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
          width: 420,
          height: 420,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          border: "1px dashed oklch(0.72 0.18 50 / 0.08)",
          animation: "ring-rotate-ccw 26s linear infinite",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: 260,
          height: 260,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          border: "1px solid oklch(0.72 0.22 210 / 0.06)",
          animation: "ring-rotate-cw 15s linear infinite",
          animationDelay: "-5s",
        }}
      />

      {/* Hero content — extra top padding on mobile to avoid header overlap */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto pt-24 md:pt-20 lg:pt-0">
        <GlowingAvatar />

        {/* Available badge */}
        <div className="hero-item mb-6" style={{ animationDelay: "0.25s" }}>
          <span
            className="badge-pulse inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs lg:text-sm font-accent font-semibold tracking-wider uppercase"
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
          <p className="text-muted-foreground text-sm lg:text-base font-accent font-medium uppercase tracking-[0.22em] mb-3">
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
          className="hero-item h-10 lg:h-14 flex items-center justify-center mb-5"
          style={{ animationDelay: "0.62s" }}
          aria-live="polite"
          aria-atomic="true"
          data-ocid="hero-typing-role"
        >
          <span className="font-accent text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
            I am a&nbsp;
          </span>
          <span
            className="font-accent text-xl md:text-2xl lg:text-3xl font-bold pr-0.5 typing-cursor"
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
            className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-accent tracking-wider"
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
            className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-accent tracking-wider"
            style={{ color: "oklch(0.72 0.18 50 / 0.75)" }}
          >
            5+ Years Experience
          </span>
        </div>

        {/* Bio */}
        <p
          className="hero-item text-muted-foreground text-base md:text-lg lg:text-xl leading-[1.75] mb-8 font-body"
          style={{ animationDelay: "0.82s", maxWidth: "58ch" }}
        >
          Building premium WordPress sites &amp; high-performance frontends with{" "}
          <span className="text-foreground font-semibold">5+ years</span> of
          expertise in custom development, speed optimization &amp; security.
        </p>

        {/* Service Carousel */}
        <ServiceCarousel />

        {/* CTA buttons */}
        <div
          className="hero-item flex flex-wrap items-center justify-center gap-4 mb-9"
          style={{ animationDelay: "1.0s" }}
        >
          <button
            type="button"
            className="font-accent font-semibold px-8 py-3.5 text-base lg:text-lg transition-smooth rounded-sm"
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
          </button>

          <button
            type="button"
            className="font-accent font-semibold px-8 py-3.5 text-base lg:text-lg transition-smooth rounded-sm"
            style={{
              borderWidth: "1px",
              borderStyle: "solid",
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
          </button>
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
