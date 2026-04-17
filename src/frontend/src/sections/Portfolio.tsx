import type { Project } from "@/services/staticService";
import { getProjects } from "@/services/staticService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const FILTERS = [
  "All",
  "WordPress",
  "Frontend",
  "Performance",
  "Security",
  "AI",
] as const;
type Filter = (typeof FILTERS)[number];

const CATEGORY_STYLES: Record<
  string,
  { gradient: string; accentColor: string; icon: string }
> = {
  WordPress: {
    gradient: "from-blue-950 via-blue-900/70 to-indigo-950",
    accentColor: "oklch(0.65 0.22 245)",
    icon: "🌐",
  },
  Frontend: {
    gradient: "from-purple-950 via-violet-900/70 to-fuchsia-950",
    accentColor: "oklch(0.65 0.22 300)",
    icon: "🎨",
  },
  Performance: {
    gradient: "from-orange-950 via-amber-900/70 to-yellow-950",
    accentColor: "oklch(0.72 0.18 50)",
    icon: "⚡",
  },
  Security: {
    gradient: "from-red-950 via-rose-900/70 to-pink-950",
    accentColor: "oklch(0.62 0.22 25)",
    icon: "🔒",
  },
  AI: {
    gradient: "from-teal-950 via-cyan-900/70 to-sky-950",
    accentColor: "oklch(0.72 0.22 210)",
    icon: "🤖",
  },
  default: {
    gradient: "from-slate-950 via-slate-900/70 to-zinc-950",
    accentColor: "oklch(0.65 0.10 240)",
    icon: "📁",
  },
};

function getStyle(category: string) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.default;
}

function useRevealItem(ref: React.RefObject<Element | null>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("revealed"), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);
}

// ─── Inline image with scroll-triggered fade ─────────────────────────────────
function InlineImage({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.97)",
        transition:
          "opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
        boxShadow: visible
          ? "0 8px 32px -8px rgba(0,0,0,0.5), 0 0 0 1px oklch(0.28 0.018 48)"
          : "none",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
        style={{ display: "block" }}
      />
    </div>
  );
}

