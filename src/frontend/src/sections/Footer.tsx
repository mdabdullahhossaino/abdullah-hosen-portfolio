import { Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "motion/react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/30" data-ocid="footer">
      {/* Gradient separator */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(var(--primary)/0.6), oklch(var(--accent)/0.6), transparent)",
        }}
      />

      <div className="lg:ml-0 px-8 md:px-12 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-display font-bold text-lg gradient-gold-cyan">
              Md Abdullah Hosen
            </span>
            <span className="text-muted-foreground text-xs font-mono">
              WordPress Developer &amp; Frontend Engineer
            </span>
          </div>

          {/* Nav links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            aria-label="Footer navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-primary text-xs font-mono uppercase tracking-wider transition-smooth"
                data-ocid={`footer-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-secondary/60 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-smooth"
                data-ocid={`footer-social-${label.toLowerCase()}`}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Second gradient separator */}
        <div
          className="my-6 h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(var(--border)/0.6), transparent)",
          }}
        />

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-muted-foreground text-[11px] font-mono"
        >
          © {year} Md Abdullah Hosen. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-smooth"
          >
            caffeine.ai
          </a>
        </motion.p>
      </div>
    </footer>
  );
}
