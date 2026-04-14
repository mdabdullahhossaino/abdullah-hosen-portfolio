import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Bot,
  BugOff,
  CheckCircle2,
  ChevronDown,
  Code2,
  Github,
  LayoutTemplate,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Twitter,
  Wrench,
  Zap,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

interface ContactInfo {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@abdullahhosen.com",
    href: "mailto:hello@abdullahhosen.com",
    iconColor: "oklch(0.72 0.18 50)",
    bgColor: "oklch(0.72 0.18 50 / 0.10)",
    borderColor: "oklch(0.72 0.18 50 / 0.25)",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1234-567890",
    href: "tel:+8801234567890",
    iconColor: "oklch(0.72 0.22 210)",
    bgColor: "oklch(0.72 0.22 210 / 0.10)",
    borderColor: "oklch(0.72 0.22 210 / 0.25)",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: "https://maps.google.com/?q=Dhaka,Bangladesh",
    iconColor: "oklch(0.72 0.18 150)",
    bgColor: "oklch(0.72 0.18 150 / 0.10)",
    borderColor: "oklch(0.72 0.18 150 / 0.25)",
  },
  {
    icon: Zap,
    label: "Status",
    value: "Available for Work",
    href: "#contact",
    iconColor: "oklch(0.75 0.20 145)",
    bgColor: "oklch(0.75 0.20 145 / 0.10)",
    borderColor: "oklch(0.75 0.20 145 / 0.30)",
  },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    href: "https://github.com/mdabdullahhossaino",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/mdabdullahhossaino",
    label: "LinkedIn",
  },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@abdullahhosen.com", label: "Email" },
];

interface ServiceOption {
  value: string;
  label: string;
  icon: typeof Mail;
  color: string;
}

