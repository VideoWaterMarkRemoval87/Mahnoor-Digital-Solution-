import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import { crmDb } from './crmDatabase';
import { CrmLead, LeadFit } from './types';

// Initialize Gemini SDK with official guidelines
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Discovery Engine] GEMINI_API_KEY not set in environment.');
  }
  return new GoogleGenAI();
};

interface DiscoveryOptions {
  targetCountry?: string;
  targetNiche?: string;
  count?: number;
}

export type WhatsAppNotificationType =
  | 'NEW_CLIENT'
  | 'EMAIL_SENT'
  | 'EMAIL_BOUNCED'
  | 'CLIENT_REPLY'
  | 'CLIENT_INTERESTED'
  | 'FOLLOW_UP_DUE'
  | 'MEETING_REQUESTED'
  | 'CLIENT_CONVERTED';

export class DiscoveryEngine {
  /**
   * Verify website reachability via standard HTTP HEAD / GET
   */
  public static async verifyWebsite(url: string): Promise<{ reachable: boolean; resolvedUrl: string; status?: number; error?: string }> {
    try {
      let targetUrl = url;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        reachable: res.status >= 200 && res.status < 400,
        resolvedUrl: res.url || targetUrl,
        status: res.status,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        reachable: false,
        resolvedUrl: url,
        error: msg,
      };
    }
  }

  /**
   * Automatically discover real international prospective businesses using Gemini Search Grounding
   */
  public static async discoverRealProspects(options: DiscoveryOptions = {}): Promise<{
    discovered: number;
    leadsAdded: CrmLead[];
    duplicatesPrevented: number;
    errors: string[];
  }> {
    const ai = getAiClient();
    const targetCountry = options.targetCountry || 'USA, UK, Canada, Australia, UAE, Saudi Arabia or Europe';
    const targetNiche = options.targetNiche || 'Healthcare, Real Estate, E-Commerce, Architecture, Logistics, Professional Services';
    const count = options.count || 5;

    crmDb.logAudit({
      action: 'DISCOVERY_STARTED',
      details: `Scanning for ${count} real businesses in ${targetCountry} (${targetNiche}) with Google Search Grounding.`,
      status: 'INFO',
    });

    const prompt = `You are an executive research agent for Mahnoor Digital Solution, a web design, WordPress development, Elementor, WooCommerce, and Canva branding studio.
Task: Identify exactly ${count} REAL, VERIFIABLE, CURRENTLY EXISTING businesses located in ${targetCountry} within the ${targetNiche} sector that have an observable website, mobile, or branding deficiency.

STRICT MANDATORY RULES:
1. NEVER INVENT FICTIONAL COMPANIES. Use REAL, publicly registered businesses with active official websites.
2. If public business email cannot be verified from public directories, set it to "Unavailable".
3. For each business, observe a REAL potential opportunity (e.g. outdated theme, sluggish mobile speed, non-responsive appointment forms, missing WooCommerce cart, unformatted PDFs instead of modern Canva kits, missing SEO keyword structure).
4. Recommend one specific service provided by Mahnoor Digital Solution:
   - WordPress website development / Elementor Pro revamp
   - Website redesign & speed optimization
   - WooCommerce e-commerce setup
   - Canva luxury brand identity & editable template suite
   - SEO content writing & pillar articles
   - AI website scaffolding & redesign
5. Return JSON ONLY with this exact structure:
[
  {
    "company": "Real Business Name",
    "domain": "example.com",
    "country": "Country Name",
    "city": "City Name",
    "industry": "Industry Sector",
    "website": "https://example.com",
    "email": "info@example.com (or Unavailable)",
    "phone": "+1 ... (or Unavailable)",
    "decisionMaker": "Practice Manager / Founder / Director",
    "potentialProblem": "Concrete verifiable digital friction",
    "recommendedService": "WordPress Website Redesign / Elementor Booking Revamp",
    "reasonRelevant": "Why this company is a high-value prospect",
    "leadFit": "HIGH",
    "leadFitReasons": ["Verifiable international domain", "Objective mobile UX conversion leak"]
  }
]`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text || '';
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Google Search Grounding did not return a valid business JSON array.');
      }

      const rawLeads = JSON.parse(jsonMatch[0]);
      let duplicatesPrevented = 0;
      const leadsAdded: CrmLead[] = [];
      const errors: string[] = [];

      for (const item of rawLeads) {
        if (!item.company || !item.domain) continue;

        // Verify website is live
        const verification = await this.verifyWebsite(item.website || item.domain);
        if (!verification.reachable) {
          errors.push(`Skipped ${item.company}: Website ${item.website || item.domain} unreachable.`);
          continue;
        }

        // Generate tailored pitches
        const pitches = await this.generatePitchForLead({
          company: item.company,
          country: item.country,
          domain: item.domain,
          decisionMaker: item.decisionMaker || 'Business Owner',
          potentialProblem: item.potentialProblem || 'Mobile responsiveness and layout optimization',
          recommendedService: item.recommendedService || 'WordPress Website Redesign & Elementor Speed Revamp',
          reasonRelevant: item.reasonRelevant || 'High international commercial relevance with observable digital upgrade opportunity',
        });

        const leadEmail = item.email && item.email.includes('@') && !item.email.includes('example.com')
          ? item.email.trim()
          : 'Unavailable';

        const addResult = crmDb.addLead({
          company: item.company,
          domain: item.domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '').toLowerCase(),
          country: item.country,
          city: item.city || 'Metropolitan Area',
          industry: item.industry || 'Commercial Enterprise',
          website: verification.resolvedUrl,
          email: leadEmail,
          isEmailVerified: leadEmail !== 'Unavailable',
          phone: item.phone !== 'Unavailable' ? item.phone : undefined,
          socialProfiles: {},
          possibleDecisionMaker: item.decisionMaker || 'Managing Director',
          potentialProblem: item.potentialProblem,
          recommendedService: item.recommendedService,
          reasonRelevant: item.reasonRelevant,
          leadFit: (item.leadFit as LeadFit) || 'HIGH',
          leadFitReasons: item.leadFitReasons || ['Active international domain', 'Observable web conversion opportunity'],
          discoveryDate: new Date().toISOString().split('T')[0],
          leadSource: 'Google Search Grounding Real Business Discovery',
          emailStatus: 'DRAFT',
          subjectOptions: pitches.subjectOptions,
          selectedSubject: pitches.subjectOptions[0],
          pitchBody: pitches.pitchBody,
          whatsappPitch: pitches.whatsappPitch,
          followUpPitch: pitches.followUpPitch,
          optedOut: false,
          hasReplied: false,
        });

        if (addResult.success && addResult.lead) {
          leadsAdded.push(addResult.lead);
        } else {
          duplicatesPrevented++;
        }
      }

      crmDb.logAudit({
        action: 'DISCOVERY_COMPLETED',
        details: `Discovery finished: ${leadsAdded.length} new international leads added to approval queue, ${duplicatesPrevented} duplicates protected.`,
        status: 'SUCCESS',
      });

      return {
        discovered: leadsAdded.length,
        leadsAdded,
        duplicatesPrevented,
        errors,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      crmDb.logAudit({
        action: 'DISCOVERY_FAILED',
        details: `Discovery encountered an issue: ${msg}`,
        status: 'ERROR',
      });
      return {
        discovered: 0,
        leadsAdded: [],
        duplicatesPrevented: 0,
        errors: [msg],
      };
    }
  }

  /**
   * Generate personalized business outreach email with 3 subject options
   */
  public static async generatePitchForLead(lead: {
    company: string;
    country: string;
    domain: string;
    decisionMaker: string;
    potentialProblem: string;
    recommendedService: string;
    reasonRelevant: string;
  }): Promise<{
    subjectOptions: [string, string, string];
    pitchBody: string;
    whatsappPitch: string;
    followUpPitch: string;
  }> {
    const ai = getAiClient();
    const prompt = `You are Mahnoor Naaz, founder of Mahnoor Digital Solution (mahambitget9807@gmail.com), a web design & digital consultant specializing in WordPress, Elementor Pro, WooCommerce, and Canva branding.
Write a personalized, consultative, non-spam cold outreach email to this REAL international company:

Company: ${lead.company}
Country: ${lead.country}
Website: ${lead.domain}
Decision Maker: ${lead.decisionMaker}
Identified Opportunity: ${lead.potentialProblem}
Recommended Service: ${lead.recommendedService}

STRICT WRITING RULES:
1. Use the real company name "${lead.company}".
2. Reference the real, verifiable observation about their website/branding ("${lead.potentialProblem}").
3. Connect that opportunity directly to "${lead.recommendedService}".
4. Sound human, humble, respectful, and consultative.
5. NO fake compliments, NO buzzwords, NO fake statistics, NO guaranteed revenue claims.
6. NEVER pretend you previously worked with them.
7. Keep it concise (150-200 words max).
8. Conclude with a low-friction call-to-action (e.g., offering a 2-minute non-binding wireframe preview or quick Loom audit).
9. Provide exactly 3 subject line options (concise, professional, curiosity-driven, no spam words).
10. Provide 1 polite follow-up message (for 4 days later if no reply).
11. Provide 1 short WhatsApp message (2 sentences).

Return JSON ONLY with this schema:
{
  "subjectOptions": ["Subject 1", "Subject 2", "Subject 3"],
  "pitchBody": "Email body text...",
  "whatsappPitch": "Short 2-sentence WhatsApp pitch...",
  "followUpPitch": "Polite follow-up text..."
}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          subjectOptions: [
            parsed.subjectOptions?.[0] || `Quick observation regarding ${lead.company} website`,
            parsed.subjectOptions?.[1] || `Enhancing conversion flow on ${lead.domain}`,
            parsed.subjectOptions?.[2] || `Idea for ${lead.company}'s digital presentation`,
          ],
          pitchBody: parsed.pitchBody || `Hi ${lead.decisionMaker},\n\nI was reviewing ${lead.domain} and noticed an opportunity regarding ${lead.potentialProblem}.\n\nAt Mahnoor Digital Solution, I specialize in ${lead.recommendedService}. I would love to share a free 2-minute preview of how we could optimize this.\n\nBest regards,\nMahnoor Naaz\nMahnoor Digital Solution\nmahambitget9807@gmail.com`,
          whatsappPitch: parsed.whatsappPitch || `Hi ${lead.decisionMaker}! Quick observation regarding ${lead.company}'s website. - Mahnoor Naaz`,
          followUpPitch: parsed.followUpPitch || `Hi ${lead.decisionMaker}, following up on my previous note regarding ${lead.company}. I'd be glad to share the preview whenever convenient!`,
        };
      }
    } catch (e) {
      console.error('[Pitch Generation Error]:', e);
    }

    return {
      subjectOptions: [
        `Quick observation regarding ${lead.company} website`,
        `Enhancing mobile conversions on ${lead.domain}`,
        `Modernizing ${lead.company}'s digital presence`,
      ],
      pitchBody: `Hi ${lead.decisionMaker} & Team,\n\nI came across ${lead.company} while reviewing international businesses in ${lead.country}.\n\nI noticed an opportunity regarding ${lead.potentialProblem}.\n\nI build custom, high-converting digital solutions at Mahnoor Digital Solution specializing in ${lead.recommendedService}.\n\nI have prepared a quick, non-binding 2-minute wireframe outline showing how this can be improved. Would you be open to me sending that link over?\n\nBest regards,\nMahnoor Naaz | Founder & Lead Developer\nMahnoor Digital Solution\nDirect: mahambitget9807@gmail.com`,
      whatsappPitch: `Hi ${lead.decisionMaker}! I noticed a quick improvement for ${lead.company} regarding ${lead.recommendedService}. Can I send you a 2-minute preview? - Mahnoor Naaz`,
      followUpPitch: `Hi ${lead.decisionMaker}, checking in on my previous message regarding ${lead.company}'s website improvement. Would love to share the brief preview whenever suits you best.`,
    };
  }

  /**
   * Real Email Dispatch via Nodemailer (SMTP / Gmail), Resend, or SendGrid
   * STRICT: Never simulate sending. If provider fails or credentials missing, return ⚠️ INTEGRATION ERROR.
   */
  public static async sendRealEmail(params: {
    lead: CrmLead;
    subject: string;
    body: string;
  }): Promise<{
    success: boolean;
    provider: string;
    messageId?: string;
    deliveryConfirmed: boolean;
    integrationError?: boolean;
    error?: string;
    mailtoUrl?: string;
  }> {
    const integrations = crmDb.getIntegrations();
    const mailtoUrl = `mailto:${encodeURIComponent(params.lead.email)}?subject=${encodeURIComponent(params.subject)}&body=${encodeURIComponent(params.body)}`;

    // 1. Resend API
    if (integrations.emailProvider === 'resend') {
      if (!integrations.resendApiKey) {
        const error = '⚠️ INTEGRATION ERROR: Resend API Key is missing. Please configure your RESEND_API_KEY in the Integrations tab or .env file.';
        crmDb.updateIntegrations({ lastEmailError: error });
        return { success: false, provider: 'resend', deliveryConfirmed: false, integrationError: true, error, mailtoUrl };
      }

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${integrations.resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${integrations.emailSenderName} <${integrations.emailSenderAddress}>`,
            to: [params.lead.email],
            subject: params.subject,
            text: params.body,
          }),
        });

        const data = await res.json();
        if (res.ok && data.id) {
          crmDb.updateIntegrations({ lastEmailError: undefined });
          return { success: true, provider: 'resend', messageId: data.id, deliveryConfirmed: true };
        } else {
          const errorMsg = `⚠️ INTEGRATION ERROR: Resend API dispatch failed: ${data.message || JSON.stringify(data)}`;
          crmDb.updateIntegrations({ lastEmailError: errorMsg });
          return { success: false, provider: 'resend', deliveryConfirmed: false, integrationError: true, error: errorMsg, mailtoUrl };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const errorMsg = `⚠️ INTEGRATION ERROR: Resend network request failed: ${msg}`;
        crmDb.updateIntegrations({ lastEmailError: errorMsg });
        return { success: false, provider: 'resend', deliveryConfirmed: false, integrationError: true, error: errorMsg, mailtoUrl };
      }
    }

    // 2. SMTP / Gmail
    if (integrations.emailProvider === 'smtp' || integrations.emailProvider === 'gmail') {
      const host = integrations.smtpHost || (integrations.emailProvider === 'gmail' ? 'smtp.gmail.com' : undefined);
      const port = integrations.smtpPort || 465;
      const user = integrations.smtpUser || integrations.emailSenderAddress;
      const pass = integrations.smtpPassword;

      if (!host || !user || !pass) {
        const error = `⚠️ INTEGRATION ERROR: Real automated email dispatch for ${user} requires SMTP password / Google App Password. Configure SMTP credentials in the Integrations tab to enable automated sending.`;
        crmDb.updateIntegrations({ lastEmailError: error });
        return { success: false, provider: 'smtp', deliveryConfirmed: false, integrationError: true, error, mailtoUrl };
      }

      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
          tls: { rejectUnauthorized: false },
        });

        const info = await transporter.sendMail({
          from: `"${integrations.emailSenderName}" <${user}>`,
          to: params.lead.email,
          subject: params.subject,
          text: params.body,
        });

        crmDb.updateIntegrations({ lastEmailError: undefined });
        return {
          success: true,
          provider: 'smtp',
          messageId: info.messageId,
          deliveryConfirmed: true,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const errorMsg = `⚠️ INTEGRATION ERROR: SMTP delivery to ${params.lead.email} failed: ${msg}. Please verify your Gmail App Password / SMTP settings in the Integrations tab.`;
        crmDb.updateIntegrations({ lastEmailError: errorMsg });
        return { success: false, provider: 'smtp', deliveryConfirmed: false, integrationError: true, error: errorMsg, mailtoUrl };
      }
    }

    // 3. Manual / Unconfigured
    const errorMsg = `⚠️ INTEGRATION ERROR: No active email sending provider is authenticated for ${integrations.emailSenderAddress}. Please configure your Gmail App Password or Resend API Key in the Integrations tab. In the meantime, use Direct Mail Client to send from ${integrations.emailSenderAddress}.`;
    crmDb.updateIntegrations({ lastEmailError: errorMsg });
    return {
      success: false,
      provider: 'manual',
      deliveryConfirmed: false,
      integrationError: true,
      error: errorMsg,
      mailtoUrl,
    };
  }

  /**
   * Dispatch REAL WhatsApp notification
   * STRICT RULE: Never simulate WhatsApp messages. If API is not connected, return ⚠️ INTEGRATION ERROR
   * and provide real wa.me link with the exact message.
   */
  public static async sendWhatsAppAlert(alert: {
    type: WhatsAppNotificationType;
    company: string;
    country?: string;
    website?: string;
    service?: string;
    email?: string;
    details?: string;
    actualReply?: string;
    subject?: string;
    providerResult?: string;
    bounceReason?: string;
    dueDate?: string;
  }): Promise<{
    success: boolean;
    channel: string;
    messageId?: string;
    integrationError?: boolean;
    error?: string;
    formattedBody: string;
    whatsappUrl: string;
  }> {
    const integrations = crmDb.getIntegrations();

    // Generate exact template matching user specification
    let body = '';
    switch (alert.type) {
      case 'NEW_CLIENT':
        body = `🔔 NEW CLIENT\n\n` +
          `Company: ${alert.company}\n` +
          `Country: ${alert.country || 'International'}\n` +
          `Website: ${alert.website || 'Verified'}\n` +
          `Email: ${alert.email || 'Unavailable'}\n` +
          `Service Opportunity: ${alert.details || alert.service || 'Website Redesign'}\n\n` +
          `Status: APPROVAL REQUIRED`;
        break;

      case 'CLIENT_REPLY':
        body = `💬 CLIENT REPLIED\n\n` +
          `Company: ${alert.company}\n` +
          `Email: ${alert.email || 'Client'}\n\n` +
          `Actual Reply:\n` +
          `"${alert.actualReply || alert.details || 'Interested in your services'}"\n\n` +
          `Status: REPLY RECEIVED`;
        break;

      case 'EMAIL_SENT':
        body = `✉️ EMAIL SENT\n\n` +
          `Company: ${alert.company}\n` +
          `Email: ${alert.email || 'Client'}\n` +
          `Subject: ${alert.subject || 'Outreach'}\n` +
          `Provider Result: ${alert.providerResult || 'CONFIRMED'}\n\n` +
          `Status: SENT`;
        break;

      case 'EMAIL_BOUNCED':
        body = `⚠️ EMAIL BOUNCED\n\n` +
          `Company: ${alert.company}\n` +
          `Email: ${alert.email || 'Client'}\n` +
          `Reason: ${alert.bounceReason || alert.details || 'Mailbox unavailable'}\n\n` +
          `Status: BOUNCED`;
        break;

      case 'CLIENT_INTERESTED':
        body = `🌟 CLIENT INTERESTED\n\n` +
          `Company: ${alert.company}\n` +
          `Email: ${alert.email || 'Client'}\n` +
          `Details: ${alert.details || 'Expressed strong interest in project scope'}\n\n` +
          `Status: INTERESTED`;
        break;

      case 'FOLLOW_UP_DUE':
        body = `⏰ FOLLOW-UP DUE\n\n` +
          `Company: ${alert.company}\n` +
          `Email: ${alert.email || 'Client'}\n` +
          `Original Subject: ${alert.subject || 'Project Inquiry'}\n` +
          `Due Date: ${alert.dueDate || new Date().toISOString().split('T')[0]}\n\n` +
          `Status: FOLLOW-UP DUE`;
        break;

      case 'MEETING_REQUESTED':
        body = `📅 MEETING REQUESTED\n\n` +
          `Company: ${alert.company}\n` +
          `Email: ${alert.email || 'Client'}\n` +
          `Message: "${alert.actualReply || alert.details || 'Requested a consultation call'}"\n\n` +
          `Status: MEETING PENDING`;
        break;

      case 'CLIENT_CONVERTED':
        body = `🎉 CLIENT CONVERTED\n\n` +
          `Company: ${alert.company}\n` +
          `Email: ${alert.email || 'Client'}\n` +
          `Service: ${alert.service || 'WordPress & Digital Branding'}\n\n` +
          `Status: ACTIVE CLIENT`;
        break;
    }

    const cleanPhone = (integrations.whatsappRecipientNumber || '').replace(/[^0-9]/g, '');
    const whatsappUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(body)}`
      : `https://wa.me/?text=${encodeURIComponent(body)}`;

    // Check if Meta WhatsApp Cloud API credentials are provided
    if (integrations.whatsappProvider === 'cloud_api' && integrations.whatsappPhoneNumberId && integrations.whatsappAccessToken) {
      try {
        const url = `https://graph.facebook.com/v19.0/${integrations.whatsappPhoneNumberId}/messages`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${integrations.whatsappAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: cleanPhone,
            type: 'text',
            text: { body },
          }),
        });

        const data = await res.json();
        if (res.ok && data.messages?.[0]?.id) {
          crmDb.updateIntegrations({ lastWhatsappError: undefined });
          crmDb.logAudit({
            action: 'WHATSAPP_SENT',
            companyName: alert.company,
            details: `WhatsApp Cloud API alert delivered to ${integrations.whatsappRecipientNumber} (Message ID: ${data.messages[0].id}).`,
            status: 'SUCCESS',
          });
          return { success: true, channel: 'WhatsApp Cloud API', messageId: data.messages[0].id, formattedBody: body, whatsappUrl };
        } else {
          const errMsg = `⚠️ INTEGRATION ERROR: Meta WhatsApp Cloud API rejected dispatch: ${data.error?.message || JSON.stringify(data)}. Fix: Update Phone Number ID / Access Token in Integrations tab.`;
          crmDb.updateIntegrations({ lastWhatsappError: errMsg });
          crmDb.logAudit({
            action: 'WHATSAPP_INTEGRATION_ERROR',
            companyName: alert.company,
            details: errMsg,
            status: 'ERROR',
          });
          return { success: false, channel: 'WhatsApp Cloud API', integrationError: true, error: errMsg, formattedBody: body, whatsappUrl };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const errMsg = `⚠️ INTEGRATION ERROR: Meta WhatsApp Cloud API network error: ${msg}. Fix: Verify API connectivity and Access Token.`;
        crmDb.updateIntegrations({ lastWhatsappError: errMsg });
        return { success: false, channel: 'WhatsApp Cloud API', integrationError: true, error: errMsg, formattedBody: body, whatsappUrl };
      }
    }

    // If Cloud API credentials not configured, DO NOT pretend success!
    const errorMsg = `⚠️ INTEGRATION ERROR: WhatsApp Business API is not connected. Configure your Meta WhatsApp Phone Number ID and Access Token in the Integrations tab, or click the direct WhatsApp link to dispatch to your connected WhatsApp.`;
    crmDb.updateIntegrations({ lastWhatsappError: errorMsg });
    crmDb.logAudit({
      action: 'WHATSAPP_NOT_CONNECTED',
      companyName: alert.company,
      details: errorMsg,
      status: 'WARNING',
    });

    return {
      success: false,
      channel: 'WhatsApp (Direct Link Ready)',
      integrationError: true,
      error: errorMsg,
      formattedBody: body,
      whatsappUrl,
    };
  }

  /**
   * AI Consultative Reply Assistant
   * Drafts an intelligent response, but NEVER sends without user approval.
   */
  public static async generateReplyResponse(lead: CrmLead, clientMessage: string): Promise<string> {
    const ai = getAiClient();
    const prompt = `You are Mahnoor Naaz, founder of Mahnoor Digital Solution (mahambitget9807@gmail.com).
A real client from ${lead.company} has replied to your initial email regarding ${lead.recommendedService}.

Original Outreach:
"${lead.pitchBody}"

Client's ACTUAL Reply:
"${clientMessage}"

Task: Draft a respectful, professional, consultative response.
Rules:
1. Address their specific points/questions directly.
2. If they asked for pricing, provide a realistic freelance ballpark for ${lead.recommendedService} ($450 - $1,200 depending on requirements) and offer a quick discussion.
3. If they asked for portfolio proof, reference your verified works at https://mahnoordigitalsolution.com/portfolio.
4. If they requested a call, offer convenient time slots or an async Loom video demo.
5. If they said no or opt-out, be gracious, thank them, and confirm removal.
6. Keep it concise, friendly, and human.

Return ONLY the plain text body of the response email.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text?.trim() || `Hi ${lead.possibleDecisionMaker},\n\nThank you for getting back to me! I would be delighted to share more details and a live preview with you.\n\nBest regards,\nMahnoor Naaz\nMahnoor Digital Solution`;
    } catch (err) {
      console.error('[AI Reply Assistant Error]:', err);
      return `Hi ${lead.possibleDecisionMaker},\n\nThank you for your response! I would be glad to provide further information on ${lead.recommendedService}.\n\nBest regards,\nMahnoor Naaz\nMahnoor Digital Solution`;
    }
  }

  /**
   * Run the full 12-step daily automation pipeline
   */
  /**
   * Runs the full daily acquisition pipeline: discovers new leads, then sends
   * an outreach email to each one automatically (no manual "Approve & Send"
   * click needed), up to `dailyLimit` sends per run. Every lead that already
   * opted out is skipped. Every sent email includes a required unsubscribe
   * line (CAN-SPAM/GDPR compliance for unsolicited cold outreach) via
   * `sendOutreachEmailFn`, which is passed in from server.ts so this file
   * doesn't need to know about Express req/res.
   */
  public static async runDailyPipeline(
    sendOutreachEmailFn: (lead: CrmLead) => Promise<{ success: boolean; error?: string }>,
    dailyLimit: number = 10
  ): Promise<{
    timestamp: string;
    leadsDiscovered: number;
    emailsSent: number;
    emailsFailed: number;
    duplicatesSkipped: number;
    auditLog: string;
    whatsappAlertResult: any;
  }> {
    const timestamp = new Date().toISOString();
    crmDb.logAudit({
      action: 'DAILY_PIPELINE_TRIGGERED',
      details: `Automated daily client acquisition run initiated (limit: ${dailyLimit}).`,
      status: 'INFO',
    });

    const discovery = await DiscoveryEngine.discoverRealProspects({ count: dailyLimit });
    crmDb.setLastDailyRun(timestamp);

    let emailsSent = 0;
    let emailsFailed = 0;
    let whatsappAlertResult = null;

    for (const lead of discovery.leadsAdded.slice(0, dailyLimit)) {
      if (lead.optedOut || !lead.email || !lead.email.includes('@')) continue;
      const result = await sendOutreachEmailFn(lead);
      if (result.success) {
        emailsSent += 1;
      } else {
        emailsFailed += 1;
        crmDb.logAudit({
          action: 'DAILY_PIPELINE_SEND_FAILED',
          leadId: lead.id,
          companyName: lead.company,
          details: result.error || 'Unknown send failure during daily pipeline.',
          status: 'ERROR',
        });
      }
    }

    if (discovery.discovered > 0) {
      const topLead = discovery.leadsAdded[0];
      whatsappAlertResult = await DiscoveryEngine.sendWhatsAppAlert({
        type: 'NEW_CLIENT',
        company: topLead.company,
        country: topLead.country,
        website: topLead.website,
        service: topLead.recommendedService,
        email: topLead.email,
        details: `Daily pipeline: ${emailsSent} sent, ${emailsFailed} failed out of ${discovery.discovered} discovered.`,
      });
    }

    return {
      timestamp,
      leadsDiscovered: discovery.discovered,
      emailsSent,
      emailsFailed,
      duplicatesSkipped: discovery.duplicatesPrevented,
      auditLog: `Pipeline completed. ${discovery.discovered} leads discovered, ${emailsSent} emails auto-sent, ${emailsFailed} failed, ${discovery.duplicatesPrevented} duplicates skipped.`,
      whatsappAlertResult,
    };
  }
}
