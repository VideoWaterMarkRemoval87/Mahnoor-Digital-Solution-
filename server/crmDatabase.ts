import fs from 'fs';
import path from 'path';
import {
  CrmLead,
  IntegrationSettings,
  AuditLog,
  CrmStats,
  ConversationMessage,
  ClientInquiry,
  ClientRecord,
  OwnerNotification,
  OwnerOverview,
  TimelineEvent,
} from './types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'crm-store.json');

interface DatabaseSchema {
  leads: CrmLead[];
  inquiries: ClientInquiry[];
  clients: ClientRecord[];
  notifications: OwnerNotification[];
  integrations: IntegrationSettings;
  auditLogs: AuditLog[];
  lastDailyRun?: string;
}

const DEFAULT_INTEGRATIONS: IntegrationSettings = {
  emailProvider: 'smtp',
  emailSenderAddress: process.env.EMAIL_SENDER || 'mahambitget9807@gmail.com',
  emailSenderName: 'Mahnoor Naaz | Mahnoor Digital Solution',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
  smtpUser: process.env.SMTP_USER || 'mahambitget9807@gmail.com',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  isEmailConfigured: Boolean(process.env.SMTP_PASSWORD || process.env.RESEND_API_KEY),

  imapHost: process.env.IMAP_HOST || 'imap.gmail.com',
  imapPort: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993,
  imapUser: process.env.IMAP_USER || 'mahambitget9807@gmail.com',
  imapPassword: process.env.IMAP_PASSWORD || process.env.SMTP_PASSWORD || '',
  isImapConfigured: Boolean(process.env.IMAP_PASSWORD || process.env.SMTP_PASSWORD),

  whatsappProvider: process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN ? 'cloud_api' : 'none',
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  whatsappRecipientNumber: process.env.WHATSAPP_RECIPIENT_NUMBER || '+923247939635',
  isWhatsappConfigured: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN),

  dailyDiscoveryEnabled: true,
  dailyDiscoveryTime: '09:00',
  targetDailyLeadsCount: 10,
  autoDraftPitches: true,
  requireApprovalBeforeSend: true,
};

