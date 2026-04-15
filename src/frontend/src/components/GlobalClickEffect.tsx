import { useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type EffectStyle = 1 | 2 | 3 | 4 | 5;

interface BaseEffect {
  style: EffectStyle;
  x: number;
  y: number;
  age: number; // frames elapsed
  done: boolean;
}

interface StarBurstEffect extends BaseEffect {
  style: 1;
  particles: {
    angle: number;
    dist: number;
    maxDist: number;
    color: string;
    size: number;
    alpha: number;
  }[];
}

interface RingExpandEffect extends BaseEffect {
  style: 2;
  rings: { radius: number; maxRadius: number; alpha: number; color: string }[];
}

interface FireworkEffect extends BaseEffect {
  style: 3;
  dots: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
    size: number;
  }[];
}

interface HeartSparkleEffect extends BaseEffect {
  style: 4;
  hearts: {
    x: number;
    y: number;
    vy: number;
    alpha: number;
    color: string;
    size: number;
    rotation: number;
  }[];
}

interface DiamondRainEffect extends BaseEffect {
  style: 5;
  diamonds: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotSpeed: number;
    alpha: number;
    color: string;
    size: number;
  }[];
}

type ClickEffect =
  | StarBurstEffect
  | RingExpandEffect
  | FireworkEffect
  | HeartSparkleEffect
  | DiamondRainEffect;

// ── Color palette ─────────────────────────────────────────────────────────────
const COLORS = [
  "#FFD700",
  "#00FFFF",
  "#FF69B4",
  "#AA44FF",
  "#FFFFFF",
  "#44FF88",
  "#FF8844",
];
let colorIdx = 0;
function nextColor() {
  const c = COLORS[colorIdx % COLORS.length];
  colorIdx++;
  return c;
}

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// ── Draw a 5-pointed star ─────────────────────────────────────────────────────
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
) {
  const innerR = outerR * 0.4;
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

// ── Draw a heart shape ────────────────────────────────────────────────────────
function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
) {
  const s = size;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.3);
  ctx.bezierCurveTo(
    cx - s * 0.1,
    cy - s * 0.1,
    cx - s * 0.6,
    cy - s * 0.1,
    cx - s * 0.5,
    cy + s * 0.35,
  );
  ctx.bezierCurveTo(
    cx - s * 0.4,
    cy + s * 0.7,
    cx,
    cy + s * 0.9,
    cx,
    cy + s * 0.3,
  );
  ctx.moveTo(cx, cy + s * 0.3);
  ctx.bezierCurveTo(
    cx + s * 0.1,
    cy - s * 0.1,
    cx + s * 0.6,
    cy - s * 0.1,
    cx + s * 0.5,
    cy + s * 0.35,
  );
  ctx.bezierCurveTo(
    cx + s * 0.4,
    cy + s * 0.7,
    cx,
    cy + s * 0.9,
    cx,
    cy + s * 0.3,
  );
  ctx.closePath();
}

// ── Draw a diamond/rotated square ─────────────────────────────────────────────
function drawDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size * 0.6, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size * 0.6, cy);
  ctx.closePath();
}

// ── Effect factories ──────────────────────────────────────────────────────────
function createStarBurst(x: number, y: number): StarBurstEffect {
  const count = Math.floor(rnd(8, 13));
  const baseColor = nextColor();
  return {
    style: 1,
    x,
    y,
    age: 0,
    done: false,
    particles: Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + rnd(-0.2, 0.2),
      dist: 0,
      maxDist: rnd(40, 90),
      color: COLORS[Math.floor(Math.random() * COLORS.length)] || baseColor,
      size: rnd(4, 9),
      alpha: 1,
    })),
  };
}

function createRingExpand(x: number, y: number): RingExpandEffect {
  return {
    style: 2,
    x,
    y,
    age: 0,
    done: false,
    rings: [
      { radius: 0, maxRadius: rnd(50, 90), alpha: 1, color: nextColor() },
      { radius: 0, maxRadius: rnd(30, 60), alpha: 0.7, color: nextColor() },
      { radius: 0, maxRadius: rnd(20, 40), alpha: 0.5, color: nextColor() },
    ],
  };
}

function createFirework(x: number, y: number): FireworkEffect {
  const count = Math.floor(rnd(15, 22));
  return {
    style: 3,
    x,
    y,
    age: 0,
    done: false,
    dots: Array.from({ length: count }, () => {
      const angle = rnd(0, Math.PI * 2);
      const speed = rnd(2, 7);
      return {
        x,
        y,
        vx: Math.cos(angle) * speed * rnd(0.4, 1.0),
        vy: Math.sin(angle) * speed * rnd(0.5, 1.2) - rnd(1, 4),
        alpha: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: rnd(2, 5),
      };
    }),
  };
}

function createHeartSparkle(x: number, y: number): HeartSparkleEffect {
  const count = Math.floor(rnd(6, 10));
  return {
    style: 4,
    x,
    y,
    age: 0,
    done: false,
    hearts: Array.from({ length: count }, () => ({
      x: x + rnd(-30, 30),
      y: y + rnd(-10, 10),
      vy: rnd(-1.5, -3.5),
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: rnd(5, 12),
      rotation: rnd(0, Math.PI * 2),
    })),
  };
}

function createDiamondRain(x: number, y: number): DiamondRainEffect {
  const count = Math.floor(rnd(10, 16));
  return {
    style: 5,
    x,
    y,
    age: 0,
    done: false,
    diamonds: Array.from({ length: count }, () => {
      const angle = rnd(0, Math.PI * 2);
      const speed = rnd(2, 6);
      return {
        x: x + rnd(-20, 20),
        y: y + rnd(-20, 20),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rnd(0, 2),
        rotation: rnd(0, Math.PI),
        rotSpeed: rnd(-0.12, 0.12),
        alpha: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: rnd(4, 9),
      };
    }),
  };
}

