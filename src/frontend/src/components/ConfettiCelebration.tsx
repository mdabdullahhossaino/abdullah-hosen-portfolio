import { useEffect, useRef } from "react";

const SESSION_KEY = "confetti_shown";

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const STAR_COLORS = [
  "#FFD700",
  "#00FFFF",
  "#FFFFFF",
  "#FF69B4",
  "#AA44FF",
  "#44FF88",
  "#FF8844",
];
const LEAF_COLORS = [
  "#FFD700",
  "#44FF88",
  "#FF69B4",
  "#00FFFF",
  "#AA44FF",
  "#FF8844",
];

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawStickFigure(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  alpha: number,
  facingLeft: boolean,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  const dir = facingLeft ? -1 : 1;
  const headR = 11;
  const bodyLen = 30;
  const armLen = 22;
  const legLen = 24;

  ctx.beginPath();
  ctx.arc(x, y - bodyLen - headR, headR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - bodyLen);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - bodyLen + 6);
  ctx.lineTo(x + dir * armLen * 0.6, y - bodyLen - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - bodyLen + 6);
  ctx.lineTo(x - dir * armLen * 0.7, y - bodyLen + 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dir * legLen * 0.4, y + legLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - dir * legLen * 0.3, y + legLen);
  ctx.stroke();

  ctx.restore();
}

function drawPartyHorn(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number,
  dir: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const hornColor = dir > 0 ? "#FFD700" : "#00FFFF";
  ctx.strokeStyle = hornColor;
  ctx.fillStyle = hornColor;
  ctx.lineWidth = 2.5;

  const tipX = x + dir * 10;
  const tipY = y - 4;
  const baseX = x + dir * 45;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(baseX, tipY - 7);
  ctx.lineTo(baseX, tipY + 7);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

interface FallingParticle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  phase: number;
  phaseSpeed: number;
  swayAmp: number;
  color: string;
  size: number;
  type: "star" | "leaf";
  rotation: number;
  rotSpeed: number;
  alpha: number;
}

interface SparkleRay {
  angle: number;
  length: number;
  maxLength: number;
  color: string;
  alpha: number;
}

interface SparkleEmitter {
  x: number;
  y: number;
  rays: SparkleRay[];
  progress: number;
  done: boolean;
}

function drawFallingStar(ctx: CanvasRenderingContext2D, p: FallingParticle) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 6;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  drawStar(ctx, 0, 0, p.size, p.size * 0.4);
  ctx.fill();
  ctx.restore();
}

function drawFallingLeaf(ctx: CanvasRenderingContext2D, p: FallingParticle) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 4;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEmitter(ctx: CanvasRenderingContext2D, em: SparkleEmitter) {
  em.progress = Math.min(em.progress + 0.022, 1);
  let allDone = true;
  for (const ray of em.rays) {
    ray.length = em.progress * ray.maxLength;
    ray.alpha =
      em.progress < 0.5 ? em.progress * 2 : 1 - (em.progress - 0.5) * 2;
    if (ray.alpha > 0.01) allDone = false;

    const ex = em.x + Math.cos(ray.angle) * ray.length;
    const ey = em.y + Math.sin(ray.angle) * ray.length;

    ctx.save();
    ctx.globalAlpha = ray.alpha * 0.6;
    ctx.strokeStyle = ray.color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = ray.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(em.x, em.y);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = ray.alpha;
    ctx.fillStyle = ray.color;
    ctx.shadowColor = ray.color;
    ctx.shadowBlur = 10;
    drawStar(ctx, ex, ey, 5 * (1 - em.progress * 0.4), 2);
    ctx.fill();
    ctx.restore();
  }
  if (allDone) em.done = true;
}

function createEmitter(
  emitters: SparkleEmitter[],
  ex: number,
  ey: number,
  rayCount: number,
  maxLen: number,
) {
  const rays: SparkleRay[] = [];
  for (let i = 0; i < rayCount; i++) {
    rays.push({
      angle: (i / rayCount) * Math.PI * 2 + rnd(-0.15, 0.15),
      length: 0,
      maxLength: maxLen * rnd(0.6, 1.4),
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      alpha: 1,
    });
  }
  emitters.push({ x: ex, y: ey, rays, progress: 0, done: false });
}

function createFallingParticles(W: number): FallingParticle[] {
  const out: FallingParticle[] = [];
  for (let i = 0; i < 55; i++) {
    const type: "star" | "leaf" = Math.random() > 0.5 ? "star" : "leaf";
    const colorArr = type === "star" ? STAR_COLORS : LEAF_COLORS;
    out.push({
      x: rnd(0, W),
      y: rnd(-60, -10),
      vy: rnd(1.2, 3.5),
      vx: rnd(-0.5, 0.5),
      phase: rnd(0, Math.PI * 2),
      phaseSpeed: rnd(0.025, 0.06),
      swayAmp: rnd(0.6, 1.8),
      color: colorArr[Math.floor(Math.random() * colorArr.length)],
      size: type === "star" ? rnd(3, 6) : rnd(4, 8),
      type,
      rotation: rnd(0, Math.PI * 2),
      rotSpeed: rnd(-0.05, 0.05),
      alpha: rnd(0.7, 1.0),
    });
  }
  return out;
}