// ─── Image Carousel (hero) ───────────────────────────────────────────────────
function ImageCarousel({ urls, title }: { urls: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  if (urls.length === 0) return null;
  const prev = () => setIdx((i) => (i - 1 + urls.length) % urls.length);
  const next = () => setIdx((i) => (i + 1) % urls.length);
  return (
    <div className="relative h-full w-full overflow-hidden">
      {urls.map((url, i) => (
        <img
          key={url}
          src={url}
          alt={`${title} screenshot ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
      {urls.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/70 flex items-center justify-center text-foreground text-xs hover:bg-background transition-smooth z-10"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/70 flex items-center justify-center text-foreground text-xs hover:bg-background transition-smooth z-10"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {urls.map((url, i) => (
              <button
                key={url}
                type="button"
                aria-label={`Image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                className="w-1.5 h-1.5 rounded-full transition-smooth"
                style={{
                  background:
                    i === idx ? "oklch(0.72 0.18 50)" : "oklch(0.40 0.01 55)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Inline image block (1 or 2 images side by side) ────────────────────────
function InlineImageBlock({
  images,
  title,
  startIndex,
}: {
  images: string[];
  title: string;
  startIndex: number;
}) {
  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="my-6">
        <InlineImage
          src={images[0]}
          alt={`${title} — image`}
          index={startIndex}
        />
      </div>
    );
  }
  return (
    <div className="my-6 grid grid-cols-2 gap-3">
      {images.map((src, i) => (
        <InlineImage
          key={src}
          src={src}
          alt={`${title} — image ${startIndex + i + 1}`}
          index={startIndex + i}
        />
      ))}
    </div>
  );
}

// ─── Premium case-study modal ────────────────────────────────────────────────
function PortfolioModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const style = getStyle(project.category);
  const num = String(Number(project.id)).padStart(2, "0");
  const images = project.imageUrls;
  const hasImages = images.length > 0;
  const isMulti = images.length > 1;
  const isRich = images.length >= 3;

  // Split description into paragraphs
  const rawParagraphs = project.description
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // If single block (no double newlines), split at ~midpoint for visual rhythm
  const paragraphs =
    rawParagraphs.length === 1 && project.description.length > 120
      ? (() => {
          const words = project.description.split(" ");
          const mid = Math.ceil(words.length / 2);
          return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
        })()
      : rawParagraphs;

  // For 3+ images: show hero carousel + scatter rest inline
  // For 2 images: show first as hero, second inline after text
  // For 1 image: hero only, no inline
  const heroImages = isRich ? images.slice(0, 2) : hasImages ? [images[0]] : [];
  const inlineImages = isRich ? images.slice(2) : isMulti ? [images[1]] : [];

  // Distribute inline images between paragraphs
  // Strategy: insert first batch after paragraph 0, remaining after last paragraph
  const inlineFirst = inlineImages.slice(0, 2);
  const inlineLast = inlineImages.slice(2);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)" }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
      role="presentation"
      data-ocid="modal-backdrop"
    >
      <dialog
        open
        aria-label={project.title}
        className="relative bg-card rounded-2xl border border-border/50 w-full max-w-2xl overflow-hidden p-0 flex flex-col"
        style={{
          maxHeight: "90vh",
          animation:
            "slide-up 0.38s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
          boxShadow:
            "0 32px 80px -16px rgba(0,0,0,0.7), 0 0 0 1px oklch(0.28 0.018 48)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="modal-content"
      >
        {/* ── Hero image / carousel ───────────────────────────────────── */}
        {heroImages.length > 0 ? (
          <div
            className="relative shrink-0"
            style={{ height: isRich ? "260px" : "220px" }}
          >
            <ImageCarousel urls={heroImages} title={project.title} />
            {/* Gradient overlay bottom fade */}
            <div
              className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, oklch(0.15 0.016 48), transparent)",
              }}
            />
            {/* Category label on image */}
            <div className="absolute top-3 left-3 z-10">
              <span
                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-sm"
                style={{
                  color: style.accentColor,
                  borderColor: `${style.accentColor}55`,
                  background: "oklch(0.08 0.01 48 / 0.75)",
                }}
              >
                {project.category}
              </span>
            </div>
          </div>
        ) : (
          <div
            className={`relative h-44 shrink-0 bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden`}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                color: style.accentColor,
              }}
            />
            <span className="text-5xl relative z-10">{style.icon}</span>
            <span
              className="absolute top-4 right-5 font-display font-bold text-3xl opacity-20 select-none"
              style={{ color: style.accentColor }}
            >
              {num}
            </span>
          </div>
        )}

        {/* ── Scrollable body ─────────────────────────────────────────── */}
        <div className="overflow-y-auto scrollbar-thin flex-1">
          <div className="p-6 pb-4">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="min-w-0">
                <div
                  className="text-xs font-accent uppercase tracking-widest mb-1"
                  style={{ color: style.accentColor }}
                >
                  Case Study · #{num}
                </div>
                <h3 className="font-display font-bold text-xl lg:text-2xl text-foreground leading-snug tracking-tight">
                  {project.title}
                </h3>
              </div>
              {/* Small decorative accent line */}
              <div
                className="shrink-0 w-10 h-0.5 mt-4 rounded-full"
                style={{ background: style.accentColor }}
              />
            </div>

            {/* ── Rich inline content layout ───────────────────────────── */}
            <div className="space-y-0">
              {paragraphs.map((para, i) => (
                <div key={`para-${i}-${para.slice(0, 12)}`}>
                  {/* Paragraph */}
                  <p className="text-muted-foreground text-sm lg:text-base leading-[1.75] mb-4 font-body">
                    {para}
                  </p>

                  {/* After first paragraph: inject first batch of inline images */}
                  {i === 0 && inlineFirst.length > 0 && (
                    <InlineImageBlock
                      images={inlineFirst}
                      title={project.title}
                      startIndex={0}
                    />
                  )}

                  {/* For 2-image projects: inject second image after first para */}
                  {i === 0 && !isRich && isMulti && inlineImages.length > 0 && (
                    <div className="my-5">
                      {/* Decorative label */}
                      <div
                        className="flex items-center gap-2 mb-3"
                        style={{ color: style.accentColor }}
                      >
                        <div
                          className="h-px flex-1 opacity-30"
                          style={{ background: style.accentColor }}
                        />
                        <span className="text-[9px] font-mono uppercase tracking-widest opacity-60">
                          Project Preview
                        </span>
                        <div
                          className="h-px flex-1 opacity-30"
                          style={{ background: style.accentColor }}
                        />
                      </div>
                      <InlineImage
                        src={inlineImages[0]}
                        alt={`${project.title} — detail view`}
                        index={1}
                      />
                    </div>
                  )}

                  {/* After last paragraph: remaining inline images */}
                  {i === paragraphs.length - 1 && inlineLast.length > 0 && (
                    <div className="mt-5">
                      <div
                        className="flex items-center gap-2 mb-4"
                        style={{ color: style.accentColor }}
                      >
                        <div
                          className="h-px flex-1 opacity-30"
                          style={{ background: style.accentColor }}
                        />
                        <span className="text-[9px] font-mono uppercase tracking-widest opacity-60">
                          More Views
                        </span>
                        <div
                          className="h-px flex-1 opacity-30"
                          style={{ background: style.accentColor }}
                        />
                      </div>
                      <InlineImageBlock
                        images={inlineLast}
                        title={project.title}
                        startIndex={inlineFirst.length}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Image count badge (if multi) ─────────────────────────── */}
            {isMulti && (
              <div className="flex items-center gap-2 mt-4 mb-2">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border"
                  style={{
                    color: style.accentColor,
                    borderColor: `${style.accentColor}40`,
                    background: `${style.accentColor}0d`,
                  }}
                >
                  <span>◉</span>
                  {images.length} images
                </span>
              </div>
            )}
          </div>

          {/* ── Footer action ─────────────────────────────────────────── */}
          <div className="px-6 pb-6 pt-2">
            <button
              type="button"
              className="w-full py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-foreground border border-border/40 hover:bg-secondary/60 hover:border-border/70 transition-smooth"
              onClick={onClose}
              data-ocid="modal-close"
            >
              Close
            </button>
          </div>
        </div>

        {/* ── X close button ────────────────────────────────────────── */}
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-smooth z-20"
          data-ocid="modal-x"
        >
          ✕
        </button>
      </dialog>
    </div>
  );
}

// ─── Skeleton card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/30 bg-card animate-pulse">
      <div className="h-44 bg-secondary/40" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between gap-3">
          <div className="h-4 bg-secondary/50 rounded w-3/5" />
          <div className="h-4 bg-secondary/30 rounded-full w-16" />
        </div>
        <div className="h-3 bg-secondary/30 rounded w-full" />
        <div className="h-3 bg-secondary/20 rounded w-4/5" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 bg-secondary/30 rounded w-14" />
          <div className="h-5 bg-secondary/20 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio card ──────────────────────────────────────────────────────────
function PortfolioCard({
  project,
  delay,
  visible,
  onOpen,
}: {
  project: Project;
  delay: number;
  visible: boolean;
  onOpen: (p: Project) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useRevealItem(ref as React.RefObject<Element>, delay);
  const style = getStyle(project.category);
  const num = String(Number(project.id)).padStart(2, "0");

  const visClass = visible
    ? "opacity-100 scale-100 pointer-events-auto max-h-[600px]"
    : "opacity-0 scale-95 pointer-events-none max-h-0 overflow-hidden";

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={`reveal-fade-up group relative rounded-2xl overflow-hidden border border-border/40 bg-card cursor-pointer shadow-elevated transition-all duration-400 text-left w-full ${visClass}`}
      onClick={() => onOpen(project)}
      data-ocid={`portfolio-card-${project.id}`}
    >
      <div
        className={`relative h-44 bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden`}
      >
        {project.imageUrls.length > 0 ? (
          <img
            src={project.imageUrls[0]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                color: style.accentColor,
              }}
            />
            <span className="text-4xl relative z-10 group-hover:scale-110 transition-smooth select-none">
              {style.icon}
            </span>
            <span
              className="absolute top-4 right-5 font-display font-bold text-3xl opacity-20 select-none"
              style={{ color: style.accentColor }}
            >
              {num}
            </span>
          </>
        )}
        {/* Multi-image indicator */}
        {project.imageUrls.length > 1 && (
          <div
            className="absolute top-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm"
            style={{
              background: "oklch(0.08 0.01 48 / 0.75)",
              color: style.accentColor,
              border: `1px solid ${style.accentColor}44`,
            }}
          >
            {project.imageUrls.length} ◉
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/88 to-transparent">
          <span
            className="mt-2 text-xs font-mono uppercase tracking-widest"
            style={{ color: style.accentColor }}
          >
            View Case Study →
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display font-semibold text-base lg:text-lg text-foreground leading-snug min-w-0 truncate tracking-tight">
            {project.title}
          </h3>
          <span
            className="text-[10px] lg:text-xs font-accent uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0"
            style={{
              color: style.accentColor,
              borderColor: `${style.accentColor}44`,
            }}
          >
            {project.category}
          </span>
        </div>
        <p className="text-muted-foreground text-sm lg:text-base leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>
    </button>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export function Portfolio() {
  const [active, setActive] = useState<Filter>("All");
  const [modal, setModal] = useState<Project | null>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  useRevealItem(headingRef as React.RefObject<Element>, 0);
  useRevealItem(filtersRef as React.RefObject<Element>, 120);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  const items = projects ?? [];
  const filtered =
    active === "All" ? items : items.filter((p) => p.category === active);
  const showSkeleton = isLoading;

  return (
    <section
      id="portfolio"
      className="section-pad border-b border-border/30"
      data-ocid="section-portfolio"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="reveal-fade-up mb-10">
          <span className="inline-block px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs lg:text-sm font-accent font-semibold uppercase tracking-widest mb-3">
            My Work
          </span>
          <h2 className="section-heading text-foreground">Portfolio</h2>
          <p className="section-subheading">
            A selection of my best projects across specializations
          </p>
        </div>

        {/* Filter tabs */}
        <div
          ref={filtersRef}
          className="reveal-fade-up flex flex-wrap gap-2 mb-10"
          data-ocid="portfolio-filters"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              data-ocid={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
              className={[
                "px-4 py-1.5 rounded-full font-accent text-sm lg:text-base uppercase tracking-wider transition-smooth border",
                active === f
                  ? "bg-primary border-primary text-background shadow-gold-glow"
                  : "bg-card border-border/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"].map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-border/30"
            style={{ background: "oklch(0.12 0.014 48)" }}
            data-ocid="portfolio-empty"
          >
            <span className="text-4xl mb-4">🚀</span>
            <p className="font-display font-semibold text-lg lg:text-xl text-foreground mb-2 tracking-tight">
              {active === "All"
                ? "Projects Coming Soon"
                : `No ${active} projects yet`}
            </p>
            <p className="text-muted-foreground text-sm lg:text-base max-w-xs">
              {active === "All"
                ? "New projects are being added via the admin panel."
                : `Switch to 'All' to see other categories or check back soon.`}
            </p>
            {active !== "All" && (
              <button
                type="button"
                onClick={() => setActive("All")}
                className="mt-5 px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider border border-primary/40 text-primary hover:bg-primary/10 transition-smooth"
                data-ocid="portfolio-empty-reset"
              >
                Show All
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <PortfolioCard
                key={String(project.id)}
                project={project}
                delay={i * 80}
                visible={true}
                onOpen={setModal}
              />
            ))}
          </div>
        )}

        {modal && (
          <PortfolioModal project={modal} onClose={() => setModal(null)} />
        )}
      </div>
    </section>
  );
}