// ── Update + draw helpers ─────────────────────────────────────────────────────

function updateDrawStarBurst(
  ctx: CanvasRenderingContext2D,
  ef: StarBurstEffect,
): boolean {
  ef.age++;
  let allDone = true;
  for (const p of ef.particles) {
    p.dist += (p.maxDist - p.dist) * 0.14 + 1;
    p.alpha = Math.max(0, 1 - ef.age / 40);
    if (p.alpha > 0.02) allDone = false;
    const px = ef.x + Math.cos(p.angle) * p.dist;
    const py = ef.y + Math.sin(p.angle) * p.dist;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    drawStar(ctx, px, py, p.size * (1 - ef.age / 50));
    ctx.fill();
    ctx.restore();
  }
  return allDone;
}

function updateDrawRingExpand(
  ctx: CanvasRenderingContext2D,
  ef: RingExpandEffect,
): boolean {
  ef.age++;
  let allDone = true;
  for (const ring of ef.rings) {
    ring.radius += (ring.maxRadius - ring.radius) * 0.1 + 0.8;
    ring.alpha = Math.max(0, 1 - ef.age / 35);
    if (ring.alpha > 0.02) allDone = false;
    ctx.save();
    ctx.globalAlpha = ring.alpha;
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = ring.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(ef.x, ef.y, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  return allDone;
}

function updateDrawFirework(
  ctx: CanvasRenderingContext2D,
  ef: FireworkEffect,
): boolean {
  ef.age++;
  let allDone = true;
  for (const d of ef.dots) {
    d.x += d.vx;
    d.y += d.vy;
    d.vy += 0.18; // gravity
    d.vx *= 0.97;
    d.alpha = Math.max(0, 1 - ef.age / 50);
    if (d.alpha > 0.02) allDone = false;
    ctx.save();
    ctx.globalAlpha = d.alpha;
    ctx.fillStyle = d.color;
    ctx.shadowColor = d.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  return allDone;
}

function updateDrawHeartSparkle(
  ctx: CanvasRenderingContext2D,
  ef: HeartSparkleEffect,
): boolean {
  ef.age++;
  let allDone = true;
  for (const h of ef.hearts) {
    h.y += h.vy;
    h.vy *= 0.97;
    h.rotation += 0.04;
    h.alpha = Math.max(0, 1 - ef.age / 45);
    if (h.alpha > 0.02) allDone = false;
    ctx.save();
    ctx.globalAlpha = h.alpha;
    ctx.fillStyle = h.color;
    ctx.shadowColor = h.color;
    ctx.shadowBlur = 10;
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rotation);
    drawHeart(ctx, 0, 0, h.size);
    ctx.fill();
    ctx.restore();
  }
  return allDone;
}

function updateDrawDiamondRain(
  ctx: CanvasRenderingContext2D,
  ef: DiamondRainEffect,
): boolean {
  ef.age++;
  let allDone = true;
  for (const d of ef.diamonds) {
    d.x += d.vx;
    d.y += d.vy;
    d.vy += 0.15;
    d.vx *= 0.98;
    d.rotation += d.rotSpeed;
    d.alpha = Math.max(0, 1 - ef.age / 50);
    if (d.alpha > 0.02) allDone = false;
    ctx.save();
    ctx.globalAlpha = d.alpha;
    ctx.fillStyle = d.color;
    ctx.shadowColor = d.color;
    ctx.shadowBlur = 8;
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rotation);
    drawDiamond(ctx, 0, 0, d.size);
    ctx.fill();
    ctx.restore();
  }
  return allDone;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function GlobalClickEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectsRef = useRef<ClickEffect[]>([]);
  const rafRef = useRef<number>(0);
  const isRunning = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to full viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Draw loop — only runs when there are active effects
    function loop() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const effects = effectsRef.current;
      for (const ef of effects) {
        if (ef.done) continue;
        let done = false;
        if (ef.style === 1)
          done = updateDrawStarBurst(ctx!, ef as StarBurstEffect);
        else if (ef.style === 2)
          done = updateDrawRingExpand(ctx!, ef as RingExpandEffect);
        else if (ef.style === 3)
          done = updateDrawFirework(ctx!, ef as FireworkEffect);
        else if (ef.style === 4)
          done = updateDrawHeartSparkle(ctx!, ef as HeartSparkleEffect);
        else if (ef.style === 5)
          done = updateDrawDiamondRain(ctx!, ef as DiamondRainEffect);
        if (done) ef.done = true;
      }

      // Remove completed effects (keep array lean)
      effectsRef.current = effects.filter((e) => !e.done);

      if (effectsRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        isRunning.current = false;
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      }
    }

    const handleClick = (e: MouseEvent) => {
      const style = (Math.floor(Math.random() * 5) + 1) as EffectStyle;
      let ef: ClickEffect;
      const cx = e.clientX;
      const cy = e.clientY;
      if (style === 1) ef = createStarBurst(cx, cy);
      else if (style === 2) ef = createRingExpand(cx, cy);
      else if (style === 3) ef = createFirework(cx, cy);
      else if (style === 4) ef = createHeartSparkle(cx, cy);
      else ef = createDiamondRain(cx, cy);

      effectsRef.current.push(ef);

      // Start loop only if not already running
      if (!isRunning.current) {
        isRunning.current = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 100 }}
      tabIndex={-1}
    />
  );
}
