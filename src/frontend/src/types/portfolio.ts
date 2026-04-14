export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  gradient: string;
  accentColor: string;
  liveUrl?: string;
}

export interface ExperienceItem {
  id: number;
  title: string;
  org: string;
  period: string;
  description: string;
  type: "work" | "education";
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  accentGold: boolean;
}

export interface SkillItem {
  label: string;
  pct: number;
  category?: string;
}

export const NAV_LINKS: NavLink[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "services", label: "Services", href: "#services" },
  { id: "portfolio", label: "Portfolio", href: "#portfolio" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/mdabdullahhossaino",
    icon: "github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/mdabdullahhosen",
    icon: "linkedin",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    href: "https://twitter.com/abdullahhosen",
    icon: "twitter",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com/mdabdullahhossaino",
    icon: "facebook",
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:hello@abdullahhosen.com",
    icon: "email",
  },
];
