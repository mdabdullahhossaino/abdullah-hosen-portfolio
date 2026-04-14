import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const FILTERS = [
  "All",
  "WordPress",
  "Frontend",
  "Security",
  "Performance",
  "AI Automation",
] as const;
type Filter = (typeof FILTERS)[number];

interface PortfolioItem {
  id: number;
  title: string;
  category: Filter;
  description: string;
  tech: string[];
  gradient: string;
  accentColor: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: "E-Commerce WordPress Site",
    category: "WordPress",
    description:
      "Full-featured WooCommerce store with custom product configurator, payment gateway integration, and mobile-first design achieving 98 Lighthouse scores.",
    tech: ["WordPress", "WooCommerce", "PHP", "ACF"],
    gradient: "from-amber-900/60 via-yellow-800/40 to-orange-900/60",
    accentColor: "#c9a84c",
  },
  {
    id: 2,
    title: "Corporate Landing Page",
    category: "Frontend",
    description:
      "High-converting corporate site with scroll-triggered animations, custom CSS art direction, and A/B tested CTA placements boosting conversions by 40%.",
    tech: ["HTML", "CSS", "JavaScript", "GSAP"],
    gradient: "from-cyan-900/60 via-sky-800/40 to-blue-900/60",
    accentColor: "#0ea5e9",
  },
  {
    id: 3,
    title: "Malware Removal & Cleanup",
    category: "Security",
    description:
      "Complete malware remediation for a compromised WooCommerce store — removed backdoors, hardened wp-config, added WAF rules, and restored clean backup.",
    tech: ["Wordfence", "Sucuri", "SSH", "WP-CLI"],
    gradient: "from-red-900/60 via-rose-800/40 to-pink-900/60",
    accentColor: "#f43f5e",
  },
  {
    id: 4,
    title: "Speed Optimization Project",
    category: "Performance",
    description:
      "Reduced TTFB from 3.2s to 0.4s via server-side caching, image CDN pipeline, critical CSS inlining, and lazy-loading strategy on a 10k-page WordPress site.",
    tech: ["Redis", "Cloudflare", "WebP", "LCP Audit"],
    gradient: "from-green-900/60 via-emerald-800/40 to-teal-900/60",
    accentColor: "#10b981",
  },
  {
    id: 5,
    title: "Custom Theme Development",
    category: "WordPress",
    description:
      "Bespoke block-based WordPress theme built with Full Site Editing, custom block patterns, and a design system that non-developers can update without breaking layouts.",
    tech: ["WordPress FSE", "PHP", "React", "Block API"],
    gradient: "from-violet-900/60 via-purple-800/40 to-fuchsia-900/60",
    accentColor: "#a78bfa",
  },
  {
    id: 6,
    title: "AI-Powered Business Workflow",
    category: "AI Automation",
    description:
      "Integrated OpenAI APIs with Make.com to automate lead qualification, email follow-up sequences, and weekly reporting — saving 20+ hours per week.",
    tech: ["OpenAI API", "Make.com", "Zapier", "Webhooks"],
    gradient: "from-indigo-900/60 via-blue-800/40 to-cyan-900/60",
    accentColor: "#818cf8",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

export function Portfolio() {
  const [active, setActive] = useState<Filter>("All");

  const filtered =
    active === "All"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === active);

  return (
    <section
      id="portfolio"
      className="section-pad border-b border-border/30"
      data-ocid="section-portfolio"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mb-2">
          {"// Featured Work"}
        </p>
        <h2 className="section-heading gradient-gold-cyan inline-block">
          My Portfolio
        </h2>
        <p className="section-subheading max-w-lg">
          A curated selection of projects spanning WordPress, frontend
          engineering, security, and performance optimization.
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-10"
        data-ocid="portfolio-filters"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            data-ocid={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
            className={[
              "px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-smooth border",
              active === f
                ? "bg-primary/20 border-primary/60 text-primary shadow-[0_0_12px_-4px_oklch(var(--primary)/0.6)]"
                : "bg-card border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      layout
      whileHover={{ scale: 1.02 }}
      transition={{ layout: { duration: 0.35, type: "spring" } }}
      className="relative rounded-xl overflow-hidden border border-border/40 bg-card cursor-pointer group shadow-elevated"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: hovered ? `${item.accentColor}55` : undefined,
        boxShadow: hovered
          ? `0 0 24px -8px ${item.accentColor}66, 0 20px 40px -10px rgba(0,0,0,0.4)`
          : undefined,
      }}
      data-ocid={`portfolio-card-${item.id}`}
    >
      {/* Gradient image area */}
      <div
        className={`relative h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center overflow-hidden`}
      >
        {/* Decorative dots */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, ${item.accentColor}40 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <span
          className="font-display font-bold text-4xl opacity-30 select-none"
          style={{ color: item.accentColor }}
        >
          {item.id.toString().padStart(2, "0")}
        </span>

        {/* Hover overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex flex-col justify-end p-5"
          style={{
            background: `linear-gradient(to top, ${item.accentColor}cc 0%, transparent 100%)`,
          }}
        >
          <p className="text-white text-sm leading-relaxed line-clamp-3">
            {item.description}
          </p>
          <button
            type="button"
            className="mt-3 flex items-center gap-1.5 text-white text-xs font-mono uppercase tracking-wider opacity-90 hover:opacity-100 transition-smooth w-fit"
            data-ocid={`view-project-${item.id}`}
          >
            View Project <ExternalLink size={12} />
          </button>
        </motion.div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-semibold text-base text-foreground leading-tight">
            {item.title}
          </h3>
          <Badge
            variant="outline"
            className="text-[10px] font-mono uppercase tracking-wider shrink-0 border-border/50"
            style={{
              color: item.accentColor,
              borderColor: `${item.accentColor}44`,
            }}
          >
            {item.category}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {item.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded bg-secondary/60 text-muted-foreground text-[10px] font-mono"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
