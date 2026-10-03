import { ServiceItem, PortfolioItem, ProcessStep, ValueCard, AITool, SkillCategory } from '../types';

// Custom generated project imagery
import heroFreelancerImg from '../assets/images/hero_freelancer_1789976582076.webp';
import workspaceAboutImg from '../assets/images/workspace_about_1789976599702.webp';
import websiteShowcaseImg from '../assets/images/website_showcase_1789976616418.webp';
import canvaBrandingImg from '../assets/images/canva_branding_sample_1789976630652.webp';
import aiDigitalArtImg from '../assets/images/ai_digital_art_1789976650585.webp';

export const ASSETS = {
  heroFreelancer: heroFreelancerImg,
  workspaceAbout: workspaceAboutImg,
  websiteShowcase: websiteShowcaseImg,
  canvaBranding: canvaBrandingImg,
  aiDigitalArt: aiDigitalArtImg,
};

export const SITE_CONFIG = {
  brandName: 'Mahnoor Digital Solution',
  brandShort: 'MDS',
  tagline: 'Web Design • Creative Design • Content • AI Solutions',
  consultantName: 'Mahnoor Naaz',
  email: 'mahambitget9807@gmail.com',
  supportEmail: 'mahambitget9807@gmail.com',
  whatsappUsername: 'Send Message',
  whatsappNumber: '923247939635',
  location: 'Available Worldwide • Remote Projects (Pakistan, USA, UK, UAE & Global)',
  workHours: 'Mon – Sat: 9:00 AM – 9:00 PM (PKT / Global Remote)',
  responseGuarantee: 'Guaranteed response within 2 hours',
};