const SERVICES: ServiceOption[] = [
  {
    value: "WordPress Development",
    label: "WordPress Development",
    icon: Code2,
    color: "oklch(0.72 0.22 210)",
  },
  {
    value: "Frontend Design & Development",
    label: "Frontend Design & Development",
    icon: LayoutTemplate,
    color: "oklch(0.72 0.18 50)",
  },
  {
    value: "Malware Removal & Security",
    label: "Malware Removal & Security",
    icon: ShieldCheck,
    color: "oklch(0.72 0.18 150)",
  },
  {
    value: "Speed Optimization",
    label: "Speed Optimization",
    icon: Zap,
    color: "oklch(0.75 0.20 80)",
  },
  {
    value: "Bug Fixing",
    label: "Bug Fixing",
    icon: BugOff,
    color: "oklch(0.72 0.20 25)",
  },
  {
    value: "AI Automation Integration",
    label: "AI Automation Integration",
    icon: Bot,
    color: "oklch(0.72 0.22 280)",
  },
  {
    value: "Other / Custom",
    label: "Other / Custom",
    icon: Wrench,
    color: "oklch(0.60 0.010 55)",
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
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
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Contact() {
  const headerReveal = useReveal();
  const leftReveal = useReveal();
  const rightReveal = useReveal();

  const { actor, isFetching } = useActor(createActor);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("");
  const [checkAnimated, setCheckAnimated] = useState(false);

  function handleServiceChange(val: string) {
    setService(val);
    if (val) {
      setSubject(`Inquiry about ${val}`);
      setTouched((prev) => ({ ...prev, service: true }));
      setErrors((prev) => {
        const { service: _s, ...rest } = prev;
        return rest;
      });
    }
  }

  const isValid =
    !!service &&
    name.trim().length >= 2 &&
    email.trim() &&
    validateEmail(email) &&
    subject.trim() &&
    message.trim().length >= 20;

  function blurValidate(field: string, value: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => {
      const next = { ...prev };
      if (field === "service") {
        const { service: _s, ...rest } = next;
        if (!value) return { ...rest, service: "Please select a service" };
        return rest;
      }
      if (field === "name") {
        const { name: _n, ...rest } = next;
        if (!value.trim()) return { ...rest, name: "Name is required" };
        if (value.trim().length < 2)
          return { ...rest, name: "Name must be at least 2 characters" };
        return rest;
      }
      if (field === "email") {
        const { email: _e, ...rest } = next;
        if (!value.trim()) return { ...rest, email: "Email is required" };
        if (!validateEmail(value))
          return { ...rest, email: "Invalid email address" };
        return rest;
      }
      if (field === "subject") {
        const { subject: _sub, ...rest } = next;
        if (!value.trim()) return { ...rest, subject: "Subject is required" };
        return rest;
      }
      if (field === "message") {
        const { message: _m, ...rest } = next;
        if (!value.trim()) return { ...rest, message: "Message is required" };
        if (value.trim().length < 20)
          return { ...rest, message: "Message must be at least 20 characters" };
        return rest;
      }
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!service) errs.service = "Please select a service";
    if (!name.trim() || name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (!email.trim()) errs.email = "Email is required";
    else if (!validateEmail(email)) errs.email = "Invalid email address";
    if (!subject.trim()) errs.subject = "Subject is required";
    if (!message.trim()) errs.message = "Message is required";
    else if (message.trim().length < 20)
      errs.message = "Message must be at least 20 characters";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched({
        service: true,
        name: true,
        email: true,
        subject: true,
        message: true,
      });
      return;
    }

    setErrors({});
    setSubmitError(null);
    setLoading(true);
    const sentName = name.trim().split(" ")[0];
    const finalSubject = `[${service}] ${subject.trim()}`;

    try {
      if (!actor || isFetching) throw new Error("Not connected");
      await actor.submitContact(
        name.trim(),
        email.trim(),
        finalSubject,
        message.trim(),
      );
      setSubmittedName(sentName);
      setSuccess(true);
      setCheckAnimated(false);
      setTimeout(() => setCheckAnimated(true), 80);
      setName("");
      setEmail("");
      setService("");
      setSubject("");
      setMessage("");
      setTouched({});
    } catch {
      setSubmitError(
        "Something went wrong. Please try again or email me directly.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="section-pad border-b border-border/30 relative overflow-hidden"
      data-ocid="section-contact"
    >
      {/* Ambient glow backgrounds */}
      <div
        className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.18 50 / 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 -right-16 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.22 210 / 0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Section header */}
      <div
        ref={headerReveal.ref}
        className={`reveal-fade-up mb-12 ${headerReveal.visible ? "revealed" : ""}`}
      >
        <span
          className="inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4"
          style={{
            color: "oklch(0.72 0.22 210)",
            background: "oklch(0.72 0.22 210 / 0.10)",
            border: "1px solid oklch(0.72 0.22 210 / 0.28)",
          }}
        >
          Get In Touch
        </span>
        <h2 className="section-heading text-foreground mb-2">
          Let&apos;s <span className="gradient-gold-cyan">Work Together</span>
        </h2>
        <div
          className="w-14 h-0.5 mb-4 rounded-full"
          style={{
            background:
              "linear-gradient(to right, oklch(0.72 0.18 50), oklch(0.72 0.22 210))",
          }}
        />
        <p className="section-subheading max-w-md">
          Have a project in mind? I&apos;d love to help you build something
          exceptional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* LEFT — Contact Info */}
        <div
          ref={leftReveal.ref}
          className={`reveal-fade-up ${leftReveal.visible ? "revealed" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to bring your vision to life. Reach out through the
            form or any of the channels below.
          </p>

          {/* Contact info cards */}
          <div className="space-y-3 mb-8">
            {CONTACT_INFO.map((info, i) => {
              const Icon = info.icon;
              const isStatus = info.label === "Status";
              return (
                <a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    info.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center gap-4 p-4 rounded-2xl border group transition-smooth no-underline card-lift relative overflow-hidden"
                  style={{
                    background: "oklch(0.13 0.014 48)",
                    borderColor: info.borderColor,
                    animationDelay: `${i * 0.07}s`,
                  }}
                  data-ocid={`contact-info-${info.label.toLowerCase()}`}
                  aria-label={`${info.label}: ${info.value}`}
                >
                  <div
                    className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-smooth"
                    style={{
                      background: `linear-gradient(to right, transparent, ${info.iconColor}, transparent)`,
                    }}
                  />
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-smooth group-hover:scale-110"
                    style={{
                      background: info.bgColor,
                      border: `1px solid ${info.borderColor}`,
                    }}
                  >
                    <Icon size={16} style={{ color: info.iconColor }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[10px] font-mono uppercase tracking-wider mb-0.5"
                      style={{ color: "oklch(0.50 0.010 55)" }}
                    >
                      {info.label}
                    </p>
                    <p className="text-foreground text-sm font-medium truncate">
                      {info.value}
                    </p>
                  </div>
                  {isStatus && (
                    <span
                      className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono font-semibold px-2 py-1 rounded-full"
                      style={{
                        color: "oklch(0.75 0.20 145)",
                        background: "oklch(0.75 0.20 145 / 0.12)",
                        border: "1px solid oklch(0.75 0.20 145 / 0.30)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: "oklch(0.75 0.20 145)" }}
                      />
                      Active
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Social links */}
          <div className="mb-8">
            <p
              className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3"
              style={{ color: "oklch(0.48 0.010 55)" }}
            >
              Follow Me
            </p>
            <ul
              className="flex items-center gap-2 list-none p-0"
              aria-label="Social media links"
            >
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-border/40 text-muted-foreground transition-smooth hover:scale-110 hover:border-primary/50 hover:text-primary hover:shadow-gold-glow"
                    style={{ background: "oklch(0.15 0.016 48)" }}
                    data-ocid={`contact-social-${label.toLowerCase()}`}
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Available badge */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full font-mono text-xs font-semibold badge-pulse"
            style={{
              color: "oklch(0.72 0.18 50)",
              background: "oklch(0.72 0.18 50 / 0.10)",
              border: "1px solid oklch(0.72 0.18 50 / 0.32)",
            }}
            data-ocid="freelance-badge"
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "oklch(0.72 0.18 50)" }}
            />
            Available for Freelance Work
          </div>
        </div>

        {/* RIGHT — Contact Form */}
        <div
          ref={rightReveal.ref}
          className={`reveal-fade-up ${rightReveal.visible ? "revealed" : ""}`}
          style={{ animationDelay: "0.22s" }}
        >
          {success ? (
            /* ── Cinematic Success State ── */
            <div
              className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl border relative overflow-hidden"
              style={{
                background: "oklch(0.12 0.014 48)",
                borderColor: "oklch(0.75 0.20 145 / 0.35)",
                minHeight: "440px",
              }}
              data-ocid="contact-success"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, oklch(0.75 0.20 145 / 0.07) 0%, transparent 65%)",
                }}
                aria-hidden="true"
              />

              <div className="relative mb-7">
                <div
                  className="w-24 h-24 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background:
                      "conic-gradient(from 0deg, oklch(0.75 0.20 145 / 0.5), oklch(0.72 0.22 210 / 0.5), oklch(0.75 0.20 145 / 0.5))",
                    padding: "1px",
                    borderRadius: "9999px",
                    animation: checkAnimated
                      ? "ring-rotate-cw 4s linear infinite"
                      : "none",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: "oklch(0.12 0.014 48)",
                    border: "2px solid oklch(0.75 0.20 145 / 0.40)",
                    boxShadow: checkAnimated
                      ? "0 0 30px -5px oklch(0.75 0.20 145 / 0.45)"
                      : "none",
                    transition: "box-shadow 0.6s ease",
                  }}
                >
                  <CheckCircle2
                    size={36}
                    style={{
                      color: "oklch(0.75 0.20 145)",
                      opacity: checkAnimated ? 1 : 0,
                      transform: checkAnimated ? "scale(1)" : "scale(0.5)",
                      transition:
                        "opacity 0.4s ease 0.15s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s",
                    }}
                  />
                </div>
              </div>

              <h3
                className="font-display font-bold text-2xl mb-2"
                style={{
                  opacity: checkAnimated ? 1 : 0,
                  transform: checkAnimated
                    ? "translateY(0)"
                    : "translateY(12px)",
                  transition:
                    "opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s",
                  color: "oklch(0.93 0.008 60)",
                }}
              >
                Message Sent!
              </h3>

              <p
                className="text-sm max-w-xs mb-1"
                style={{
                  color: "oklch(0.72 0.22 210)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  opacity: checkAnimated ? 1 : 0,
                  transition: "opacity 0.5s ease 0.5s",
                }}
              >
                STATUS: DELIVERED
              </p>

              <p
                className="text-muted-foreground text-sm max-w-xs mb-8 mt-3 leading-relaxed"
                style={{
                  opacity: checkAnimated ? 1 : 0,
                  transition: "opacity 0.5s ease 0.6s",
                }}
              >
                Thanks{submittedName ? `, ${submittedName}` : ""}! Your message
                has been received. I&apos;ll get back to you within{" "}
                <span style={{ color: "oklch(0.72 0.18 50)" }}>24 hours</span>.
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSuccess(false);
                  setCheckAnimated(false);
                }}
                className="font-mono text-xs border-border/50 hover:border-primary/50 hover:text-primary"
                style={{
                  opacity: checkAnimated ? 1 : 0,
                  transition: "opacity 0.5s ease 0.75s",
                }}
                data-ocid="btn-send-another"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            /* ── Contact Form ── */
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5 p-7 rounded-2xl border"
              style={{
                background: "oklch(0.12 0.014 48)",
                borderColor: "oklch(0.28 0.018 48 / 0.6)",
              }}
              data-ocid="contact-form"
            >
              {/* Service Selector */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-service"
                  className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1"
                >
                  Service Needed{" "}
                  <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
                </Label>
                <div className="relative">
                  {/* selected service icon indicator */}
                  {service &&
                    (() => {
                      const found = SERVICES.find((s) => s.value === service);
                      if (!found) return null;
                      const Icon = found.icon;
                      return (
                        <div
                          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center w-6 h-6 rounded-md"
                          style={{
                            background: `${found.color.replace(")", " / 0.12)")}`,
                          }}
                          aria-hidden="true"
                        >
                          <Icon size={12} style={{ color: found.color }} />
                        </div>
                      );
                    })()}
                  <select
                    id="contact-service"
                    value={service}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    onBlur={() => blurValidate("service", service)}
                    className="w-full rounded-xl border border-border/40 text-sm transition-smooth appearance-none pr-10 py-2.5 focus:outline-none"
                    style={{
                      background: "oklch(0.10 0.012 48)",
                      color: service
                        ? "oklch(0.93 0.008 60)"
                        : "oklch(0.45 0.010 55)",
                      paddingLeft: service ? "2.75rem" : "0.875rem",
                      borderColor:
                        touched.service && errors.service
                          ? "oklch(0.55 0.22 25 / 0.6)"
                          : service
                            ? "oklch(0.72 0.22 210 / 0.55)"
                            : undefined,
                      boxShadow: service
                        ? "0 0 0 1px oklch(0.72 0.22 210 / 0.18)"
                        : undefined,
                    }}
                    data-ocid="select-service"
                    aria-invalid={touched.service && !!errors.service}
                  >
                    <option
                      value=""
                      disabled
                      style={{
                        color: "oklch(0.45 0.010 55)",
                        background: "oklch(0.10 0.012 48)",
                      }}
                    >
                      Choose a service…
                    </option>
                    {SERVICES.map((s) => (
                      <option
                        key={s.value}
                        value={s.value}
                        style={{
                          background: "oklch(0.13 0.014 48)",
                          color: "oklch(0.88 0.008 60)",
                        }}
                      >
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-smooth"
                    style={{
                      color: service
                        ? "oklch(0.72 0.22 210)"
                        : "oklch(0.45 0.010 55)",
                    }}
                    aria-hidden="true"
                  />
                </div>
                {touched.service && errors.service && (
                  <p
                    className="text-[10px] font-mono flex items-center gap-1"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                    role="alert"
                  >
                    ⚠ {errors.service}
                  </p>
                )}
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-name"
                    className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1"
                  >
                    Your Name{" "}
                    <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="Abdullah Hosen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => blurValidate("name", name)}
                    className="rounded-xl border-border/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/35 text-sm transition-smooth"
                    style={{ background: "oklch(0.10 0.012 48)" }}
                    data-ocid="input-name"
                    aria-invalid={touched.name && !!errors.name}
                  />
                  {touched.name && errors.name && (
                    <p
                      className="text-[10px] font-mono flex items-center gap-1"
                      style={{ color: "oklch(0.65 0.22 25)" }}
                      role="alert"
                    >
                      ⚠ {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-email"
                    className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1"
                  >
                    Email Address{" "}
                    <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => blurValidate("email", email)}
                    className="rounded-xl border-border/40 focus:border-accent/60 focus:ring-1 focus:ring-accent/20 text-foreground placeholder:text-muted-foreground/35 text-sm transition-smooth"
                    style={{ background: "oklch(0.10 0.012 48)" }}
                    data-ocid="input-email"
                    aria-invalid={touched.email && !!errors.email}
                  />
                  {touched.email && errors.email && (
                    <p
                      className="text-[10px] font-mono flex items-center gap-1"
                      style={{ color: "oklch(0.65 0.22 25)" }}
                      role="alert"
                    >
                      ⚠ {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-subject"
                  className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1"
                >
                  Subject{" "}
                  <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
                </Label>
                <Input
                  id="contact-subject"
                  placeholder="WordPress Speed Optimization Project"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onBlur={() => blurValidate("subject", subject)}
                  className="rounded-xl border-border/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/35 text-sm transition-smooth"
                  style={{ background: "oklch(0.10 0.012 48)" }}
                  data-ocid="input-subject"
                  aria-invalid={touched.subject && !!errors.subject}
                />
                {touched.subject && errors.subject && (
                  <p
                    className="text-[10px] font-mono flex items-center gap-1"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                    role="alert"
                  >
                    ⚠ {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-message"
                  className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-1 justify-between"
                >
                  <span className="flex items-center gap-1">
                    Message{" "}
                    <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
                  </span>
                  <span
                    className="normal-case"
                    style={{
                      color:
                        message.trim().length >= 20
                          ? "oklch(0.72 0.18 50)"
                          : "oklch(0.48 0.010 55)",
                    }}
                  >
                    {message.trim().length}/20 min
                  </span>
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell me about your project — what you need, your timeline, and any specific requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => blurValidate("message", message)}
                  rows={5}
                  className="rounded-xl border-border/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/35 resize-none text-sm transition-smooth"
                  style={{ background: "oklch(0.10 0.012 48)" }}
                  data-ocid="input-message"
                  aria-invalid={touched.message && !!errors.message}
                />
                {touched.message && errors.message && (
                  <p
                    className="text-[10px] font-mono flex items-center gap-1"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                    role="alert"
                  >
                    ⚠ {errors.message}
                  </p>
                )}
              </div>

              {/* Backend error */}
              {submitError && (
                <div
                  className="px-4 py-3 rounded-xl text-sm font-mono"
                  style={{
                    background: "oklch(0.55 0.22 25 / 0.12)",
                    border: "1px solid oklch(0.55 0.22 25 / 0.3)",
                    color: "oklch(0.75 0.18 25)",
                  }}
                  role="alert"
                  data-ocid="contact-error"
                >
                  ⚠ {submitError}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !isValid || isFetching}
                className="w-full font-display font-semibold tracking-wide gap-2 h-11 rounded-xl transition-smooth disabled:opacity-40"
                style={
                  isValid && !loading
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.68 0.16 38))",
                        color: "oklch(0.08 0.012 50)",
                        boxShadow: "0 4px 20px -4px oklch(0.72 0.18 50 / 0.5)",
                      }
                    : undefined
                }
                data-ocid="btn-submit-contact"
              >
                {loading ? (
                  <>
                    <span
                      className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin shrink-0"
                      style={{
                        borderColor: "currentColor",
                        borderTopColor: "transparent",
                      }}
                      aria-hidden="true"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={15} aria-hidden="true" /> Send Message
                  </>
                )}
              </Button>

              <p
                className="text-center text-[10px] font-mono"
                style={{ color: "oklch(0.40 0.008 55)" }}
              >
                I respond within 24 hours · No spam, ever
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