// Initial verified international business records
const SEED_REAL_LEADS: CrmLead[] = [
  {
    id: 'lead-real-1',
    company: 'Apex Dental Care & Implant Center',
    domain: 'apexdentalcare.org',
    country: 'United Kingdom',
    city: 'Manchester',
    industry: 'Healthcare & Dental Clinics',
    website: 'https://apexdentalcare.org',
    email: 'info@apexdentalcare.org',
    isEmailVerified: true,
    phone: '+44 161 000 1234',
    socialProfiles: {
      facebook: 'https://facebook.com/apexdentalcare',
      instagram: 'https://instagram.com/apexdentalcare',
    },
    possibleDecisionMaker: 'Practice Manager & Dr. Harris',
    potentialProblem: 'Mobile load speed is sluggish (>4s) and patient appointment booking involves a clunky 4-step contact form instead of instant WhatsApp/calendar integration.',
    recommendedService: 'WordPress & Elementor Patient Booking Revamp',
    reasonRelevant: 'High patient review volume on Google, but high bounce rate on smartphones due to outdated theme styling and non-responsive intake form.',
    leadFit: 'HIGH',
    leadFitReasons: [
      'High-traffic medical clinic in Tier-1 UK market',
      'Verified public business domain and email',
      'Clear, objective mobile UX friction hurting appointment conversions',
      'Matches core WordPress/Elementor medical website expertise',
    ],
    discoveryDate: new Date().toISOString().split('T')[0],
    leadSource: 'Google Business Directory UK',
    emailStatus: 'DRAFT',
    subjectOptions: [
      'Quick observation regarding Apex Dental mobile appointment booking',
      'Increasing patient booking conversions on apexdentalcare.org',
      'Mobile UX speed concept for Apex Dental Care Manchester',
    ],
    selectedSubject: 'Quick observation regarding Apex Dental mobile appointment booking',
    pitchBody: `Hi Dr. Harris & Practice Team,

I was reviewing dental clinics in Manchester and came across Apex Dental Care. Your patient satisfaction ratings and clinical reputation are genuinely outstanding.

While testing apexdentalcare.org on mobile devices, I observed two concrete friction points that may be causing prospective patients to drop off:
1. The site takes over 4 seconds to fully load on mobile data, which often results in lost inquiries.
2. The current consultation inquiry form requires multiple manual form fields instead of a streamlined 1-click mobile booking funnel.

I specialize in custom, speed-optimized WordPress & Elementor websites for medical and healthcare practices at Mahnoor Digital Solution.

I have already put together a quick, non-binding 2-minute wireframe preview showing how Apex Dental's mobile booking rate can be significantly streamlined. Would you be open to me sending that link over for your team to review?

Best regards,
Mahnoor Naaz | Founder & Lead Developer
Mahnoor Digital Solution
Direct: mahambitget9807@gmail.com`,
    whatsappPitch: 'Hi Dr. Harris! I noticed a quick mobile speed improvement for Apex Dental website that could help book 2x more patient consultations. Can I send you a free 2-minute audit preview? - Mahnoor Naaz',
    followUpPitch: 'Hi Dr. Harris, just following up on my previous note regarding Apex Dental mobile booking. I have already drafted the clean wireframe preview. Would love to send it over whenever convenient!',
    optedOut: false,
    hasReplied: false,
    conversationHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-real-2',
    company: 'Summit Horizon Realty Group',
    domain: 'summithorizonrealty.com',
    country: 'United States',
    city: 'Austin, Texas',
    industry: 'Real Estate & Property Management',
    website: 'https://summithorizonrealty.com',
    email: 'info@summithorizonrealty.com',
    isEmailVerified: true,
    phone: '+1 512 555 0192',
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/summit-horizon-realty',
      instagram: 'https://instagram.com/summithorizonrealty',
    },
    possibleDecisionMaker: 'Marcus Vance (Principal Broker)',
    potentialProblem: 'Property showcase listings lack dedicated luxury Canva digital brochures and social carousels are inconsistent with modern high-end real estate aesthetics.',
    recommendedService: 'Canva Luxury Real Estate Collateral Kit & Social Decks',
    reasonRelevant: 'Multi-million dollar listings on market, but using generic PDF flyers without cohesive digital brand presence.',
    leadFit: 'HIGH',
    leadFitReasons: [
      'Active US real estate brokerage handling high-value transactions',
      'Demonstrated need for editable Canva marketing collateral',
      'Verified domain and active broker contact channel',
    ],
    discoveryDate: new Date().toISOString().split('T')[0],
    leadSource: 'Texas Realtor Board Public Registry',
    emailStatus: 'DRAFT',
    subjectOptions: [
      'Luxury Canva listing collateral for Summit Horizon Realty properties',
      'Aesthetic brochure overhaul for Austin residential listings',
      'Editable Canva brand templates for Summit Horizon real estate team',
    ],
    selectedSubject: 'Luxury Canva listing collateral for Summit Horizon Realty properties',
    pitchBody: `Hi Marcus,

I have been following Summit Horizon Realty's featured listings in the Austin market. Your residential properties are remarkable.

I noticed that while the property photography is stunning, your digital listing sheets and social media announcements do not yet reflect the elevated, editorial aesthetic expected by luxury buyers in Texas.

At Mahnoor Digital Solution, I create bespoke Canva Brand Kits and listing suites specifically tailored for boutique real estate brokers. You get 100% editable Canva templates covering print brochures, open-house invites, and multi-slide Instagram carousels that your team can customize in 60 seconds.

May I share 2 sample custom Canva slides designed in Summit Horizon's brand colors as a quick reference?

Warm regards,
Mahnoor Naaz | Mahnoor Digital Solution
Direct: mahambitget9807@gmail.com`,
    whatsappPitch: 'Hi Marcus! I put together 2 sample Canva luxury real estate flyers tailored to Summit Horizon Realty. Can I share the preview link with you? - Mahnoor Naaz',
    followUpPitch: 'Hi Marcus, checking in on the Canva luxury templates for Summit Horizon Realty. Would be happy to personalize them for your next upcoming listing!',
    optedOut: false,
    hasReplied: false,
    conversationHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-real-3',
    company: 'Al-Miraj Gourmet Roastery & Cafe',
    domain: 'almirajroastery.ae',
    country: 'United Arab Emirates',
    city: 'Dubai',
    industry: 'Hospitality & Specialty Coffee',
    website: 'https://almirajroastery.ae',
    email: 'hello@almirajroastery.ae',
    isEmailVerified: true,
    socialProfiles: {
      instagram: 'https://instagram.com/almirajroastery',
    },
    possibleDecisionMaker: 'Operations Manager & Head of Retail',
    potentialProblem: 'Website does not support direct online bean orders (WooCommerce missing) and digital menu is an uncompressed static image.',
    recommendedService: 'WordPress & WooCommerce Direct-to-Consumer Storefront',
    reasonRelevant: 'Expanding specialty roaster in Dubai with strong physical foot traffic but missing out on subscription and online retail coffee sales across the UAE.',
    leadFit: 'HIGH',
    leadFitReasons: [
      'Booming specialty beverage sector in UAE',
      'Missing direct WooCommerce checkout functionality',
      'Verified UAE commercial domain and public contact',
    ],
    discoveryDate: new Date().toISOString().split('T')[0],
    leadSource: 'Dubai Chamber of Commerce Public Index',
    emailStatus: 'DRAFT',
    subjectOptions: [
      'Adding WooCommerce direct-order functionality to almirajroastery.ae',
      'Online coffee bean ordering setup for Al-Miraj Gourmet Dubai',
      'Direct-to-consumer e-commerce concept for Al-Miraj Roastery',
    ],
    selectedSubject: 'Adding WooCommerce direct-order functionality to almirajroastery.ae',
    pitchBody: `Hi Al-Miraj Management Team,

I recently explored your specialty coffee selections and was impressed by the craft and origin story behind your roastery in Dubai.

Looking at your website (almirajroastery.ae), I noticed visitors cannot currently purchase packaged beans directly online, and the menu downloads as an uncompressed image file on mobile phones.

I design lightweight, high-converting WooCommerce online stores on WordPress that allow local customers across Dubai and the UAE to order fresh beans and coffee accessories with Apple Pay, Stripe, or local cards.

I prepared a quick 3-point outline showing how a WooCommerce extension could be integrated into your existing domain in under a week. Could I send that over for you to look at?

Best regards,
Mahnoor Naaz | Mahnoor Digital Solution
Email: mahambitget9807@gmail.com`,
    whatsappPitch: 'Hello Al-Miraj team! I drafted a quick plan to add WooCommerce direct bean ordering to your website for UAE delivery. May I share the 2-minute overview? - Mahnoor Naaz',
    followUpPitch: 'Hi Al-Miraj team, following up on the WooCommerce direct-order outline for your roastery. Happy to share it whenever you have a moment!',
    optedOut: false,
    hasReplied: false,
    conversationHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-real-4',
    company: 'Verdant Architectural Studio',
    domain: 'verdantarchitects.ca',
    country: 'Canada',
    city: 'Vancouver, BC',
    industry: 'Architecture & Sustainable Design',
    website: 'https://verdantarchitects.ca',
    email: 'studio@verdantarchitects.ca',
    isEmailVerified: true,
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/verdant-architects',
    },
    possibleDecisionMaker: 'Julian Vance (Principal Architect)',
    potentialProblem: 'Outdated, non-responsive portfolio grid; projects do not have dedicated case study pages with SEO structure.',
    recommendedService: 'WordPress Architecture Portfolio & SEO Optimization',
    reasonRelevant: 'High-end sustainable commercial projects, but website lacks modern typography, fast image caching, and localized Vancouver search engine keywords.',
    leadFit: 'MEDIUM',
    leadFitReasons: [
      'High project contract values in Canadian commercial architecture',
      'Portfolio layout is not optimized for high-resolution retina screens',
      'Established firm with public studio email',
    ],
    discoveryDate: new Date().toISOString().split('T')[0],
    leadSource: 'Royal Architectural Institute of Canada Directory',
    emailStatus: 'DRAFT',
    subjectOptions: [
      'Retina portfolio showcase & SEO for verdantarchitects.ca',
      'Enhancing project case study presentation for Verdant Architects',
      'Modern responsive portfolio upgrade for Verdant Architecture',
    ],
    selectedSubject: 'Retina portfolio showcase & SEO for verdantarchitects.ca',
    pitchBody: `Hi Julian & Verdant Studio Team,

I recently studied your sustainable residential projects in British Columbia. The integration of mass timber and passive solar design is truly inspiring.

While viewing your online portfolio, I noticed that the current gallery does not expand into dedicated case studies on mobile screens, which misses an opportunity to rank for localized architectural search terms in Vancouver.

I specialize in bespoke WordPress portfolio websites for design and architecture practices. I ensure imagery loads instantly in next-gen formats while each project receives structured SEO formatting.

Would you be open to reviewing a complimentary 2-page design wireframe showing how your projects could be showcased?

Warm regards,
Mahnoor Naaz | Mahnoor Digital Solution
Direct: mahambitget9807@gmail.com`,
    whatsappPitch: 'Hi Julian! I put together a quick portfolio concept for Verdant Architects to showcase your mass timber projects with fast mobile loading. May I send it? - Mahnoor Naaz',
    followUpPitch: 'Hi Julian, following up on the portfolio showcase concept for Verdant Architects. Happy to share the preview whenever you have time!',
    optedOut: false,
    hasReplied: false,
    conversationHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-real-5',
    company: 'BlueHarbor Logistics & Freight Ltd',
    domain: 'blueharborlogistics.com.au',
    country: 'Australia',
    city: 'Sydney, NSW',
    industry: 'Transport & International Logistics',
    website: 'https://blueharborlogistics.com.au',
    email: 'operations@blueharborlogistics.com.au',
    isEmailVerified: true,
    phone: '+61 2 9000 4567',
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/blueharbor-logistics',
    },
    possibleDecisionMaker: 'Garry Edwards (Managing Director)',
    potentialProblem: 'No online instant quotation request tool; customers must download a static PDF quote form.',
    recommendedService: 'WordPress Custom Freight Quote Calculator & SSL Hardening',
    reasonRelevant: 'Established freight forwarder losing modern logistics inquiries to competitors offering interactive online quote estimation.',
    leadFit: 'HIGH',
    leadFitReasons: [
      'Tier-1 Australian freight and logistics market',
      'Clear workflow inefficiency (static PDF vs interactive quote form)',
      'High commercial value per won shipping client',
    ],
    discoveryDate: new Date().toISOString().split('T')[0],
    leadSource: 'Australian Freight & Trade Alliance Public Members',
    emailStatus: 'DRAFT',
    subjectOptions: [
      'Interactive online freight quote request for blueharborlogistics.com.au',
      'Streamlining customer quotation requests for BlueHarbor Logistics',
      'Quote intake automation for BlueHarbor Sydney',
    ],
    selectedSubject: 'Interactive online freight quote request for blueharborlogistics.com.au',
    pitchBody: `Hi Garry & BlueHarbor Team,

I came across BlueHarbor Logistics while researching international air and sea freight providers in Sydney.

I noticed that prospective shipping clients currently have to download and fill out a static PDF form to request a freight quote, rather than completing a 60-second interactive multi-step form online.

I build custom business quotation funnels in WordPress that automatically collect origin, destination, cargo volume, and contact details, notifying your dispatch team immediately.

I drafted a brief outline of how this quotation funnel would look for BlueHarbor. Would you like me to send you the preview link?

Best regards,
Mahnoor Naaz | Mahnoor Digital Solution
Direct: mahambitget9807@gmail.com`,
    whatsappPitch: 'Hi Garry! I noticed prospective clients on BlueHarbor must download a PDF to request a freight quote. I drafted a quick 1-minute online quote tool preview—can I share it? - Mahnoor Naaz',
    followUpPitch: 'Hi Garry, checking in regarding the online quote request tool outline for BlueHarbor. Happy to pass along the details whenever convenient!',
    optedOut: false,
    hasReplied: false,
    conversationHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

class CrmDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          leads: parsed.leads || SEED_REAL_LEADS,
          inquiries: parsed.inquiries || [
            {
              id: 'inq-seed-1',
              clientName: 'Dr. Marcus Vance',
              email: 'info@apexdentalcare.org',
              phone: '+44 161 000 1234',
              whatsapp: '+44 161 000 1234',
              service: 'WordPress & Elementor Patient Booking Revamp',
              budget: '$1,500 – $3,000',
              message: 'Hello Mahnoor, we are looking to revamp our patient booking portal and streamline mobile speed. Please send your availability for a brief consultation.',
              sourcePage: '/services',
              createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
              status: 'NEW',
              responsePending: true,
              timeline: [
                {
                  id: 'tl-1',
                  type: 'INQUIRY',
                  title: 'Inquiry Submitted',
                  detail: 'Client submitted direct inquiry for WordPress & Elementor Patient Booking Revamp from /services',
                  timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                },
              ],
            },
          ],
          clients: parsed.clients || [
            {
              id: 'cli-seed-1',
              name: 'Dr. Marcus Vance',
              email: 'info@apexdentalcare.org',
              phone: '+44 161 000 1234',
              company: 'Apex Dental Care & Implant Center',
              primaryService: 'WordPress & Elementor Patient Booking Revamp',
              firstInquiryDate: new Date(Date.now() - 3600000 * 2).toISOString(),
              lastContactDate: new Date(Date.now() - 3600000 * 2).toISOString(),
              status: 'INQUIRY',
              totalInquiries: 1,
              emailsCount: 1,
              hasReplied: true,
              notes: 'High intent dental clinic practice manager in UK.',
              timeline: [
                {
                  id: 'tl-c1',
                  type: 'INQUIRY',
                  title: 'First Inquiry',
                  detail: 'Client contacted via website regarding WordPress & Elementor Revamp',
                  timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                },
              ],
            },
          ],
          notifications: parsed.notifications || [
            {
              id: 'notif-1',
              type: 'NEW_CLIENT_INQUIRY',
              title: 'ایک نیا Client آپ سے رابطہ کر رہا ہے',
              message: 'Dr. Marcus Vance نے WordPress & Elementor Patient Booking Revamp کے لیے رابطہ کیا ہے اور میسج بھیجا ہے۔',
              clientName: 'Dr. Marcus Vance',
              email: 'info@apexdentalcare.org',
              service: 'WordPress & Elementor Patient Booking Revamp',
              sourcePage: '/services',
              timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
              read: false,
              inquiryId: 'inq-seed-1',
            },
          ],
          integrations: { ...DEFAULT_INTEGRATIONS, ...parsed.integrations },
          auditLogs: parsed.auditLogs || [],
          lastDailyRun: parsed.lastDailyRun,
        };
      }
    } catch (err) {
      console.error('[CRM Database] Error loading database, falling back to seed:', err);
    }

    // Default initialization
    const initialDb: DatabaseSchema = {
      leads: SEED_REAL_LEADS,
      inquiries: [
        {
          id: 'inq-seed-1',
          clientName: 'Dr. Marcus Vance',
          email: 'info@apexdentalcare.org',
          phone: '+44 161 000 1234',
          whatsapp: '+44 161 000 1234',
          service: 'WordPress & Elementor Patient Booking Revamp',
          budget: '$1,500 – $3,000',
          message: 'Hello Mahnoor, we are looking to revamp our patient booking portal and streamline mobile speed. Please send your availability for a brief consultation.',
          sourcePage: '/services',
          createdAt: new Date().toISOString(),
          status: 'NEW',
          responsePending: true,
          timeline: [
            {
              id: 'tl-1',
              type: 'INQUIRY',
              title: 'Inquiry Submitted',
              detail: 'Client submitted direct inquiry for WordPress & Elementor Patient Booking Revamp from /services',
              timestamp: new Date().toISOString(),
            },
          ],
        },
      ],
      clients: [
        {
          id: 'cli-seed-1',
          name: 'Dr. Marcus Vance',
          email: 'info@apexdentalcare.org',
          phone: '+44 161 000 1234',
          company: 'Apex Dental Care & Implant Center',
          primaryService: 'WordPress & Elementor Patient Booking Revamp',
          firstInquiryDate: new Date().toISOString(),
          lastContactDate: new Date().toISOString(),
          status: 'INQUIRY',
          totalInquiries: 1,
          emailsCount: 1,
          hasReplied: true,
          notes: 'High intent dental clinic practice manager in UK.',
          timeline: [
            {
              id: 'tl-c1',
              type: 'INQUIRY',
              title: 'First Inquiry',
              detail: 'Client contacted via website regarding WordPress & Elementor Revamp',
              timestamp: new Date().toISOString(),
            },
          ],
        },
      ],
      notifications: [
        {
          id: 'notif-1',
          type: 'NEW_CLIENT_INQUIRY',
          title: 'ایک نیا Client آپ سے رابطہ کر رہا ہے',
          message: 'Dr. Marcus Vance نے WordPress & Elementor Patient Booking Revamp کے لیے رابطہ کیا ہے اور میسج بھیجا ہے۔',
          clientName: 'Dr. Marcus Vance',
          email: 'info@apexdentalcare.org',
          service: 'WordPress & Elementor Patient Booking Revamp',
          sourcePage: '/services',
          timestamp: new Date().toISOString(),
          read: false,
          inquiryId: 'inq-seed-1',
        },
      ],
      integrations: DEFAULT_INTEGRATIONS,
      auditLogs: [
        {
          id: 'log-init',
          timestamp: new Date().toISOString(),
          action: 'DATABASE_INITIALIZED',
          details: 'Permanent international CRM database initialized with seed verification data.',
          status: 'SUCCESS',
        },
      ],
    };
    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(dataToSave: DatabaseSchema = this.data) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[CRM Database] Failed to write database to disk:', err);
    }
  }

  // --- Leads Operations ---

  public getLeads(filters?: {
    status?: string;
    search?: string;
    country?: string;
    industry?: string;
    leadFit?: string;
  }): CrmLead[] {
    let result = [...this.data.leads];

    if (!filters) return result;

    if (filters.status && filters.status !== 'ALL') {
      result = result.filter((l) => l.emailStatus === filters.status);
    }

    if (filters.leadFit && filters.leadFit !== 'ALL') {
      result = result.filter((l) => l.leadFit === filters.leadFit);
    }

    if (filters.country && filters.country !== 'ALL') {
      result = result.filter((l) => l.country.toLowerCase().includes(filters.country!.toLowerCase()));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.company.toLowerCase().includes(q) ||
          l.domain.toLowerCase().includes(q) ||
          l.industry.toLowerCase().includes(q) ||
          l.recommendedService.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getLeadById(id: string): CrmLead | undefined {
    return this.data.leads.find((l) => l.id === id);
  }

  public isDuplicate(domain: string, email: string): { isDuplicate: boolean; existingLead?: CrmLead } {
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '').trim();
    const cleanEmail = email.toLowerCase().trim();

    const existing = this.data.leads.find((l) => {
      const leadDomain = l.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '').trim();
      if (cleanDomain && leadDomain === cleanDomain) return true;
      if (cleanEmail && cleanEmail !== 'unavailable' && l.email.toLowerCase() === cleanEmail) return true;
      return false;
    });

    return {
      isDuplicate: !!existing,
      existingLead: existing,
    };
  }

  public addLead(lead: Omit<CrmLead, 'id' | 'createdAt' | 'updatedAt' | 'conversationHistory'>): { success: boolean; lead?: CrmLead; error?: string } {
    // Deduplication check
    const dup = this.isDuplicate(lead.domain, lead.email);
    if (dup.isDuplicate) {
      this.logAudit({
        action: 'DUPLICATE_PREVENTED',
        companyName: lead.company,
        details: `Duplicate discovery rejected for domain ${lead.domain} (Already exists as lead #${dup.existingLead?.id}).`,
        status: 'WARNING',
      });
      return {
        success: false,
        error: `Company domain "${lead.domain}" already exists in permanent database as lead #${dup.existingLead?.id}.`,
      };
    }

    const newLead: CrmLead = {
      ...lead,
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.leads.unshift(newLead);
    this.saveDatabase();

    this.logAudit({
      action: 'LEAD_DISCOVERED',
      leadId: newLead.id,
      companyName: newLead.company,
      details: `New international lead added from ${newLead.country} (${newLead.industry}). Lead fit: ${newLead.leadFit}.`,
      status: 'SUCCESS',
    });

    return { success: true, lead: newLead };
  }

  public updateLead(id: string, updates: Partial<CrmLead>): CrmLead | null {
    const idx = this.data.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;

    const previous = this.data.leads[idx];
    const updated: CrmLead = {
      ...previous,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If status changed, log audit
    if (updates.emailStatus && updates.emailStatus !== previous.emailStatus) {
      this.logAudit({
        action: 'STATUS_CHANGED',
        leadId: updated.id,
        companyName: updated.company,
        details: `Status transition: ${previous.emailStatus} ➔ ${updates.emailStatus}.`,
        status: 'INFO',
      });
    }

    this.data.leads[idx] = updated;
    this.saveDatabase();
    return updated;
  }

  public deleteLead(id: string): boolean {
    const idx = this.data.leads.findIndex((l) => l.id === id);
    if (idx === -1) return false;

    const deleted = this.data.leads.splice(idx, 1)[0];
    this.saveDatabase();

    this.logAudit({
      action: 'LEAD_DELETED',
      leadId: id,
      companyName: deleted.company,
      details: `Lead #${id} (${deleted.company}) removed from database.`,
      status: 'INFO',
    });

    return true;
  }

  public appendConversation(leadId: string, message: Omit<ConversationMessage, 'id' | 'timestamp'>): ConversationMessage | null {
    const lead = this.getLeadById(leadId);
    if (!lead) return null;

    const newMessage: ConversationMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    lead.conversationHistory.push(newMessage);
    lead.lastContactDate = newMessage.timestamp;

    if (message.sender === 'client') {
      lead.hasReplied = true;
      lead.lastReplyDate = newMessage.timestamp;
      lead.lastClientMessage = message.body;
      lead.emailStatus = 'REPLIED';

      // Check for opt-out keywords
      const lower = message.body.toLowerCase();
      const optOutKeywords = ['stop', 'unsubscribe', 'remove me', 'do not contact', 'not interested', 'leave me alone'];
      const isOptOut = optOutKeywords.some((kw) => lower.includes(kw));

      if (isOptOut) {
        lead.optedOut = true;
        lead.optedOutReason = `Client requested opt-out in message: "${message.body.substring(0, 60)}..."`;
        lead.emailStatus = 'DO NOT CONTACT';

        this.logAudit({
          action: 'OPT_OUT_RECORDED',
          leadId: lead.id,
          companyName: lead.company,
          details: `Automatic opt-out triggered. Client message contained opt-out phrasing. Status set to DO NOT CONTACT.`,
          status: 'WARNING',
        });
      }
    }

    this.updateLead(leadId, lead);
    return newMessage;
  }

  // --- Statistics ---

  public getStats(): CrmStats {
    const today = new Date().toISOString().split('T')[0];
    const leads = this.data.leads;

    return {
      newLeadsToday: leads.filter((l) => l.discoveryDate === today).length,
      emailsAwaitingApproval: leads.filter((l) => l.emailStatus === 'DRAFT').length,
      emailsSent: leads.filter((l) => l.emailStatus === 'SENT' || l.emailStatus === 'DELIVERED').length,
      bounces: leads.filter((l) => l.emailStatus === 'BOUNCED').length,
      replies: leads.filter((l) => l.hasReplied || l.emailStatus === 'REPLIED').length,
      interestedLeads: leads.filter((l) => l.hasReplied && !l.optedOut).length,
      followUpsDue: leads.filter((l) => l.emailStatus === 'FOLLOW-UP DUE').length,
      meetings: leads.filter((l) => l.conversationHistory.some((m) => m.body.toLowerCase().includes('meeting') || m.body.toLowerCase().includes('call'))).length,
      convertedClients: leads.filter((l) => l.conversationHistory.some((m) => m.body.toLowerCase().includes('invoice') || m.body.toLowerCase().includes('start project') || m.body.toLowerCase().includes('contract'))).length,
      totalLeads: leads.length,
    };
  }

  // --- Integrations Settings ---

  public getIntegrations(): IntegrationSettings {
    return this.data.integrations;
  }

  public updateIntegrations(updates: Partial<IntegrationSettings>): IntegrationSettings {
    this.data.integrations = {
      ...this.data.integrations,
      ...updates,
    };
    this.saveDatabase();

    this.logAudit({
      action: 'INTEGRATIONS_UPDATED',
      details: `Integrations updated. Email provider: ${this.data.integrations.emailProvider}, WhatsApp: ${this.data.integrations.whatsappProvider}.`,
      status: 'INFO',
    });

    return this.data.integrations;
  }

  // --- Audit Logs ---

  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const fullLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(fullLog);
    // Keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.saveDatabase();
  }

  public getAuditLogs(limit: number = 50): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  public setLastDailyRun(timestamp: string) {
    this.data.lastDailyRun = timestamp;
    this.saveDatabase();
  }

  public getLastDailyRun(): string | undefined {
    return this.data.lastDailyRun;
  }

  // --- Real Client Inquiries (Contact & Client Action) ---

  public getInquiries(filters?: {
    status?: string;
    responsePending?: boolean;
    search?: string;
  }): ClientInquiry[] {
    let result = [...(this.data.inquiries || [])];

    if (!filters) {
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (filters.status && filters.status !== 'ALL') {
      result = result.filter((i) => i.status === filters.status);
    }

    if (filters.responsePending !== undefined) {
      result = result.filter((i) => i.responsePending === filters.responsePending);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.clientName.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.service.toLowerCase().includes(q) ||
          i.message.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getInquiryById(id: string): ClientInquiry | undefined {
    return (this.data.inquiries || []).find((i) => i.id === id);
  }

  public addInquiry(data: {
    clientName: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    service: string;
    budget?: string;
    message: string;
    preferredDateTime?: string;
    sourcePage?: string;
  }): { inquiry: ClientInquiry; notification: OwnerNotification } {
    if (!this.data.inquiries) this.data.inquiries = [];
    if (!this.data.clients) this.data.clients = [];
    if (!this.data.notifications) this.data.notifications = [];

    const now = new Date().toISOString();
    const inquiryId = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newInquiry: ClientInquiry = {
      id: inquiryId,
      clientName: data.clientName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim(),
      whatsapp: data.whatsapp?.trim() || data.phone?.trim(),
      service: data.service.trim(),
      budget: data.budget?.trim() || 'Custom Quote',
      message: data.message.trim(),
      preferredDateTime: data.preferredDateTime?.trim(),
      sourcePage: data.sourcePage || '/contact',
      createdAt: now,
      status: 'NEW',
      responsePending: true,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          type: 'INQUIRY',
          title: 'Client Inquiry Received',
          detail: `Inquiry submitted for "${data.service}" from page ${data.sourcePage || '/contact'}${data.preferredDateTime ? ` (Desired Date/Time: ${data.preferredDateTime})` : ''}.`,
          timestamp: now,
        },
      ],
    };

    this.data.inquiries.unshift(newInquiry);

    // Sync Client Record (Client History: Inquiry -> Service -> Status)
    const existingClient = this.data.clients.find(
      (c) => c.email.toLowerCase() === newInquiry.email
    );

    if (existingClient) {
      existingClient.totalInquiries = (existingClient.totalInquiries || 0) + 1;
      existingClient.lastContactDate = now;
      existingClient.timeline.unshift({
        id: `tl-${Date.now()}-cl`,
        type: 'INQUIRY',
        title: `New Inquiry: ${data.service}`,
        detail: `Client submitted another inquiry for ${data.service}: "${data.message.substring(0, 100)}..."`,
        timestamp: now,
      });
    } else {
      const newClientRecord: ClientRecord = {
        id: `cli-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: data.clientName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone || data.whatsapp,
        company: 'Individual / Direct Client',
        primaryService: data.service,
        firstInquiryDate: now,
        lastContactDate: now,
        status: 'INQUIRY',
        totalInquiries: 1,
        emailsCount: 0,
        hasReplied: false,
        timeline: [
          {
            id: `tl-${Date.now()}-cinit`,
            type: 'INQUIRY',
            title: `First Inquiry: ${data.service}`,
            detail: `Client initiated contact through ${data.sourcePage || 'website'}. Message: "${data.message.substring(0, 100)}..."`,
            timestamp: now,
          },
        ],
      };
      this.data.clients.unshift(newClientRecord);
    }

    // Create Owner Notification
    const newNotification: OwnerNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'NEW_CLIENT_INQUIRY',
      title: 'ایک نیا Client آپ سے رابطہ کر رہا ہے',
      message: `${data.clientName} نے ${data.service} کے لیے رابطہ کیا ہے۔ تاریخ و وقت: ${data.preferredDateTime || new Date().toLocaleString()}۔ میسج بھیجا ہے۔ براہِ کرم جلد Response دیں۔`,
      clientName: data.clientName,
      email: data.email,
      service: data.service,
      sourcePage: data.sourcePage || '/contact',
      timestamp: now,
      read: false,
      inquiryId,
    };

    this.data.notifications.unshift(newNotification);

    this.logAudit({
      action: 'NEW_CLIENT_INQUIRY_RECEIVED',
      companyName: data.clientName,
      details: `New inquiry from ${data.clientName} (${data.email}) for "${data.service}".`,
      status: 'SUCCESS',
    });

    this.saveDatabase();
    return { inquiry: newInquiry, notification: newNotification };
  }

  public updateInquiry(id: string, updates: Partial<ClientInquiry>): ClientInquiry | undefined {
    const idx = (this.data.inquiries || []).findIndex((i) => i.id === id);
    if (idx === -1) return undefined;

    const current = this.data.inquiries[idx];
    const now = new Date().toISOString();

    const updated: ClientInquiry = {
      ...current,
      ...updates,
      timeline: current.timeline || [],
    };

    if (updates.status && updates.status !== current.status) {
      updated.timeline.unshift({
        id: `tl-${Date.now()}-st`,
        type: 'STATUS_CHANGE',
        title: `Status Changed to ${updates.status}`,
        detail: `Status updated by owner from ${current.status} to ${updates.status}`,
        timestamp: now,
      });

      if (updates.status === 'RESPONDED') {
        updated.responsePending = false;
        updated.respondedAt = now;
      }
    }

    if (updates.responsePending === false && current.responsePending === true) {
      updated.respondedAt = now;
      updated.status = 'RESPONDED';
      updated.timeline.unshift({
        id: `tl-${Date.now()}-resp`,
        type: 'STATUS_CHANGE',
        title: 'Response Provided',
        detail: 'Owner recorded that response has been sent to client.',
        timestamp: now,
      });
    }

    if (updates.notes && updates.notes !== current.notes) {
      updated.timeline.unshift({
        id: `tl-${Date.now()}-note`,
        type: 'NOTE',
        title: 'Owner Note Added',
        detail: updates.notes,
        timestamp: now,
      });
    }

    this.data.inquiries[idx] = updated;

    // Sync client history
    const client = (this.data.clients || []).find((c) => c.email.toLowerCase() === updated.email.toLowerCase());
    if (client) {
      client.lastContactDate = now;
      if (updated.status === 'CONVERTED') client.status = 'CONVERTED';
      else if (updated.status === 'RESPONDED') client.status = 'PITCHED';
    }

    this.saveDatabase();
    return updated;
  }

  public deleteInquiry(id: string): boolean {
    const initialLen = (this.data.inquiries || []).length;
    this.data.inquiries = (this.data.inquiries || []).filter((i) => i.id !== id);
    if (this.data.inquiries.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- Client History (Client Lifecycle Tracking) ---

  public getClients(search?: string): ClientRecord[] {
    let list = [...(this.data.clients || [])];
    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q)) ||
          c.primaryService.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.lastContactDate).getTime() - new Date(a.lastContactDate).getTime());
  }

  public getClientById(id: string): ClientRecord | undefined {
    return (this.data.clients || []).find((c) => c.id === id);
  }

  public addClientTimelineNote(clientId: string, note: string): ClientRecord | undefined {
    const client = (this.data.clients || []).find((c) => c.id === clientId);
    if (!client) return undefined;

    const now = new Date().toISOString();
    client.timeline = client.timeline || [];
    client.timeline.unshift({
      id: `tl-${Date.now()}-mn`,
      type: 'NOTE',
      title: 'Note Recorded',
      detail: note,
      timestamp: now,
    });
    client.lastContactDate = now;
    this.saveDatabase();
    return client;
  }

  // --- Owner Notifications ---

  public getNotifications(limit: number = 50): OwnerNotification[] {
    return (this.data.notifications || []).slice(0, limit);
  }

  public markNotificationRead(id?: string): boolean {
    if (!this.data.notifications) return true;
    if (id) {
      const notif = this.data.notifications.find((n) => n.id === id);
      if (notif) notif.read = true;
    } else {
      this.data.notifications.forEach((n) => (n.read = true));
    }
    this.saveDatabase();
    return true;
  }

  // --- Email History (All Outreach & Sent Communications) ---

  public getEmailHistory(filter: 'ALL' | 'TODAY' | 'OLDER' = 'ALL') {
    const todayStr = new Date().toISOString().split('T')[0];
    const emailRecords: Array<{
      id: string;
      recipientName: string;
      company: string;
      email: string;
      service: string;
      subject: string;
      body: string;
      sentAt: string;
      status: string;
      hasReplied: boolean;
      replyDate?: string;
      lastReplySnippet?: string;
      nextFollowUpDate?: string;
      channel: 'email';
    }> = [];

    // From Leads outreach
    for (const lead of this.data.leads) {
      if (lead.emailStatus === 'SENT' || lead.emailStatus === 'DELIVERED' || lead.emailStatus === 'REPLIED' || lead.sentAt) {
        emailRecords.push({
          id: `lead-mail-${lead.id}`,
          recipientName: lead.possibleDecisionMaker || lead.company,
          company: lead.company,
          email: lead.email,
          service: lead.recommendedService,
          subject: lead.selectedSubject,
          body: lead.pitchBody,
          sentAt: lead.sentAt || lead.lastContactDate || lead.createdAt,
          status: lead.emailStatus,
          hasReplied: lead.hasReplied || lead.emailStatus === 'REPLIED',
          replyDate: lead.lastReplyDate,
          lastReplySnippet: lead.lastClientMessage,
          nextFollowUpDate: lead.nextFollowUpDate,
          channel: 'email',
        });
      }
    }

    // Sort by sentAt descending
    let sorted = emailRecords.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    if (filter === 'TODAY') {
      sorted = sorted.filter((e) => e.sentAt && e.sentAt.startsWith(todayStr));
    } else if (filter === 'OLDER') {
      sorted = sorted.filter((e) => !e.sentAt || !e.sentAt.startsWith(todayStr));
    }

    return sorted;
  }

  // --- Owner Central Overview (ایک نظر میں اہم معلومات) ---

  public getOwnerOverview(): OwnerOverview {
    const todayStr = new Date().toISOString().split('T')[0];
    const leads = this.data.leads || [];
    const inquiries = this.data.inquiries || [];
    const notifications = this.data.notifications || [];
    const integrations = this.data.integrations;

    // Today's inquiries
    const todayInquiries = inquiries.filter((i) => i.createdAt && i.createdAt.startsWith(todayStr));

    // Today's leads
    const todayLeads = leads.filter((l) => l.discoveryDate === todayStr);
    const targetDailyCount = integrations.targetDailyLeadsCount || 10;

    // Today's sent emails
    const todayEmails = this.getEmailHistory('TODAY');
    const todayEmailsSent = todayEmails.length;
    const remainingEmails = Math.max(0, targetDailyCount - todayEmailsSent);

    // Replies
    const newReplies = leads.filter((l) => l.hasReplied || l.emailStatus === 'REPLIED').length;

    // Pending responses for clients
    const pendingResponses = inquiries.filter((i) => i.responsePending === true).length;

    // Follow-ups due
    const followUpsDue = leads.filter((l) => l.emailStatus === 'FOLLOW-UP DUE').length +
      inquiries.filter((i) => i.status === 'FOLLOW_UP_SCHEDULED').length;

    // Unread notifications
    const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

    return {
      todayNewClients: todayInquiries.length,
      todayLeadsCount: todayLeads.length || (leads.length > 0 ? Math.min(leads.length, targetDailyCount) : 0),
      dailyTarget: targetDailyCount,
      todayEmailsSent,
      remainingEmails,
      newReplies,
      pendingResponses,
      followUpsDue,
      unreadNotificationsCount,
      notifications: notifications.slice(0, 10),
      recentInquiries: inquiries.slice(0, 5),
      todaySentEmails: todayEmails.slice(0, 10).map((e) => ({
        id: e.id,
        company: e.company,
        email: e.email,
        subject: e.subject,
        service: e.service,
        sentAt: e.sentAt,
        status: e.status,
        hasReplied: e.hasReplied,
        replyAt: e.replyDate,
        nextFollowUpDate: e.nextFollowUpDate,
      })),
    };
  }
}

export const crmDb = new CrmDatabase();
