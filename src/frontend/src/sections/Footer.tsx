import { ArrowUp, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    href: "https://github.com/mdabdullahhossaino",
    label: "GitHub",
    hoverColor: "oklch(0.85 0.01 60)",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/mdabdullahhossaino",
    label: "LinkedIn",
    hoverColor: "oklch(0.60 0.20 230)",
  },
  {
    icon: Twitter,
    href: "https://twitter.com",
    label: "Twitter",
    hoverColor: "oklch(0.68 0.18 210)",
  },
  {
    icon: Mail,
    href: "mailto:hello@abdullahhosen.com",
    label: "Email",
    hoverColor: "oklch(0.72 0.18 50)",
  },
];

const year = new Date().getFullYear();

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 200);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <footer
        ref={ref}
        className="relative"
        style={{ background: "oklch(0.09 0.010 48)" }}
        data-ocid="footer"
      >
        {/* Gold-to-cyan cinematic gradient separator */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, oklch(0.72 0.18 50 / 0.8) 25%, oklch(0.72 0.22 210 / 0.8) 75%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Subtle ambient glow under separator */}
        <div
          className="h-8 w-full pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.72 0.18 50 / 0.04) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div
          className={`px-8 md:px-12 pb-7 reveal-fade-up ${visible ? "revealed" : ""}`}
        >
          {/* Top row: brand + nav + social */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 mb-10">
            {/* Brand */}
            <div className="flex flex-col items-center lg:items-start gap-2 shrink-0">
              <a
                href="#home"
                className="font-display font-bold text-2xl gradient-gold-cyan transition-smooth hover:opacity-80"
                aria-label="Back to top"
              >
                Abdullah Hosen
              </a>
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(0.50 0.010 55)" }}
              >
                WordPress Developer &amp; Frontend Engineer
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.75 0.20 145)" }}
                />
                <span
                  className="text-[10px] font-mono"
                  style={{ color: "oklch(0.75 0.20 145)" }}
                >
                  Available for Freelance
                </span>
              </div>
            </div>

            {/* Quick nav */}
            <nav
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5"
              aria-label="Footer navigation"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary text-xs font-mono uppercase tracking-wider transition-smooth relative group"
                  data-ocid={`footer-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                    style={{ background: "oklch(0.72 0.18 50)" }}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </nav>

            {/* Social */}
            <ul
              className="flex items-center gap-2.5 list-none p-0 shrink-0"
              aria-label="Social media"
            >
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-border/40 text-muted-foreground transition-smooth hover:text-primary hover:border-primary/50 hover:scale-110 hover:shadow-gold-glow"
                    style={{ background: "oklch(0.14 0.014 48)" }}
                    data-ocid={`footer-social-${label.toLowerCase()}`}
                  >
                    <Icon size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mb-6"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(0.25 0.016 48 / 0.9), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Bottom row: copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p
              className="text-center text-[11px] font-mono"
              style={{ color: "oklch(0.40 0.008 55)" }}
            >
              © {year} Abdullah Hosen. All rights reserved.
            </p>
            <p
              className="text-center text-[11px] font-mono"
              style={{ color: "oklch(0.40 0.008 55)" }}
            >
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-smooth hover:text-primary"
                style={{ color: "oklch(0.72 0.18 50)" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll-to-top button — fixed bottom-right */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.68 0.14 35))",
          color: "oklch(0.08 0.012 50)",
          boxShadow: showScrollTop
            ? "0 0 24px -4px oklch(0.72 0.18 50 / 0.65), 0 4px 12px -2px rgba(0,0,0,0.4)"
            : "none",
          opacity: showScrollTop ? 1 : 0,
          pointerEvents: showScrollTop ? "auto" : "none",
          transform: showScrollTop
            ? "translateY(0) scale(1)"
            : "translateY(14px) scale(0.82)",
        }}
        data-ocid="scroll-to-top"
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>
    </>
  );
}
