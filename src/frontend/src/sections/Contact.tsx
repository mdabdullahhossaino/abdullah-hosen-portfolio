import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";

interface ContactInfo {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  accentColor: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    label: "Email",
    value: "abdullah@example.com",
    href: "mailto:abdullah@example.com",
    accentColor: "#c9a84c",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 123 456 789",
    href: "tel:+880123456789",
    accentColor: "#0ea5e9",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: "#",
    accentColor: "#10b981",
  },
];

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45 },
  }),
};

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Invalid email address";
    if (!subject.trim()) e.subject = "Subject is required";
    if (!message.trim()) e.message = "Message is required";
    else if (message.trim().length < 20)
      e.message = "Message must be at least 20 characters";
    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate async submission
    setTimeout(() => {
      console.log("Contact form submitted:", { name, email, subject, message });
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1400);
  }

  return (
    <section
      id="contact"
      className="section-pad border-b border-border/30"
      data-ocid="section-contact"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mb-2">
          {"// Let's Connect"}
        </p>
        <h2 className="section-heading gradient-gold-cyan inline-block">
          Get In Touch
        </h2>
        <p className="section-subheading max-w-lg">
          Have a project in mind or need expert help with your WordPress site?
          Drop me a message — I respond within 24 hours.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-display font-semibold text-lg text-foreground mb-6">
            Contact Information
          </h3>
          <div className="space-y-5 mb-10">
            {CONTACT_INFO.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={info.label}
                  href={info.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/40 group hover:border-primary/40 transition-smooth no-underline"
                  data-ocid={`contact-info-${info.label.toLowerCase()}`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `${info.accentColor}18`,
                      border: `1px solid ${info.accentColor}44`,
                    }}
                  >
                    <Icon size={16} style={{ color: info.accentColor }} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-0.5">
                      {info.label}
                    </p>
                    <p className="text-foreground text-sm font-medium group-hover:opacity-90 transition-smooth">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Decorative availability note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl border border-primary/25 bg-primary/5 p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_#34d39966] animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Available for work
              </span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Currently accepting new WordPress projects, performance audits,
              and AI automation consultations. Response time typically under 24
              hours.
            </p>
          </motion.div>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center py-20 px-8 bg-card rounded-2xl border border-emerald-500/30"
                data-ocid="contact-success"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mb-6">
                  Thank you for reaching out. I'll get back to you within 24
                  hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSuccess(false)}
                  className="font-mono text-xs"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
                data-ocid="contact-form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div
                    custom={0}
                    variants={fieldVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Label
                      htmlFor="contact-name"
                      className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="Md Abdullah Hosen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => {
                        if (!name.trim())
                          setErrors((prev) => ({
                            ...prev,
                            name: "Name is required",
                          }));
                        else
                          setErrors((prev) => {
                            const { name: _, ...rest } = prev;
                            return rest;
                          });
                      }}
                      className="bg-card border-border/50 focus:border-accent/60 focus:ring-accent/20 text-foreground placeholder:text-muted-foreground/50"
                      data-ocid="input-name"
                    />
                    {errors.name && (
                      <p className="text-[10px] text-destructive mt-1 font-mono">
                        {errors.name}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    custom={1}
                    variants={fieldVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Label
                      htmlFor="contact-email"
                      className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => {
                        if (!email.trim())
                          setErrors((prev) => ({
                            ...prev,
                            email: "Email is required",
                          }));
                        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                          setErrors((prev) => ({
                            ...prev,
                            email: "Invalid email",
                          }));
                        else
                          setErrors((prev) => {
                            const { email: _, ...rest } = prev;
                            return rest;
                          });
                      }}
                      className="bg-card border-border/50 focus:border-accent/60 focus:ring-accent/20 text-foreground placeholder:text-muted-foreground/50"
                      data-ocid="input-email"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-destructive mt-1 font-mono">
                        {errors.email}
                      </p>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  custom={2}
                  variants={fieldVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Label
                    htmlFor="contact-subject"
                    className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block"
                  >
                    Subject
                  </Label>
                  <Input
                    id="contact-subject"
                    placeholder="WordPress Speed Optimization Project"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onBlur={() => {
                      if (!subject.trim())
                        setErrors((prev) => ({
                          ...prev,
                          subject: "Subject is required",
                        }));
                      else
                        setErrors((prev) => {
                          const { subject: _, ...rest } = prev;
                          return rest;
                        });
                    }}
                    className="bg-card border-border/50 focus:border-accent/60 focus:ring-accent/20 text-foreground placeholder:text-muted-foreground/50"
                    data-ocid="input-subject"
                  />
                  {errors.subject && (
                    <p className="text-[10px] text-destructive mt-1 font-mono">
                      {errors.subject}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  custom={3}
                  variants={fieldVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Label
                    htmlFor="contact-message"
                    className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell me about your project — what you need, your timeline, and any specific requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={() => {
                      if (!message.trim())
                        setErrors((prev) => ({
                          ...prev,
                          message: "Message is required",
                        }));
                      else if (message.trim().length < 20)
                        setErrors((prev) => ({
                          ...prev,
                          message: "At least 20 characters",
                        }));
                      else
                        setErrors((prev) => {
                          const { message: _, ...rest } = prev;
                          return rest;
                        });
                    }}
                    rows={5}
                    className="bg-card border-border/50 focus:border-accent/60 focus:ring-accent/20 text-foreground placeholder:text-muted-foreground/50 resize-none"
                    data-ocid="input-message"
                  />
                  {errors.message && (
                    <p className="text-[10px] text-destructive mt-1 font-mono">
                      {errors.message}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  custom={4}
                  variants={fieldVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-display font-semibold tracking-wide gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
                    data-ocid="btn-submit-contact"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message <Send size={14} />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