export function ConfettiCelebration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    // Assign to a const typed as non-null so TypeScript is happy inside closures
    const c: CanvasRenderingContext2D = ctxRaw;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width;
    const H = canvas.height;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      container.style.display = "none";
      return;
    }

    const DURATION = 5000;
    const FADE_START = 4500;
    let startTime: number | null = null;
    let rafId = 0;

    const centerX = W / 2;
    const figureY = H * 0.72;
    const leftTargetX = centerX - 55;
    const rightTargetX = centerX + 55;

    const emitters: SparkleEmitter[] = [];
    let emittersCreated = false;

    let falling: FallingParticle[] = [];
    let fallingCreated = false;

    function tick(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = elapsed / 1000;

      c.clearRect(0, 0, W, H);

      // Stick figures
      const slideT = Math.min(t / 0.8, 1);
      const eased = slideT < 1 ? 1 - (1 - slideT) ** 3 : 1;
      const leftX = -100 + (leftTargetX - -100) * eased;
      const rightX = W + 100 + (rightTargetX - (W + 100)) * eased;
      const figAlpha = t > 2.5 ? Math.max(0, 1 - (t - 2.5) / 0.8) : 1;

      drawStickFigure(c, leftX, figureY, "#FFD700", figAlpha, false);
      drawStickFigure(c, rightX, figureY, "#00FFFF", figAlpha, true);

      // Party horns (0.9s – 2.5s)
      if (t >= 0.9 && t < 2.5) {
        const hornAlpha =
          t < 1.1
            ? (t - 0.9) / 0.2
            : t > 2.2
              ? Math.max(0, 1 - (t - 2.2) / 0.3)
              : 1;
        drawPartyHorn(c, leftX, figureY - 58, hornAlpha, 1);
        drawPartyHorn(c, rightX, figureY - 58, hornAlpha, -1);
      }

      // Create sparkle emitters at 1.0s
      if (t >= 1.0 && !emittersCreated) {
        emittersCreated = true;
        createEmitter(emitters, centerX, H * 0.5, 24, 140);
        createEmitter(emitters, 0, 0, 14, 180);
        createEmitter(emitters, W, 0, 14, 180);
        createEmitter(emitters, 0, H, 14, 180);
        createEmitter(emitters, W, H, 14, 180);
        createEmitter(emitters, W * 0.3, H * 0.3, 16, 120);
        createEmitter(emitters, W * 0.7, H * 0.3, 16, 120);
        createEmitter(emitters, W * 0.3, H * 0.7, 12, 100);
        createEmitter(emitters, W * 0.7, H * 0.7, 12, 100);
      }

      // Draw emitters
      for (const em of emitters) {
        if (!em.done) drawEmitter(c, em);
      }

      // Create falling particles at 1.0s
      if (t >= 1.0 && !fallingCreated) {
        fallingCreated = true;
        falling = createFallingParticles(W);
      }

      // Draw falling particles
      const globalFade =
        t > FADE_START / 1000
          ? Math.max(0, 1 - (t - FADE_START / 1000) / 0.5)
          : 1;
      for (const p of falling) {
        p.phase += p.phaseSpeed;
        p.x += p.vx + Math.sin(p.phase) * p.swayAmp;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha = Math.min(p.alpha, globalFade);
        if (p.y > H + 20) continue;
        if (p.type === "star") drawFallingStar(c, p);
        else drawFallingLeaf(c, p);
      }

      // Twinkling ambient stars
      if (t >= 1.0 && t < 4.5) {
        for (let i = 0; i < 18; i++) {
          const tx = (i * 137.508 + t * 15) % W;
          const ty = (i * 91.3 + Math.sin(i + t * 0.5) * 80 + H * 0.5) % H;
          const ta = ((Math.sin(t * 3 + i * 1.2) + 1) / 2) * 0.7 * globalFade;
          const ts = rnd(2, 5);
          c.save();
          c.globalAlpha = ta;
          c.fillStyle = STAR_COLORS[i % STAR_COLORS.length];
          c.shadowColor = STAR_COLORS[i % STAR_COLORS.length];
          c.shadowBlur = 8;
          drawStar(c, tx, ty, ts, ts * 0.4);
          c.fill();
          c.restore();
        }
      }

      // Fade out container from FADE_START
      if (elapsed > FADE_START && container) {
        const fp = Math.min((elapsed - FADE_START) / 500, 1);
        container.style.opacity = String(1 - fp);
      }

      if (elapsed < DURATION) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (container) {
          container.style.transition = "opacity 0.5s ease";
          container.style.opacity = "0";
          setTimeout(() => {
            container.style.display = "none";
          }, 500);
        }
      }
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
