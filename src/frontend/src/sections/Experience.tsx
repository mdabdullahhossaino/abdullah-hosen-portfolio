import { Briefcase, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

interface TimelineItem {
  id: number;
  title: string;
  org: string;
  period: string;
  description: string;
}

const EXPERIENCE: TimelineItem[] = [
  {
    id: 1,
    title: "Senior WordPress Developer",
    org: "Freelance / Fiverr Pro",
    period: "2022 – Present",
    description:
      "Leading complex WordPress projects — custom themes, WooCommerce builds, malware remediation, and performance optimization for global clients with 5-star ratings.",
  },
  {
    id: 2,
    title: "Frontend Developer",
    org: "DigiTech Solutions Ltd.",
    period: "2020 – 2022",
    description:
      "Built pixel-perfect landing pages and interactive dashboards for SaaS products using modern HTML/CSS/JS with a focus on cross-browser compatibility and accessibility.",
  },
  {
    id: 3,
    title: "Junior Web Developer",
    org: "WebCraft Agency",
    period: "2018 – 2020",
    description:
      "Developed and maintained client websites on WordPress, handled theme customizations, plugin integrations, and basic SEO optimization tasks.",
  },
];

const EDUCATION: TimelineItem[] = [
  {
    id: 1,
    title: "BSc in Computer Science",
    org: "University of Dhaka",
    period: "2016 – 2020",
    description:
      "Focused on software engineering, algorithms, and web technologies. Final-year project: a full-stack e-commerce platform with AI-based recommendation engine.",
  },
  {
    id: 2,
    title: "Web Development Certification",
    org: "Coursera — Meta Front-End Developer",
    period: "2018",
    description:
      "Completed professional certification covering React, responsive design, version control with Git, and UX fundamentals with hands-on capstone projects.",
  },
  {
    id: 3,
    title: "Cybersecurity Fundamentals",
    org: "Google / Coursera",
    period: "2021",
    description:
      "Earned credential covering network security, vulnerability assessment, incident response, and practical WordPress hardening techniques.",
  },
];

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      type: "spring" as const,
      stiffness: 200,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const itemVariantsRight = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

function TimelineColumn({
  items,
  direction,
}: {
  items: TimelineItem[];
  direction: "left" | "right";
}) {
  const vars = direction === "left" ? itemVariants : itemVariantsRight;
  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div
        className="absolute left-3 top-3 bottom-3 w-px"
        style={{
          background:
            "linear-gradient(to bottom, oklch(var(--primary)/0.8), oklch(var(--accent)/0.8), oklch(var(--primary)/0.2))",
        }}
      />

      {items.map((item, i) => (
        <div key={item.id} className="relative mb-10 last:mb-0">
          {/* Glowing dot */}
          <motion.div
            custom={i}
            variants={dotVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="absolute -left-5 top-1 w-4 h-4 rounded-full border-2 border-primary bg-background"
            style={{
              boxShadow:
                "0 0 10px 2px oklch(var(--primary)/0.6), 0 0 4px 1px oklch(var(--accent)/0.4)",
            }}
          />

          <motion.div
            custom={i}
            variants={vars}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border/40 p-5 hover:border-primary/40 transition-smooth shadow-elevated"
            style={{ cursor: "default" }}
            whileHover={{ borderColor: "oklch(var(--primary)/0.5)" }}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1 block">
              {item.period}
            </span>
            <h3 className="font-display font-semibold text-sm text-foreground mb-0.5 leading-snug">
              {item.title}
            </h3>
            <p className="text-xs text-primary font-mono mb-2">{item.org}</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="section-pad border-b border-border/30"
      data-ocid="section-experience"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mb-2">
          {"// Career Journey"}
        </p>
        <h2 className="section-heading gradient-gold-cyan inline-block">
          My Experience
        </h2>
        <p className="section-subheading max-w-lg">
          Years of building, learning, and shipping real-world projects across
          WordPress, frontend engineering, and web security.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Experience column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Briefcase size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-sm">
                Work Experience
              </p>
              <p className="text-muted-foreground text-xs font-mono">
                Professional history
              </p>
            </div>
          </motion.div>
          <TimelineColumn items={EXPERIENCE} direction="left" />
        </div>

        {/* Education column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <GraduationCap size={16} className="text-accent" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-sm">
                Education
              </p>
              <p className="text-muted-foreground text-xs font-mono">
                Academic background
              </p>
            </div>
          </motion.div>
          <TimelineColumn items={EDUCATION} direction="right" />
        </div>
      </div>
    </section>
  );
}
