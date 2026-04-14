import { Button } from "@/components/ui/button";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { SOCIAL_LINKS } from "@/types/portfolio";
import { ChevronDown, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

// ── Particle canvas ──────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  opacityDir: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GOLD = "201 161 76"; // rgb approx of oklch gold
    const CYAN = "14 165 233"; // rgb approx of oklch cyan

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 90;
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2.2 + 0.6,
      color: Math.random() > 0.52 ? GOLD : CYAN,
      opacity: Math.random() * 0.55 + 0.15,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
    }));
    particlesRef.current = particles;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // drift
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacityDir * 0.003;
        if (p.opacity > 0.7 || p.opacity < 0.1) p.opacityDir *= -1;

        // wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color} / ${p.opacity})`;
        // glow
        ctx.shadowBlur = p.size * 6;
        ctx.shadowColor = `rgba(${p.color} / 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // subtle connecting lines for nearby pairs
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const alpha = (1 - dist / 100) * 0.08;
            ctx.strokeStyle = `rgba(${a.color} / ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ── Social icon map ───────────────────────────────────────────────────────────

function SocialIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    github: <Github size={18} />,
    linkedin: <Linkedin size={18} />,
    twitter: <Twitter size={18} />,
    email: <Mail size={18} />,
  };
  return icons[id] ?? null;
}

// ── Typing roles ──────────────────────────────────────────────────────────────

const ROLES = [
  "WordPress Developer",
  "Frontend Engineer",
  "Security Expert",
  "Performance Specialist",
];

// ── Variants ──────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9 } },
};

// ── Main Hero ─────────────────────────────────────────────────────────────────

export function Hero() {
  const { displayText } = useTypingEffect({
    words: ROLES,
    typeSpeed: 75,
    deleteSpeed: 40,
    pauseDuration: 2000,
  });

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollDown = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-ocid="section-hero"
    >
      {/* Particle background */}
      <ParticleCanvas />

      {/* Deep radial glow — centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 55%, oklch(0.72 0.22 210 / 0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 55% 45%, oklch(0.72 0.18 50 / 0.06) 0%, transparent 65%)",
        }}
      />

      {/* Animated floating ring — decorative */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 520,
          height: 520,
          borderRadius: "50%",
          border: "1px solid oklch(0.72 0.22 210 / 0.12)",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: "0 0 60px -20px oklch(0.72 0.22 210 / 0.2)",
        }}
        animate={{ scale: [1, 1.04, 1], rotate: [0, 6, 0] }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: "1px solid oklch(0.72 0.18 50 / 0.10)",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: [1, 1.06, 1], rotate: [0, -4, 0] }}
        transition={{
          duration: 11,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting badge */}
        <motion.p
          variants={fadeUp}
          className="font-mono text-sm uppercase tracking-[0.22em] text-muted-foreground mb-4"
        >
          <span className="inline-block w-8 h-px bg-primary/70 mr-3 align-middle" />
          Hello, World!
          <span className="inline-block w-8 h-px bg-accent/70 ml-3 align-middle" />
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={fadeUp}
          className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-4"
        >
          Hi, I&apos;m{" "}
          <span className="gradient-gold-cyan">Md Abdullah Hosen</span>
        </motion.h1>

        {/* Typing subtitle */}
        <motion.div
          variants={fadeUp}
          className="h-10 flex items-center justify-center mb-5"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="font-display text-xl md:text-2xl font-semibold text-muted-foreground">
            I&apos;m an{" "}
          </span>
          <span className="font-display text-xl md:text-2xl font-bold ml-2 text-foreground">
            {displayText}
            <span
              className="inline-block w-0.5 h-6 ml-0.5 align-middle"
              style={{
                background: "oklch(0.72 0.22 210)",
                animation: "blink 0.9s step-end infinite",
              }}
            />
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeIn}
          className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mb-9"
        >
          Partner with{" "}
          <span className="text-foreground font-medium">Md Abdullah Hosen</span>{" "}
          to take your digital presence to the next level!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <Button
            asChild
            size="lg"
            className="font-display font-semibold px-7 py-3 text-base"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.65 0.16 45))",
              color: "oklch(0.10 0.015 50)",
              boxShadow: "0 0 22px -4px oklch(0.72 0.18 50 / 0.45)",
            }}
            data-ocid="cta-download-cv"
          >
            <a href="/cv-md-abdullah-hosen.pdf" download>
              Download CV
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="font-display font-semibold px-7 py-3 text-base border-accent/50 text-accent hover:text-accent hover:bg-accent/10 transition-smooth"
            style={{ boxShadow: "0 0 18px -6px oklch(0.72 0.22 210 / 0.35)" }}
            onClick={scrollToContact}
            data-ocid="cta-contact"
          >
            Contact Me
          </Button>
        </motion.div>

        {/* Social icons */}
        <motion.div variants={fadeIn} className="flex items-center gap-5 mb-14">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/60 hover:shadow-[0_0_14px_-4px_oklch(0.72_0.18_50/0.5)] transition-smooth"
              data-ocid={`social-${s.id}`}
            >
              <SocialIcon id={s.id} />
            </a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          type="button"
          onClick={scrollDown}
          variants={fadeIn}
          className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-smooth cursor-pointer group"
          aria-label="Scroll to About section"
          data-ocid="scroll-indicator"
        >
          <span className="font-mono text-xs tracking-widest uppercase">
            Scroll Down
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="group-hover:text-primary transition-smooth"
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Blink cursor keyframe */}
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </section>
  );
}