// Previously the WhatsApp links were hardcoded with no phone number
// (`https://wa.me/?text=...`), so tapping "Chat on WhatsApp" opened a blank
// chat that went to nobody. Every link now builds from whatsappNumber above,
// so fixing the number in one place fixes every WhatsApp button on the site.
export const buildWhatsAppUrl = (message: string, recipientNumber?: string): string => {
  const target = (recipientNumber || SITE_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'wp-design',
    title: 'WordPress Website Design',
    category: 'web',
    categoryLabel: 'WordPress & Web',
    description: 'Bespoke, high-converting WordPress websites tailored to your brand identity, business objectives, and customer journey.',
    details: [
      'Custom page layouts aligned with your brand typography & color palette',
      'Fully responsive across smartphones, tablets, laptops, and desktop',
      'Fast loading speed optimization and lightweight architecture',
      'Integration of lead capture forms, WhatsApp chat, and booking systems',
    ],
    icon: 'Globe',
    deliverables: 'Complete, responsive multi-page WordPress website ready for deployment',
  },
  {
    id: 'wp-redesign',
    title: 'WordPress Website Redesign',
    category: 'web',
    categoryLabel: 'WordPress & Web',
    description: 'Transform outdated, slow, or cluttered WordPress websites into modern, sleek, high-performing digital hubs without losing SEO or data.',
    details: [
      'Full aesthetic overhaul with clean typography, spacing, and modern UI',
      'Mobile responsiveness fixes and cross-browser alignment',
      'Removal of bloated plugins, theme cleanup, and performance acceleration',
      'Seamless content migration with zero downtime during revamp',
    ],
    icon: 'RefreshCw',
    deliverables: 'Modernized, fast-loading responsive website with preserved rankings',
  },
  {
    id: 'elementor-pro',
    title: 'Elementor & Elementor Pro',
    category: 'web',
    categoryLabel: 'WordPress & Web',
    description: 'Custom, pixel-perfect websites built using Elementor and Elementor Pro with intuitive drag-and-drop management for non-technical owners.',
    details: [
      'Custom theme builder templates (Headers, Footers, Single Posts, Archives)',
      'Dynamic content integration and responsive mobile breakpoints',
      'Interactive popups, sticky navigation bars, and conversion funnels',
      'Video walkthrough handover showing how to edit pages yourself',
    ],
    icon: 'Layout',
    deliverables: 'Elementor Pro template system + comprehensive client video tutorial',
  },
  {
    id: 'business-websites',
    title: 'Business Websites',
    category: 'web',
    categoryLabel: 'WordPress & Web',
    description: 'Credible, corporate-ready digital homes designed for consultancies, agencies, clinics, service providers, and growing firms.',
    details: [
      'Clear value proposition hierarchy and trust-building social proof',
      'Service catalog pages, team profiles, and case study showcases',
      'Inquiry contact forms, interactive Google Maps, and lead funnels',
      'Compliant cookie notices, privacy policy setup, and terms pages',
    ],
    icon: 'Briefcase',
    deliverables: 'Turnkey business website that turns visitors into qualified leads',
  },
  {
    id: 'woocommerce',
    title: 'WooCommerce',
    category: 'web',
    categoryLabel: 'WordPress & Web',
    description: 'Robust online storefronts equipped with secure checkout funnels, catalog filtering, payment gateways, and inventory control.',
    details: [
      'Stripe, PayPal, Bank Wire, and Apple Pay payment gateway setup',
      'Product category taxonomies, variable products (colors/sizes), and reviews',
      'Automated customer order confirmation emails and digital invoices',
      'Speed-optimized checkout experience designed to reduce cart abandonment',
    ],
    icon: 'ShoppingBag',
    deliverables: 'Turnkey e-commerce storefront with live payment setup & inventory matrix',
  },
  {
    id: 'website-hosting',
    title: 'Website Setup & Hosting',
    category: 'web',
    categoryLabel: 'WordPress & Web',
    description: 'End-to-end technical configuration including domain mapping, DNS management, SSL certificates, business email, and Hostinger/cPanel migration.',
    details: [
      'Domain registration and nameserver / DNS record mapping (A, CNAME, MX)',
      'Lifetime SSL encryption installation for secure HTTPS browsing',
      'Professional business email configuration (contact@yourdomain.com)',
      'Hostinger, Namecheap, cPanel, or Cloudflare DNS integration & caching',
    ],
    icon: 'Server',
    deliverables: 'Secured live domain, optimized hosting environment, SSL, and business email',
  },
  {
    id: 'canva-design',
    title: 'Canva Design',
    category: 'canva',
    categoryLabel: 'Creative & Canva',
    description: 'Bespoke branded templates, digital stationery, brand assets, and marketing graphics crafted in Canva for effortless daily client reuse.',
    details: [
      'Master Canva share link allowing one-click editing without design skills',
      'Pre-curated brand font pairings, color palettes, and optical alignment',
      'Export ready in high-resolution PDF, SVG, PNG, and print formats',
      'Consistent style guidelines ensuring unified brand identity across touchpoints',
    ],
    icon: 'Palette',
    deliverables: 'Editable master Canva template links + high-res print/web export files',
  },
  {
    id: 'ebook-workbook',
    title: 'Ebook & Workbook Design',
    category: 'canva',
    categoryLabel: 'Creative & Canva',
    description: 'Sophisticated digital publications, educational workbooks, client onboarding guides, lead magnets, and training manuals.',
    details: [
      'Striking cover artwork that commands attention on landing pages',
      'Editorial interior typography with comfortable line heights and margins',
      'Clickable hyperlinks, table of contents, and interactive form fields',
      'Both web-optimized lightweight PDFs and print-ready high-dpi files',
    ],
    icon: 'BookOpen',
    deliverables: 'Interactive digital publication PDF + editable source Canva links',
  },
  {
    id: 'social-post-design',
    title: 'Social Media Post Design',
    category: 'canva',
    categoryLabel: 'Creative & Canva',
    description: 'Visually captivating Instagram carousels, LinkedIn slide decks, Pinterest pins, and promotional cards that build community and trust.',
    details: [
      'Seamless multi-slide panorama carousels that drive bookmark saves',
      'Stat-driven infographics and clean corporate quote layouts',
      'Distinctive visual style that makes your profile instantly recognizable',
      'Pre-sized for Instagram, Facebook, LinkedIn, and Twitter/X feeds',
    ],
    icon: 'Share2',
    deliverables: 'Cohesive pack of 15–30 branded graphics + editable source templates',
  },
  {
    id: 'flyer-poster',
    title: 'Flyer & Poster Design',
    category: 'canva',
    categoryLabel: 'Creative & Canva',
    description: 'Eye-catching promotional flyers, event posters, webinar handouts, seasonal sales banners, and menus with strong visual hierarchy.',
    details: [
      'High-impact headline typography and clear call-to-action placement',
      'Dynamic QR codes linking directly to your website, booking, or menu',
      'CMYK color profile formatting with proper bleed lines for physical print',
      'Digital social-ready companion versions for instant online sharing',
    ],
    icon: 'FileText',
    deliverables: 'Print-ready high-res CMYK PDFs with bleed + digital web versions',
  },
  {
    id: 'real-estate-design',
    title: 'Real Estate Design',
    category: 'canva',
    categoryLabel: 'Creative & Canva',
    description: 'Specialized luxury marketing kits for realtors, brokerages, and property managers including open house flyers and listing presentations.',
    details: [
      'Luxury property highlight sheets with photo bento grids and floorplan slots',
      '"Just Listed" and "Under Contract / Sold" announcement social templates',
      'Comprehensive neighborhood buyer/seller guides and presentation decks',
      'Realtor license, broker logo, and personal contact info badge integration',
    ],
    icon: 'Home',
    deliverables: 'Complete Realtor marketing collateral kit in Canva + print files',
  },
  {
    id: 'seo-content-writing',
    title: 'SEO Content Writing',
    category: 'marketing',
    categoryLabel: 'Marketing & SEO',
    description: 'Search-engine-optimized, human-first website copy, insightful articles, and landing page content that drives organic ranking and sales.',
    details: [
      'Intent-driven keyword research targeting high-converting buyer queries',
      'Scannable H1/H2/H3 structure, bullet lists, and conversational authority',
      'Click-worthy meta titles and meta descriptions for search engine snippets',
      'Thoroughly researched, 100% human-edited, natural, and engaging prose',
    ],
    icon: 'PenTool',
    deliverables: 'Fully formatted, keyword-mapped content ready to publish on WordPress',
  },
  {
    id: 'social-management',
    title: 'Social Media Management',
    category: 'marketing',
    categoryLabel: 'Marketing & SEO',
    description: 'Strategic monthly content calendar planning, graphic publishing, engaging copy writing, and profile optimization to keep channels active.',
    details: [
      'Monthly editorial content calendar tailored to your industry goals',
      'Persuasive caption writing paired with conversion-driven calls-to-action',
      'Researched hashtag clusters and optimal posting time scheduling',
      'Monthly performance insights summary with actionable engagement tips',
    ],
    icon: 'Calendar',
    deliverables: 'End-to-end monthly publishing schedule, graphics, and captions',
  },
  {
    id: 'pinterest-marketing',
    title: 'Pinterest Marketing',
    category: 'marketing',
    categoryLabel: 'Marketing & SEO',
    description: 'Visual pin strategy, keyword-rich board optimization, and continuous pin scheduling to generate long-term organic referral traffic.',
    details: [
      'High-click-through 2:3 vertical graphic designs with bold text overlays',
      'Keyword-optimized pin titles, descriptions, and searchable board taxonomy',
      'Rich Pin verification and website domain claim assistance',
      'Automated batch scheduling setup using native Meta Suite or Buffer',
    ],
    icon: 'TrendingUp',
    deliverables: 'Branded pin packs + complete Pinterest SEO blueprint & strategy',
  },
  {
    id: 'ai-web-development',
    title: 'AI Website Development',
    category: 'ai',
    categoryLabel: 'AI Solutions',
    description: 'Fast-track website creation combining AI-assisted rapid prototyping with seasoned human frontend engineering for rapid delivery.',
    details: [
      'Accelerated wireframing and layout scaffolding in record time',
      'Modern, semantic code generation with clean HTML5, CSS3, and responsive architecture',
      'Automated speed diagnostics, asset minification, and responsive tests',
      'Rigorous human code review, component refactoring, and quality assurance',
    ],
    icon: 'Cpu',
    deliverables: 'Production-ready responsive website delivered in half the traditional timeline',
  },
  {
    id: 'ai-web-editing',
    title: 'AI Website Editing & Redesign',
    category: 'ai',
    categoryLabel: 'AI Solutions',
    description: 'Intelligent code refactoring, layout realignment, automated accessibility improvements, and modern responsiveness fixes for existing sites.',
    details: [
      'Quick diagnosis of broken responsive containers and CSS bugs',
      'Automated image compression and modern WebP asset conversion',
      'Content restructuring using AI summarization and human editorial judgment',
      'Rapid turnaround fixes for urgent client requests and campaign launches',
    ],
    icon: 'Sliders',
    deliverables: 'Revamped, error-free website with improved speed scores and layout consistency',
  },
  {
    id: 'ai-video-creation',
    title: 'AI Video Creation',
    category: 'ai',
    categoryLabel: 'AI Solutions',
    description: 'High-energy short-form promotional videos, dynamic typography reels, product teaser clips, and natural voiceovers for social media.',
    details: [
      'Vertical 9:16 video generation optimized for Instagram Reels, Shorts & TikTok',
      'Synchronized kinetic animated captions with highlight effects',
      'Natural AI studio-grade voiceover narration using ElevenLabs',
      'Licensed background music mixing and visual pacing transitions',
    ],
    icon: 'Video',
    deliverables: 'Ready-to-post MP4 videos with animated captions, background music, and voiceover',
  },
  {
    id: 'ai-content-design',
    title: 'AI-Powered Design & Content',
    category: 'ai',
    categoryLabel: 'AI Solutions',
    description: 'Curated generative workflows blending Midjourney, Ideogram, Gemini, and Claude for bespoke brand imagery, copy drafting, and marketing concepts.',
    details: [
      'Custom prompt engineering for consistent brand tone and visual style',
      'Rapid ideation of color moods, illustrative hero art, and marketing concepts',
      'Multilingual copywriting drafting and localized ad copy variations',
      'Human art direction ensuring zero generic clichés and strict quality standards',
    ],
    icon: 'Sparkles',
    deliverables: 'Exclusive generative asset packages refined and vetted by a professional designer',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // Real, verified client projects — full A-to-Z website builds (design +
  // development). Each liveUrl was checked live; descriptions are kept to
  // what's publicly verifiable (industry, location, site type) rather than
  // specific internal details that can't be confirmed from the outside.
  // Exact turnaround times below are a placeholder ("Full A–Z Delivery") —
  // replace with your real per-project timelines whenever you have them.
  {
    id: 'project-gsb-contracting',
    title: 'Green System Building Contracting — Corporate Website',
    category: 'WordPress',
    shortDesc: 'Full corporate website for a Dubai building contracting & engineering company, covering their services and project portfolio.',
    fullDesc: 'Designed and built the complete corporate website for Green System Building Contracting, a Dubai-based building contracting and engineering company. The site covers their service lines, company profile, and client inquiry pathway on a WordPress/Elementor foundation.',
    clientType: 'Construction & Contracting Company',
    timeline: 'Full A–Z Delivery',
    toolsUsed: ['WordPress', 'Elementor Pro'],
    deliverables: ['Complete Website Design & Development', 'Service & Company Profile Pages', 'Mobile-Responsive Layout', 'Contact/Inquiry Forms'],
    image: ASSETS.websiteShowcase,
    isConcept: false,
    liveUrl: 'https://gsbccontracting.com/',
  },
  {
    id: 'project-quick-speed-movers',
    title: 'Quick Speed Movers — Moving & Relocation Website',
    category: 'WordPress',
    shortDesc: 'Full website for a UAE moving and relocation company, built to generate direct quote inquiries from new customers.',
    fullDesc: 'Designed and built the complete website for Quick Speed Movers, a UAE-based moving and relocation company. The site presents their services and makes it easy for visitors to reach out for a moving quote.',
    clientType: 'Moving & Relocation Company',
    timeline: 'Full A–Z Delivery',
    toolsUsed: ['WordPress', 'Elementor Pro'],
    deliverables: ['Complete Website Design & Development', 'Service Pages', 'Mobile-Responsive Layout', 'Quote/Contact Forms'],
    image: ASSETS.workspaceAbout,
    isConcept: false,
    liveUrl: 'https://quickspeedmovers.com/',
  },
  {
    id: 'project-silver-tiger',
    title: 'Silver Tiger Technology — Enterprise Tech Website',
    category: 'WordPress',
    shortDesc: 'Professional corporate website for a Dubai (Business Bay) cybersecurity, AI and enterprise technology company.',
    fullDesc: 'Designed and built the complete corporate website for Silver Tiger Technology, a Dubai-based cybersecurity, AI and enterprise technology company based in Business Bay. The site presents their technology offerings with a polished, enterprise-ready design.',
    clientType: 'Cybersecurity & Enterprise Tech Company',
    timeline: 'Full A–Z Delivery',
    toolsUsed: ['WordPress', 'Elementor Pro'],
    deliverables: ['Complete Website Design & Development', 'Service & Solutions Pages', 'Mobile-Responsive Layout', 'Enterprise-Grade Visual Design'],
    image: ASSETS.aiDigitalArt,
    isConcept: false,
    liveUrl: 'https://silvertiger.ae/',
  },
  {
    id: 'project-hasniah-trading',
    title: 'Hasniah Trading — Building Materials E-Commerce Store',
    category: 'WordPress',
    shortDesc: 'Full e-commerce store for a Sharjah building materials & ceramic profiles trading company, family-run since 1981.',
    fullDesc: 'Designed and built the complete e-commerce store for Hasniah Trading, a Sharjah-based building materials and ceramic profiles supplier that has been family-run since 1981. The store catalogs their product range for direct online browsing and inquiry.',
    clientType: 'Building Materials Trading Company (E-Commerce)',
    timeline: 'Full A–Z Delivery',
    toolsUsed: ['WordPress', 'WooCommerce', 'Elementor Pro'],
    deliverables: ['Complete E-Commerce Store', 'Product Catalog Setup', 'Mobile-Responsive Layout', 'Inquiry/Contact Integration'],
    image: ASSETS.websiteShowcase,
    isConcept: false,
    liveUrl: 'https://hasniahtrading.com/',
  },
  {
    id: 'project-ia-movers',
    title: 'IA Movers And Packers — Moving Company Website',
    category: 'WordPress',
    shortDesc: 'Full website for an Abu Dhabi movers & packers company, including dedicated service pages such as villa moving.',
    fullDesc: 'Designed and built the complete website for IA Movers And Packers, an Abu Dhabi-based moving and packing company, including dedicated pages for specific services such as villa relocation.',
    clientType: 'Moving & Packing Company',
    timeline: 'Full A–Z Delivery',
    toolsUsed: ['WordPress', 'Elementor Pro'],
    deliverables: ['Complete Website Design & Development', 'Dedicated Service Pages', 'Mobile-Responsive Layout', 'Contact/Inquiry Forms'],
    image: ASSETS.workspaceAbout,
    isConcept: false,
    liveUrl: 'https://iamoversandpackers.com/',
  },

  // Original design samples — clearly labeled "Concept Sample" in the UI
  // (not real client work) so Canva/Content/AI Solutions categories aren't
  // empty. Replace these with real examples as soon as you have them.
  {
    id: 'project-canva-branding',
    title: 'Aesthetic Real Estate & Brand Collateral Kit',
    category: 'Canva',
    shortDesc: '30+ editable Canva templates including property brochures, open-house flyers, and Instagram story highlight cards.',
    fullDesc: 'A concept visual identity system for independent real estate agents — modern bento-style property highlight sheets, client testimonial carousels, and print-ready neighborhood guides formatted for effortless editing.',
    clientType: 'Real Estate Agency & Realtors (Concept)',
    timeline: '5 Days Turnaround',
    toolsUsed: ['Canva Pro', 'Adobe Photoshop', 'Typography System', 'Brand Style Guide'],
    deliverables: ['30+ Master Canva Templates', 'Print-Ready A4/US Letter PDFs', 'Social Media Grid Guide', 'Color Palette Swatches'],
    image: ASSETS.canvaBranding,
    isConcept: true,
  },
  {
    id: 'project-seo-articles',
    title: 'EcoLiving Magazine — Organic SEO Hub',
    category: 'Content',
    shortDesc: 'A cluster of 12 thoroughly researched, keyword-optimized articles on sustainable architecture and renewable living.',
    fullDesc: 'A concept pillar-and-cluster content suite targeting high-intent eco-friendly consumer search queries — structured headings, meta descriptions, FAQ schema formatting, and internal link architecture.',
    clientType: 'Sustainable Living Publisher (Concept)',
    timeline: '2 Weeks Turnaround',
    toolsUsed: ['Google Search Console', 'SurferSEO', 'Claude', 'Human Editorial'],
    deliverables: ['12 Long-form Articles (1500+ words)', 'Keyword Mapping Sheet', 'Meta Descriptions', 'Internal Link Blueprint'],
    image: ASSETS.workspaceAbout,
    isConcept: true,
  },
  {
    id: 'project-ai-creative',
    title: 'Synapse Digital — AI Creative Studio Workflow',
    category: 'AI Solutions',
    shortDesc: 'AI-assisted design system, website structure, and high-resolution generative marketing assets with human art direction.',
    fullDesc: 'A concept exploration of AI-assisted digital agency workflows — combining prompt engineering with hands-on UI craft to generate dark teal visual themes, intelligent content structures, and modern vector iconography for a technology consultancy.',
    clientType: 'Technology Consultancy (Concept)',
    timeline: '10 Days Turnaround',
    toolsUsed: ['Gemini AI', 'ChatGPT-4', 'Midjourney / Ideogram', 'WordPress', 'CSS3'],
    deliverables: ['Full Interactive Showcase', 'Asset Library', 'Generative Concept Suite', 'Clean Web Code'],
    image: ASSETS.aiDigitalArt,
    isConcept: true,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    tagline: 'Listening & Clarifying Requirements',
    description: 'We begin with a focused conversation to understand your business goals, target audience, brand aesthetic, and specific project deliverables. No guesswork.',
    deliverables: ['Briefing summary', 'Project scope checklist', 'Content & asset requirements'],
  },
  {
    number: '02',
    title: 'Plan',
    tagline: 'Architecture & Visual Direction',
    description: 'Creating the structural wireframe, page hierarchy, color palette, and typography blueprint before building. You approve the direction before development starts.',
    deliverables: ['Site map / layout outline', 'Brand moodboard & font selections', 'Milestone timeline'],
  },
  {
    number: '03',
    title: 'Build',
    tagline: 'Design & Development Execution',
    description: 'Bringing the concept to life in WordPress, Elementor, or Canva. Every element is tested for responsive layout across mobile, tablet, and widescreen monitors.',
    deliverables: ['Full interactive website build', 'Custom graphics & template links', 'Cross-browser testing'],
  },
  {
    number: '04',
    title: 'Refine & Deliver',
    tagline: 'Polishing & Launch Handover',
    description: 'We review the project together, make fine adjustments, set up domain/hosting if needed, and provide clear video documentation so you feel 100% in control.',
    deliverables: ['Live deployment on your hosting', 'Handover tutorial video', '30-day post-launch support'],
  },
];

export const VALUE_CARDS: ValueCard[] = [
  {
    title: 'Modern Design',
    description: 'Clean editorial aesthetics, balanced whitespace, and purposeful typography that give your brand international credibility.',
    icon: 'Sparkles',
  },
  {
    title: 'Responsive Layouts',
    description: 'Flawless presentation on mobile phones, tablets, laptops, and 4K desktop screens without broken containers or tiny text.',
    icon: 'Smartphone',
  },
  {
    title: 'Clear Communication',
    description: 'Direct, honest updates at every stage. Prompt answers to your questions and realistic delivery timelines you can rely on.',
    icon: 'MessageSquare',
  },
  {
    title: 'Business-Focused Work',
    description: 'Every button, form, and page layout is engineered around real business outcomes: inquiries, bookings, and sales.',
    icon: 'Target',
  },
  {
    title: 'AI-Assisted Workflows',
    description: 'We harness modern AI tools for faster prototyping, clean drafting, and research—backed by strict human QA and creative direction.',
    icon: 'Cpu',
  },
  {
    title: 'Attention to Detail',
    description: 'Proper spacing, image compression for blazing speed, SEO meta tags, and clean code that is easy to maintain long-term.',
    icon: 'CheckCircle2',
  },
];

export const AI_TOOLS: AITool[] = [
  {
    name: 'ChatGPT',
    role: 'Structure & Ideation',
    useCase: 'Rapid content outline brainstorming, user persona research, and prompt engineering.',
    badge: 'Content & Logic',
    category: 'ai',
  },
  {
    name: 'Claude',
    role: 'Editorial Tone & Clarity',
    useCase: 'In-depth long-form writing refinement, brand voice consistency, and structured documentation.',
    badge: 'Writing & Research',
    category: 'ai',
  },
  {
    name: 'Antigravity',
    role: 'Agentic AI Workflows',
    useCase: 'Automated workflow orchestration, code synthesis, and smart digital asset pipelines.',
    badge: 'AI Automation',
    category: 'ai',
  },
  {
    name: 'ElevenLabs',
    role: 'Studio-Grade Voiceovers',
    useCase: 'Realistic, emotional voiceover narration for promotional video reels, explainer teasers, and courses.',
    badge: 'Voice & Audio',
    category: 'ai',
  },
  {
    name: 'Gemini',
    role: 'Multimodal Research',
    useCase: 'Analyzing visual design trends, fast competitive research, and visual layout ideation.',
    badge: 'Multimodal AI',
    category: 'ai',
  },
  {
    name: 'Microsoft Copilot',
    role: 'Productivity & Office',
    useCase: 'Document generation, client intake form organization, and presentation drafting.',
    badge: 'Productivity',
    category: 'ai',
  },
  {
    name: 'Adobe Express AI',
    role: 'Generative Graphic Assets',
    useCase: 'Background generation, precise cutout masking, and social banner rapid sizing.',
    badge: 'Visual Design',
    category: 'ai',
  },
  {
    name: 'CapCut AI',
    role: 'Short-Form Video',
    useCase: 'Dynamic auto-captions, pacing cuts, and promotional video clips for Instagram & TikTok.',
    badge: 'Video & Motion',
    category: 'ai',
  },
  {
    name: 'Ideogram',
    role: 'Typographic Concept Art',
    useCase: 'High-clarity visual concept generation with legible text rendering for moodboards.',
    badge: 'Concept Art',
    category: 'ai',
  },
  {
    name: 'WordPress',
    role: 'Content Management System',
    useCase: 'Industry-standard open source CMS powering robust, dynamic, and client-editable websites.',
    badge: 'Core CMS',
    category: 'web',
  },
  {
    name: 'Elementor & Elementor Pro',
    role: 'Visual Builder Architecture',
    useCase: 'Drag-and-drop visual page creation, theme builder template design, and responsive breakpoint tuning.',
    badge: 'Web Builder',
    category: 'web',
  },
  {
    name: 'Canva & Canva Pro',
    role: 'Brand & Template Design',
    useCase: 'Client-friendly editable template packs, social carousel design, ebooks, flyers, and branding suites.',
    badge: 'Design Suite',
    category: 'design',
  },
  {
    name: 'Hostinger & cPanel',
    role: 'Hosting, DNS & SSL',
    useCase: 'Secure web hosting deployment, nameserver propagation, SSL configuration, and business email setup.',
    badge: 'Infrastructure',
    category: 'productivity',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Website & CMS Development',
    subtitle: 'High-performance, client-manageable web platforms built for speed, security, and conversions.',
    icon: 'Globe',
    skills: [
      {
        name: 'WordPress Development',
        level: 'Expert',
        description: 'Complete website builds, theme installations, child themes, and database optimization.',
      },
      {
        name: 'Elementor & Elementor Pro',
        level: 'Expert',
        description: 'Custom theme builder templates, dynamic query loops, popups, and visual styling.',
      },
      {
        name: 'WooCommerce Storefronts',
        level: 'Advanced',
        description: 'Payment gateway integration (Stripe, PayPal), product catalogs, shipping matrices, and checkout flows.',
      },
      {
        name: 'Responsive Mobile Optimization',
        level: 'Expert',
        description: 'Pixel-perfect rendering across iOS, Android, tablets, and ultra-wide screens.',
      },
      {
        name: 'DNS, SSL & Hosting Setup',
        level: 'Advanced',
        description: 'Hostinger, Namecheap, Cloudflare, cPanel, SSL certificates, and professional business emails.',
      },
      {
        name: 'Website Speed & Core Web Vitals',
        level: 'Advanced',
        description: 'Asset minification, caching configuration, lazy loading, and database cleanup.',
      },
    ],
  },
  {
    title: 'Graphic & Canva Design',
    subtitle: 'Clean visual identity systems and editable master templates that empower your team daily.',
    icon: 'Palette',
    skills: [
      {
        name: 'Canva Pro Template Systems',
        level: 'Expert',
        description: 'Master editable files with locked brand elements, color swatches, and clear guidelines.',
      },
      {
        name: 'Social Media Posts & Carousels',
        level: 'Expert',
        description: 'Seamless multi-slide carousels, quotation cards, and stat visualizers for LinkedIn & Instagram.',
      },
      {
        name: 'Ebooks, Workbooks & Lead Magnets',
        level: 'Expert',
        description: 'Multi-page publications with interactive form fields, clickable tables of contents, and covers.',
      },
      {
        name: 'Flyers, Posters & Print Collateral',
        level: 'Advanced',
        description: 'High-resolution CMYK print designs with bleed lines, crop marks, and scannable QR codes.',
      },
      {
        name: 'Real Estate Marketing Kits',
        level: 'Advanced',
        description: 'Luxury property feature sheets, open house cards, and realtor brand identity packages.',
      },
      {
        name: 'Brand Style Guidelines',
        level: 'Advanced',
        description: 'Typographic pairings, primary/secondary color palettes, and visual hierarchy frameworks.',
      },
    ],
  },
  {
    title: 'Content Writing & SEO Marketing',
    subtitle: 'Engaging, human-crafted editorial prose and strategic distribution across organic channels.',
    icon: 'PenTool',
    skills: [
      {
        name: 'SEO Content Writing',
        level: 'Advanced',
        description: 'Intent-targeted blog articles, service pages, and pillar-and-cluster educational content.',
      },
      {
        name: 'On-Page SEO Optimization',
        level: 'Advanced',
        description: 'Strategic H1/H2 hierarchy, internal link mapping, meta titles, and click-optimized snippets.',
      },
      {
        name: 'Pinterest Marketing & Pin SEO',
        level: 'Advanced',
        description: 'High-converting 2:3 vertical pins, keyword-rich board architecture, and continuous traffic funnels.',
      },
      {
        name: 'Social Media Management',
        level: 'Advanced',
        description: 'Monthly editorial calendars, engaging caption writing, hashtag curation, and performance insights.',
      },
      {
        name: 'Conversion Copywriting',
        level: 'Advanced',
        description: 'Compelling landing page headlines, benefit-driven bullets, and friction-reducing CTAs.',
      },
    ],
  },
  {
    title: 'AI Workflows & Next-Gen Productivity',
    subtitle: 'Leveraging cutting-edge artificial intelligence for accelerated delivery with strict human quality control.',
    icon: 'Cpu',
    skills: [
      {
        name: 'AI-Assisted Web Scaffolding',
        level: 'Expert',
        description: 'Compressing wireframe and layout prototyping from weeks into days using smart AI toolsets.',
      },
      {
        name: 'Generative Concept Art & Moodboards',
        level: 'Advanced',
        description: 'Rapid exploration of visual styles and brand color themes using Midjourney, Ideogram, and Gemini.',
      },
      {
        name: 'AI Video Editing & Auto-Captions',
        level: 'Advanced',
        description: 'Producing dynamic 9:16 short-form reels with synchronized captions and CapCut AI.',
      },
      {
        name: 'Studio Voiceover Integration',
        level: 'Advanced',
        description: 'High-fidelity audio narration using ElevenLabs for explainer videos and product intros.',
      },
      {
        name: 'Human-in-the-Loop Quality Assurance',
        level: 'Expert',
        description: 'Refining every AI output with strict manual fact-checking, brand voice calibration, and design polish.',
      },
    ],
  },
];
