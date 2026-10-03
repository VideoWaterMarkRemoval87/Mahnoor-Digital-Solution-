export interface ServiceItem {
  id: string;
  title: string;
  category: 'web' | 'canva' | 'marketing' | 'ai';
  categoryLabel: string;
  description: string;
  details: string[];
  icon: string;
  deliverables: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'WordPress' | 'Canva' | 'Content' | 'AI Solutions' | 'Websites' | 'Canva Designs' | 'Social Media' | 'AI Projects' | string;
  shortDesc: string;
  fullDesc: string;
  clientType: string;
  timeline: string;
  toolsUsed: string[];
  deliverables: string[];
  image: string;
  isConcept?: boolean;
  linkText?: string;
  liveUrl?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
}

export interface ValueCard {
  title: string;
  description: string;
  icon: string;
}

export interface AITool {
  name: string;
  role: string;
  useCase: string;
  badge: string;
  category?: 'ai' | 'design' | 'web' | 'productivity';
  iconType?: string;
}

export interface SkillCategory {
  title: string;
  subtitle: string;
  icon: string;
  skills: {
    name: string;
    level: string;
    description: string;
  }[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  preferredDateTime: string;
  message: string;
}
