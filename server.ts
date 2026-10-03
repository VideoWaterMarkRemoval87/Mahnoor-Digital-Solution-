import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { crmDb } from './server/crmDatabase';
import { DiscoveryEngine, WhatsAppNotificationType } from './server/discoveryEngine';
import { CrmLead, EmailStatus } from './server/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isDev = process.env.NODE_ENV !== 'production';

// --- OWNER SESSION AUTH ---
// The old version accepted the password "mahnoor2026"/"owner", the owner's
// public email, or a plain { isOwner: true } flag from ANY visitor — meaning
// anyone could open the owner dashboard and read/delete client data. This
// replaces it with a real password check + signed session token.
const OWNER_PASSWORD = process.env.OWNER_PASSWORD;
if (!OWNER_PASSWORD && !isDev) {
  console.error('[FATAL] OWNER_PASSWORD is not set. Refusing to start in production without it.');
  process.exit(1);
}
if (!OWNER_PASSWORD) {
  console.warn('[Dev only] OWNER_PASSWORD not set — using insecure dev default "dev-only-password". Set OWNER_PASSWORD in .env before deploying.');
}
const EFFECTIVE_OWNER_PASSWORD = OWNER_PASSWORD || 'dev-only-password';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const activeSessions = new Map<string, number>(); // token -> expiry timestamp
import { readFileSync, writeFileSync, existsSync } from 'fs';
const SESSIONS_FILE = '.sessions.json';
if (existsSync(SESSIONS_FILE)) {
  try {
    const saved = JSON.parse(readFileSync(SESSIONS_FILE, 'utf-8'));
    for (const [t, exp] of Object.entries(saved)) activeSessions.set(t, exp as number);
  } catch {}
}
function saveSessions(): void {
  try {
    writeFileSync(SESSIONS_FILE, JSON.stringify(Object.fromEntries(activeSessions)));
  } catch {}
}


function issueSessionToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, Date.now() + SESSION_TTL_MS);
  saveSessions();
  return token;
}

function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const expiry = activeSessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    activeSessions.delete(token);
  saveSessions();
    return false;
  }
  return true;
}

// Very small in-memory rate limiter for the login endpoint (5 attempts / 15 min / IP)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
function loginRateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return next();
  }
  if (entry.count >= 5) {
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
  }
  entry.count += 1;
  next();
}

function requireOwner(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!isValidSession(token)) {
    return res.status(401).json({ error: 'Unauthorized. Please log in again.' });
  }
  next();
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- REST API ENDPOINTS ---

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'Mahnoor Digital Solution CRM Backend',
    time: new Date().toISOString(),
    totalLeads: crmDb.getLeads().length,
  });
});

// --- OWNER AUTH & OVERVIEW ---

// Owner login: real password check against OWNER_PASSWORD (set in .env),
// rate-limited, returns a short-lived session token instead of trusting the client.
app.post('/api/owner/verify-access', loginRateLimit, (req: Request, res: Response) => {
  const { passkey } = req.body;

  if (typeof passkey === 'string' && passkey.length > 0 && passkey === EFFECTIVE_OWNER_PASSWORD) {
    const token = issueSessionToken();
    return res.json({
      success: true,
      authenticated: true,
      token,
      expiresInMs: SESSION_TTL_MS,
      owner: {
        name: 'Mahnoor Naaz',
        role: 'Studio Owner & Lead Developer',
      },
    });
  }

  res.status(401).json({
    success: false,
    error: 'Invalid owner password.',
  });
});

// Logout: invalidate the current session token
app.post('/api/owner/logout', requireOwner, (req: Request, res: Response) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (token) activeSessions.delete(token);
  saveSessions();
  res.json({ success: true });
});

// Central Owner Overview (ایک نظر میں اہم معلومات)
app.get('/api/owner/overview', requireOwner, (_req: Request, res: Response) => {
  try {
    const overview = crmDb.getOwnerOverview();
    res.json(overview);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// --- REAL CLIENT INQUIRIES & NOTIFICATIONS ---

// Get all client inquiries
app.get('/api/inquiries', requireOwner, (req: Request, res: Response) => {
  try {
    const { status, responsePending, search } = req.query;
    const inquiries = crmDb.getInquiries({
      status: status as string,
      responsePending: responsePending !== undefined ? responsePending === 'true' : undefined,
      search: search as string,
    });
    res.json(inquiries);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Submit a new real client inquiry (From Contact page or Client Request page)
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const {
      clientName,
      email,
      phone,
      whatsapp,
      service,
      budget,
      message,
      preferredDateTime,
      sourcePage,
    } = req.body;

    const contactPhone = phone?.trim() || whatsapp?.trim();

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ error: 'Client کا نام لازمی ہے۔ (Client name is required)' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email ایڈریس لازمی ہے۔ (Valid email is required)' });
    }
    if (!contactPhone || contactPhone.length < 6) {
      return res.status(400).json({
        error: 'فون / WhatsApp نمبر لازمی ہے۔ (Phone / WhatsApp number is mandatory)',
      });
    }
    // International clients: a bare local number (e.g. "0300...", "0161...")
    // is ambiguous — we can't safely guess which country it belongs to.
    // Require an explicit "+countrycode" (E.164 style), e.g. +971501234567,
    // +14155551234, +923001234567. This is checked here (not just in the
    // form) so a request that bypasses the form's own validation still gets
    // rejected with a clear message instead of producing a broken WhatsApp link.
    const trimmedPhone = contactPhone.trim();
    const phoneDigitsOnly = trimmedPhone.replace(/[^0-9]/g, '');
    const hasCountryCode = trimmedPhone.startsWith('+') && phoneDigitsOnly.length >= 8 && phoneDigitsOnly.length <= 15;
    if (!hasCountryCode) {
      return res.status(400).json({
        error:
          'براہ کرم Country Code کے ساتھ مکمل نمبر درج کریں (e.g. +971501234567, +14155551234, +923001234567). Please include your country code — a local number alone cannot be used internationally.',
      });
    }
    if (!service || !service.trim()) {
      return res.status(400).json({
        error: 'سروس کا انتخاب لازمی ہے۔ (Service selection is mandatory)',
      });
    }
    if (!message || message.trim().length < 5) {
      return res.status(400).json({
        error: 'پروجیکٹ کی تفصیل / پیغام لازمی ہے۔ (Project details/message is mandatory)',
      });
    }
    if (!preferredDateTime || !preferredDateTime.trim()) {
      return res.status(400).json({
        error: 'تاریخ اور وقت لازمی ہے۔ (Date & time is mandatory)',
      });
    }

    const cleanDateTime = preferredDateTime.trim();
    const cleanService = service.trim();

    const { inquiry, notification } = crmDb.addInquiry({
      clientName: clientName.trim(),
      email: email.trim(),
      phone: contactPhone,
      whatsapp: contactPhone,
      service: cleanService,
      budget,
      message: message.trim(),
      preferredDateTime: cleanDateTime,
      sourcePage: sourcePage || '/contact',
    });

    // 1. WhatsApp Alert Dispatch
    const integrations = crmDb.getIntegrations();
    const whatsappAlert = await DiscoveryEngine.sendWhatsAppAlert({
      type: 'NEW_CLIENT',
      company: clientName,
      country: 'Direct Client Inquiry',
      website: sourcePage || 'https://mahnoordigital.com',
      service: cleanService,
      email,
      details: `${message} (Preferred Date/Time: ${cleanDateTime})`,
    });

    // Generate Direct WhatsApp URL for owner with prefilled Urdu/English alert text.
    // Previously this had no recipient number (wa.me/?text=...), so it opened a
    // blank "choose a contact" screen instead of going straight to the owner.
    // It now points at WHATSAPP_RECIPIENT_NUMBER (set in .env) — your own number —
    // so tapping it opens WhatsApp already addressed to you with the client's details filled in.
    const urduAlertMsg = `نیا Client رابطے کے لیے آیا ہے۔ اس نے ${cleanService} منتخب کی ہے اور Message بھیجا ہے: "${message.substring(0, 100)}...". رابطہ کی تاریخ و وقت: ${cleanDateTime}. (Client Email: ${email}, Phone/WhatsApp: ${contactPhone}). براہِ کرم جلد Response دیں۔`;
    const ownerCleanNumber = (integrations.whatsappRecipientNumber || '').replace(/[^0-9]/g, '');
    const ownerWhatsAppUrl = `https://wa.me/${ownerCleanNumber}?text=${encodeURIComponent(urduAlertMsg)}`;

    // Client reply WhatsApp URL. The validation above already guarantees
    // contactPhone starts with "+countrycode" (e.g. +971501234567), so this
    // just strips the "+" and any spaces/dashes — no guessing needed, and it
    // works correctly for clients in any country, not just Pakistan.
    const clientWhatsAppUrl = `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(
      `Hello ${clientName}, thank you for contacting Mahnoor Digital Solution regarding "${cleanService}". I received your message and preferred schedule (${cleanDateTime}). I would love to assist you!`
    )}`;

    // 2. Real Email Notification to Owner if email provider is configured
    let emailDispatched = false;
    let emailError: string | undefined;

    if (integrations.isEmailConfigured) {
      try {
        const emailResult = await DiscoveryEngine.sendRealEmail({
          lead: {
            id: inquiry.id,
            company: clientName,
            domain: email.split('@')[1] || 'client.com',
            country: 'Inquiry',
            city: 'Online',
            industry: cleanService,
            website: sourcePage || 'Online Submission',
            email: integrations.emailSenderAddress, // Send to owner
            isEmailVerified: true,
            socialProfiles: {},
            possibleDecisionMaker: clientName,
            potentialProblem: message,
            recommendedService: cleanService,
            reasonRelevant: 'Website Inquiry Form',
            leadFit: 'HIGH',
            leadFitReasons: ['Direct client submission'],
            discoveryDate: new Date().toISOString().split('T')[0],
            leadSource: sourcePage || '/contact',
            emailStatus: 'DRAFT',
            subjectOptions: [],
            selectedSubject: `[New Client Inquiry] ${clientName} - ${cleanService}`,
            pitchBody: message,
            whatsappPitch: '',
            followUpPitch: '',
            optedOut: false,
            hasReplied: false,
            conversationHistory: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          subject: `🔔 نیا Client رابطہ: ${clientName} (${cleanService})`,
          body: `ایک نیا Client آپ سے رابطہ کر رہا ہے!\n\nClient Details:\n- نام: ${clientName}\n- ای میل: ${email}\n- فون / واٹس ایپ: ${phone || whatsapp || 'Not provided'}\n- سروس: ${cleanService}\n- بجٹ: ${budget || 'Not specified'}\n- صفحہ: ${sourcePage || '/contact'}\n- تاریخ و وقت: ${new Date().toLocaleString()}\n\nپیغام / Request:\n"${message}"\n\nبراہِ کرم جلد از جلد Response دیں۔\n\n-- Mahnoor Digital Solution System`,
        });

        emailDispatched = emailResult.success;
        if (!emailResult.success) {
          emailError = emailResult.error;
        }
      } catch (err) {
        emailError = err instanceof Error ? err.message : String(err);
      }
    }

    res.json({
      success: true,
      inquiry,
      notification,
      whatsappAlert,
      ownerWhatsAppUrl,
      clientWhatsAppUrl,
      emailDispatched,
      emailError,
      message: 'Inquiry received successfully and owner alerted.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Update inquiry details (Mark Responded, Schedule Follow-up, Change Status)
app.put('/api/inquiries/:id', requireOwner, (req: Request, res: Response) => {
  try {
    const updated = crmDb.updateInquiry(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Helper to sanitize phone for WhatsApp
function sanitizePhoneForWhatsApp(phone?: string): string {
  if (!phone) return '';
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('00')) digits = digits.substring(2);
  if (digits.startsWith('03') && digits.length === 11) {
    digits = '92' + digits.substring(1);
  }
  return digits;
}

// Send Real Reply to Client Inquiry (WhatsApp, Gmail Web, Mailto, or SMTP)
app.post('/api/inquiries/:id/reply', requireOwner, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { replyMessage, channel = 'WHATSAPP', subject } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ error: 'Reply message text is required.' });
    }

    const inquiry = crmDb.getInquiryById(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    const cleanMsg = replyMessage.trim();
    const cleanSubject = subject?.trim() || `Re: ${inquiry.service} Inquiry - Mahnoor Digital Solution`;
    const now = new Date().toISOString();

    // Prepare dispatch URLs
    const formattedPhone = sanitizePhoneForWhatsApp(inquiry.whatsapp || inquiry.phone);
    const whatsappUrl = formattedPhone ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(cleanMsg)}` : undefined;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inquiry.email)}&su=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(cleanMsg)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(cleanMsg)}`;

    // Try automated SMTP dispatch if channel is EMAIL and SMTP is configured
    let directEmailDispatched = false;
    let emailError: string | undefined;
    const integrations = crmDb.getIntegrations();

    if (channel === 'EMAIL' && integrations.isEmailConfigured) {
      try {
        const emailResult = await DiscoveryEngine.sendRealEmail({
          lead: {
            id: inquiry.id,
            company: inquiry.clientName,
            domain: inquiry.email.split('@')[1] || 'client.com',
            country: 'Inquiry',
            city: 'Online',
            industry: inquiry.service,
            website: inquiry.sourcePage || 'Online Submission',
            email: inquiry.email,
            isEmailVerified: true,
            socialProfiles: {},
            possibleDecisionMaker: inquiry.clientName,
            potentialProblem: inquiry.message,
            recommendedService: inquiry.service,
            reasonRelevant: 'Website Inquiry Reply',
            leadFit: 'HIGH',
            leadFitReasons: ['Direct client submission'],
            discoveryDate: new Date().toISOString().split('T')[0],
            leadSource: inquiry.sourcePage || '/contact',
            emailStatus: 'SENT',
            subjectOptions: [],
            selectedSubject: cleanSubject,
            pitchBody: cleanMsg,
            whatsappPitch: '',
            followUpPitch: '',
            optedOut: false,
            hasReplied: true,
            conversationHistory: [],
            createdAt: now,
            updatedAt: now,
          },
          subject: cleanSubject,
          body: cleanMsg,
        });

        directEmailDispatched = emailResult.success;
        if (!emailResult.success) {
          emailError = emailResult.error;
        }
      } catch (err) {
        emailError = err instanceof Error ? err.message : String(err);
      }
    }

    // Update Inquiry state: Mark as Responded and record in timeline
    const updatedInquiry = crmDb.updateInquiry(id, {
      responsePending: false,
      status: 'RESPONDED',
      respondedAt: now,
      notes: inquiry.notes
        ? `${inquiry.notes}\n[Reply via ${channel} - ${new Date().toLocaleDateString()}]: ${cleanMsg.substring(0, 120)}...`
        : `[Reply via ${channel} - ${new Date().toLocaleDateString()}]: ${cleanMsg.substring(0, 120)}...`,
    });

    if (updatedInquiry && updatedInquiry.timeline) {
      updatedInquiry.timeline.unshift({
        id: `tl-${Date.now()}-rep`,
        type: 'STATUS_CHANGE',
        title: `Reply Dispatched via ${channel}`,
        detail: `Message sent to ${inquiry.clientName} (${inquiry.email}): "${cleanMsg}"`,
        timestamp: now,
      });
    }

    // Update Client history timeline as well
    const client = crmDb.getClients().find((c) => c.email.toLowerCase() === inquiry.email.toLowerCase());
    if (client) {
      crmDb.addClientTimelineNote(
        client.id,
        `Reply sent via ${channel} regarding "${inquiry.service}": "${cleanMsg}"`
      );
    }

    crmDb.logAudit({
      action: 'INQUIRY_REPLY_SENT',
      companyName: inquiry.clientName,
      details: `Reply sent via ${channel} to ${inquiry.clientName} (${inquiry.email}). Message: "${cleanMsg.substring(0, 80)}..."`,
      status: 'SUCCESS',
    });

    res.json({
      success: true,
      inquiry: updatedInquiry,
      channel,
      whatsappUrl,
      gmailUrl,
      mailtoUrl,
      directEmailDispatched,
      emailError,
      message: directEmailDispatched
        ? 'Reply successfully sent via automated server email and recorded in timeline.'
        : `Reply recorded. Direct 1-click links ready for ${channel}.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Delete inquiry
app.delete('/api/inquiries/:id', requireOwner, (req: Request, res: Response) => {
  const success = crmDb.deleteInquiry(req.params.id);
  res.json({ success });
});

// --- OWNER NOTIFICATIONS ---

// Get notifications
app.get('/api/notifications', requireOwner, (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  res.json(crmDb.getNotifications(limit));
});

// Mark notification(s) as read
app.post('/api/notifications/mark-read', requireOwner, (req: Request, res: Response) => {
  const { id } = req.body;
  const success = crmDb.markNotificationRead(id);
  res.json({ success });
});

// --- CLIENT HISTORY (FULL LIFECYCLE) ---

// Get all clients with timeline
app.get('/api/clients', requireOwner, (req: Request, res: Response) => {
  try {
    const clients = crmDb.getClients(req.query.search as string);
    res.json(clients);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Get single client
app.get('/api/clients/:id', requireOwner, (req: Request, res: Response) => {
  const client = crmDb.getClientById(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
});

// Add note to client history
app.post('/api/clients/:id/notes', requireOwner, (req: Request, res: Response) => {
  const { note } = req.body;
  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Note text is required.' });
  }
  const updated = crmDb.addClientTimelineNote(req.params.id, note.trim());
  if (!updated) return res.status(404).json({ error: 'Client not found' });
  res.json(updated);
});

// --- EMAIL HISTORY (SENT EMAILS RECORD) ---

// Get sent emails history (filter: ALL | TODAY | OLDER)
app.get('/api/emails/history', requireOwner, (req: Request, res: Response) => {
  try {
    const filter = (req.query.filter as 'ALL' | 'TODAY' | 'OLDER') || 'ALL';
    const history = crmDb.getEmailHistory(filter);
    res.json(history);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// CRM Stats
app.get('/api/crm/stats', requireOwner, (_req: Request, res: Response) => {
  try {
    const stats = crmDb.getStats();
    res.json(stats);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Get Leads with filtering
app.get('/api/crm/leads', requireOwner, (req: Request, res: Response) => {
  try {
    const { status, search, country, industry, leadFit } = req.query;
    const leads = crmDb.getLeads({
      status: status as string,
      search: search as string,
      country: country as string,
      industry: industry as string,
      leadFit: leadFit as string,
    });
    res.json(leads);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Get single lead by ID
app.get('/api/crm/leads/:id', requireOwner, (req: Request, res: Response) => {
  const lead = crmDb.getLeadById(req.params.id);
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json(lead);
});

// Real Client Discovery Engine endpoint
app.post('/api/crm/leads/discover', requireOwner, async (req: Request, res: Response) => {
  try {
    const { targetCountry, targetNiche, count } = req.body;
    const result = await DiscoveryEngine.discoverRealProspects({
      targetCountry,
      targetNiche,
      count: count ? parseInt(count, 10) : 5,
    });
    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Custom website audit and real lead extraction
app.post('/api/crm/leads/custom-audit', requireOwner, async (req: Request, res: Response) => {
  try {
    const { url, companyName, country, industry } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const verification = await DiscoveryEngine.verifyWebsite(url);
    if (!verification.reachable) {
      return res.status(400).json({
        error: `Website at ${url} could not be reached (Status: ${verification.status || 'Offline'}). Please verify the domain is live.`,
      });
    }

    // Generate pitches and analysis
    const cleanDomain = url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '').trim();
    const pitches = await DiscoveryEngine.generatePitchForLead({
      company: companyName || cleanDomain,
      country: country || 'International',
      domain: cleanDomain,
      decisionMaker: 'Business Owner / Principal',
      potentialProblem: 'Website redesign and mobile responsiveness opportunity.',
      recommendedService: 'WordPress Website Redesign & Elementor Speed Revamp',
      reasonRelevant: 'Live business website audit with confirmed domain resolution.',
    });

    const added = crmDb.addLead({
      company: companyName || cleanDomain,
      domain: cleanDomain,
      country: country || 'International',
      city: 'Live Website Verified',
      industry: industry || 'Commercial Enterprise',
      website: verification.resolvedUrl,
      email: 'Unavailable',
      isEmailVerified: false,
      socialProfiles: {},
      possibleDecisionMaker: 'Business Owner',
      potentialProblem: 'Sluggish mobile layout and opportunities for modern layout architecture.',
      recommendedService: 'WordPress Website Redesign & Elementor Speed Revamp',
      reasonRelevant: 'Live business website audit with confirmed domain resolution.',
      leadFit: 'HIGH',
      leadFitReasons: ['Website HTTP status 200 confirmed', 'Live commercial domain'],
      discoveryDate: new Date().toISOString().split('T')[0],
      leadSource: 'Custom Domain Verification Audit',
      emailStatus: 'DRAFT',
      subjectOptions: pitches.subjectOptions,
      selectedSubject: pitches.subjectOptions[0],
      pitchBody: pitches.pitchBody,
      whatsappPitch: pitches.whatsappPitch,
      followUpPitch: pitches.followUpPitch,
      optedOut: false,
      hasReplied: false,
    });

    if (!added.success) {
      return res.status(409).json({ error: added.error });
    }

    res.json(added.lead);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Update lead details or subject
app.put('/api/crm/leads/:id', requireOwner, (req: Request, res: Response) => {
  try {
    const updated = crmDb.updateLead(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Shared send logic used by both the manual "Approve & Send" button and the
// automatic daily pipeline. Every outreach email gets an unsubscribe line
// appended — required for unsolicited cold email under CAN-SPAM/GDPR, and
// it also feeds the /api/crm/leads/:id/opt-out flow already in this app.
function withUnsubscribeFooter(body: string, leadId: string): string {
  const footer =
    `\n\n---\nDon't want future emails from me? Just reply "STOP" or "UNSUBSCRIBE" and I will not contact you again.\n` +
    `Mahnoor Naaz — Mahnoor Digital Solution — ${process.env.EMAIL_SENDER || 'mahambitget9807@gmail.com'}`;
  if (body.includes('UNSUBSCRIBE') || body.includes('STOP')) return body; // already has one
  return `${body}${footer}`;
}

async function sendOutreachToLead(
  lead: CrmLead,
  overrideSubject?: string,
  overrideBody?: string
): Promise<{
  success: boolean;
  error?: string;
  integrationError?: boolean;
  mailtoUrl?: string;
  updatedLead?: CrmLead;
  messageId?: string;
  provider?: string;
  whatsappAlert?: any;
}> {
  if (lead.optedOut) {
    return { success: false, error: 'This lead has opted out (DO NOT CONTACT). Outreach is blocked.' };
  }
  if (!lead.email || lead.email === 'Unavailable' || !lead.email.includes('@')) {
    return { success: false, error: 'Lead email is currently marked as Unavailable. Please add a verified business email before sending.' };
  }

  const finalSubject = overrideSubject || lead.selectedSubject;
  const finalBody = withUnsubscribeFooter(overrideBody || lead.pitchBody, lead.id);

  const dispatchResult = await DiscoveryEngine.sendRealEmail({ lead, subject: finalSubject, body: finalBody });

  if (!dispatchResult.success) {
    crmDb.logAudit({
      action: 'EMAIL_DISPATCH_FAILED',
      leadId: lead.id,
      companyName: lead.company,
      details: dispatchResult.error || 'Provider dispatch failed.',
      status: 'ERROR',
    });
    return { success: false, integrationError: true, error: dispatchResult.error, mailtoUrl: dispatchResult.mailtoUrl };
  }

  const newStatus: EmailStatus = 'SENT';
  const updatedLead = crmDb.updateLead(lead.id, {
    selectedSubject: finalSubject,
    pitchBody: finalBody,
    approvedAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    emailStatus: newStatus,
    lastContactDate: new Date().toISOString(),
    nextFollowUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const integrations = crmDb.getIntegrations();
  crmDb.appendConversation(lead.id, {
    sender: 'me',
    senderEmail: integrations.emailSenderAddress,
    recipientEmail: lead.email,
    subject: finalSubject,
    body: finalBody,
    channel: 'email',
    status: newStatus,
    messageId: dispatchResult.messageId,
  });

  const whatsappAlert = await DiscoveryEngine.sendWhatsAppAlert({
    type: 'EMAIL_SENT',
    company: lead.company,
    email: lead.email,
    subject: finalSubject,
    providerResult: `CONFIRMED (ID: ${dispatchResult.messageId || 'Provider Verified'})`,
  });

  crmDb.logAudit({
    action: 'EMAIL_APPROVED_AND_SENT',
    leadId: lead.id,
    companyName: lead.company,
    details: `Email confirmed sent via ${dispatchResult.provider} (ID: ${dispatchResult.messageId}).`,
    status: 'SUCCESS',
  });

  return { success: true, updatedLead: updatedLead || undefined, messageId: dispatchResult.messageId, provider: dispatchResult.provider, whatsappAlert };
}

// Manual "Approve & Send" — still available for one-off review-then-send,
// e.g. for a lead you want to personalize by hand before it goes out.
app.post('/api/crm/leads/:id/approve-and-send', requireOwner, async (req: Request, res: Response) => {
  try {
    const lead = crmDb.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const { subject, body } = req.body;
    const result = await sendOutreachToLead(lead, subject, body);

    if (!result.success) {
      return res.status(result.integrationError ? 422 : 400).json({
        success: false,
        integrationError: result.integrationError,
        error: result.error,
        mailtoUrl: result.mailtoUrl,
        lead,
      });
    }

    res.json({
      success: true,
      lead: result.updatedLead,
      status: 'SENT',
      deliveryConfirmed: true,
      provider: result.provider,
      messageId: result.messageId,
      whatsappAlert: result.whatsappAlert,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Confirm external send from mail client
app.post('/api/crm/leads/:id/confirm-sent', requireOwner, (req: Request, res: Response) => {
  try {
    const lead = crmDb.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const integrations = crmDb.getIntegrations();
    const updatedLead = crmDb.updateLead(lead.id, {
      approvedAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      emailStatus: 'SENT',
      lastContactDate: new Date().toISOString(),
      nextFollowUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    crmDb.appendConversation(lead.id, {
      sender: 'me',
      senderEmail: integrations.emailSenderAddress,
      recipientEmail: lead.email,
      subject: lead.selectedSubject,
      body: lead.pitchBody,
      channel: 'email',
      status: 'SENT',
    });

    crmDb.logAudit({
      action: 'EMAIL_SENT_CONFIRMED',
      leadId: lead.id,
      companyName: lead.company,
      details: `Dispatched confirmed from ${integrations.emailSenderAddress} via native mail client.`,
      status: 'SUCCESS',
    });

    res.json({ success: true, lead: updatedLead });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Skip / archive lead
app.post('/api/crm/leads/:id/skip', requireOwner, (req: Request, res: Response) => {
  try {
    const updated = crmDb.updateLead(req.params.id, {
      emailStatus: 'NOT INTERESTED',
    });
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Follow-up generator
app.post('/api/crm/leads/:id/follow-up', requireOwner, async (req: Request, res: Response) => {
  try {
    const lead = crmDb.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    if (lead.optedOut) {
      return res.status(400).json({ error: 'Client is opted out. Follow-ups are prohibited.' });
    }

    const updated = crmDb.updateLead(lead.id, {
      emailStatus: 'FOLLOW-UP DUE',
    });

    // WhatsApp Alert for follow-up
    await DiscoveryEngine.sendWhatsAppAlert({
      type: 'FOLLOW_UP_DUE',
      company: lead.company,
      email: lead.email,
      subject: lead.selectedSubject,
      dueDate: lead.nextFollowUpDate || new Date().toISOString().split('T')[0],
    });

    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Opt-out / DO NOT CONTACT
app.post('/api/crm/leads/:id/opt-out', requireOwner, (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const updated = crmDb.updateLead(req.params.id, {
      optedOut: true,
      optedOutReason: reason || 'Manual opt-out requested by recipient',
      emailStatus: 'DO NOT CONTACT',
    });

    crmDb.logAudit({
      action: 'MANUAL_OPT_OUT',
      leadId: req.params.id,
      companyName: updated?.company,
      details: `Lead marked as DO NOT CONTACT: ${reason || 'Opted out'}.`,
      status: 'WARNING',
    });

    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Delete lead
app.delete('/api/crm/leads/:id', requireOwner, (req: Request, res: Response) => {
  const success = crmDb.deleteLead(req.params.id);
  res.json({ success });
});

// --- INCOMING CLIENT REPLIES & AI ASSISTANT ---

// Get all leads with replies
app.get('/api/crm/replies', requireOwner, (_req: Request, res: Response) => {
  try {
    const leadsWithReplies = crmDb.getLeads().filter((l) => l.hasReplied || l.emailStatus === 'REPLIED');
    res.json(leadsWithReplies);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Real Inbound Email Webhook (for SendGrid Inbound Parse, Postmark, Mailgun, Zapier forwarder)
app.post('/api/crm/replies/incoming', async (req: Request, res: Response) => {
  try {
    const { senderEmail, subject, body } = req.body;

    if (!senderEmail || !body) {
      return res.status(400).json({ error: 'senderEmail and body are required.' });
    }

    const cleanSender = senderEmail.toLowerCase().trim();
    const domainFromSender = cleanSender.split('@')[1] || '';

    const leads = crmDb.getLeads();
    const matchedLead = leads.find((l) => {
      if (l.email && l.email.toLowerCase() === cleanSender) return true;
      if (domainFromSender && l.domain.toLowerCase().includes(domainFromSender)) return true;
      return false;
    });

    if (!matchedLead) {
      crmDb.logAudit({
        action: 'INCOMING_REPLY_UNMATCHED',
        details: `Received inbound email from ${cleanSender} but could not match to an active lead in database.`,
        status: 'WARNING',
      });
      return res.status(404).json({ error: 'Client reply could not be matched to an active lead.' });
    }

    // Append to conversation
    crmDb.appendConversation(matchedLead.id, {
      sender: 'client',
      senderEmail: cleanSender,
      recipientEmail: crmDb.getIntegrations().emailSenderAddress,
      subject: subject || `Re: ${matchedLead.selectedSubject}`,
      body,
      channel: 'email',
    });

    // Real WhatsApp notification
    await DiscoveryEngine.sendWhatsAppAlert({
      type: 'CLIENT_REPLY',
      company: matchedLead.company,
      email: cleanSender,
      actualReply: body,
    });

    // Generate AI response draft (awaits user approval)
    const suggested = await DiscoveryEngine.generateReplyResponse(matchedLead, body);
    crmDb.updateLead(matchedLead.id, { suggestedAiResponse: suggested });

    res.json({
      success: true,
      matchedLeadId: matchedLead.id,
      company: matchedLead.company,
      message: 'Inbound client reply matched and conversation updated.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Record an actual received client reply verified from mahambitget9807@gmail.com
app.post('/api/crm/replies/record-verified', requireOwner, async (req: Request, res: Response) => {
  try {
    const { leadId, actualMessage, subject } = req.body;
    if (!leadId || !actualMessage) {
      return res.status(400).json({ error: 'leadId and actualMessage are required.' });
    }

    const lead = crmDb.getLeadById(leadId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    // Append to conversation
    crmDb.appendConversation(lead.id, {
      sender: 'client',
      senderEmail: lead.email,
      recipientEmail: crmDb.getIntegrations().emailSenderAddress,
      subject: subject || `Re: ${lead.selectedSubject}`,
      body: actualMessage.trim(),
      channel: 'email',
    });

    // Trigger Real WhatsApp Alert
    const whatsappAlert = await DiscoveryEngine.sendWhatsAppAlert({
      type: 'CLIENT_REPLY',
      company: lead.company,
      email: lead.email,
      actualReply: actualMessage.trim(),
    });

    // Generate AI response proposal
    const suggested = await DiscoveryEngine.generateReplyResponse(lead, actualMessage.trim());
    const updatedLead = crmDb.updateLead(lead.id, { suggestedAiResponse: suggested });

    crmDb.logAudit({
      action: 'CLIENT_REPLY_RECORDED',
      leadId: lead.id,
      companyName: lead.company,
      details: `Actual client reply recorded for ${lead.company} ("${actualMessage.substring(0, 80)}...").`,
      status: 'SUCCESS',
    });

    res.json({
      success: true,
      lead: updatedLead,
      suggestedAiResponse: suggested,
      whatsappAlert,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// REAL IMAP INBOX MONITOR FOR mahambitget9807@gmail.com
// Connects to email inbox, checks for replies from known leads, and triggers WhatsApp alerts
app.post('/api/crm/replies/sync', requireOwner, async (_req: Request, res: Response) => {
  const integrations = crmDb.getIntegrations();
  const host = integrations.imapHost || 'imap.gmail.com';
  const port = integrations.imapPort || 993;
  const user = integrations.imapUser || integrations.emailSenderAddress;
  const password = integrations.imapPassword || integrations.smtpPassword;

  if (!host || !user || !password) {
    const errorMsg = `⚠️ INTEGRATION ERROR: Real IMAP sync for ${user} requires IMAP connection credentials (Host: ${host}, Port: ${port}, User: ${user}, and Google App Password). Configure credentials in the Integrations tab.`;
    crmDb.updateIntegrations({ lastImapError: errorMsg });
    return res.status(422).json({
      success: false,
      integrationError: true,
      error: errorMsg,
      newRepliesFound: 0,
    });
  }

  try {
    const connection = await imaps.connect({
      imap: {
        user,
        password,
        host,
        port,
        tls: port === 993,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 8000,
      },
    });

    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: false };
    const messages = await connection.search(searchCriteria, fetchOptions);

    let newReplies = 0;
    const leads = crmDb.getLeads();

    for (const item of messages) {
      const all = item.parts.find((part) => part.which === '');
      const id = item.attributes.uid;
      const idHeader = `Imap-Id: ${id}\r\n`;

      if (all) {
        const mail = await simpleParser(idHeader + all.body);
        const fromEmail = mail.from?.value?.[0]?.address?.toLowerCase() || '';
        const htmlString = typeof mail.html === 'string' ? mail.html.replace(/<[^>]*>?/gm, '') : '';
        const bodyText = mail.text || htmlString || '';

        const matchedLead = leads.find((l) => {
          if (!l.email || l.email === 'Unavailable') return false;
          return l.email.toLowerCase() === fromEmail;
        });

        if (matchedLead && bodyText) {
          crmDb.appendConversation(matchedLead.id, {
            sender: 'client',
            senderEmail: fromEmail,
            recipientEmail: user,
            subject: mail.subject || `Re: ${matchedLead.selectedSubject}`,
            body: bodyText.trim(),
            channel: 'email',
          });

          await DiscoveryEngine.sendWhatsAppAlert({
            type: 'CLIENT_REPLY',
            company: matchedLead.company,
            email: fromEmail,
            actualReply: bodyText.trim(),
          });

          const suggested = await DiscoveryEngine.generateReplyResponse(matchedLead, bodyText.trim());
          crmDb.updateLead(matchedLead.id, { suggestedAiResponse: suggested });

          newReplies++;
        }
      }
    }

    connection.end();
    crmDb.updateIntegrations({ lastImapError: undefined, lastInboxSync: new Date().toISOString() });

    res.json({
      success: true,
      newRepliesFound: newReplies,
      syncTime: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const errorMsg = `⚠️ INTEGRATION ERROR: Real IMAP sync for ${user} failed: ${msg}. Fix: Check your Google App Password / IMAP settings in the Integrations tab.`;
    crmDb.updateIntegrations({ lastImapError: errorMsg });
    res.status(422).json({
      success: false,
      integrationError: true,
      error: errorMsg,
      newRepliesFound: 0,
    });
  }
});

// AI Reply Assistant: Draft professional consultative response
app.post('/api/crm/replies/:id/generate-response', requireOwner, async (req: Request, res: Response) => {
  try {
    const lead = crmDb.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const clientMsg = req.body.clientMessage || lead.lastClientMessage || 'Hello, could you provide more details and pricing?';
    const suggested = await DiscoveryEngine.generateReplyResponse(lead, clientMsg);

    const updated = crmDb.updateLead(lead.id, {
      suggestedAiResponse: suggested,
    });

    res.json({
      suggestedResponse: suggested,
      lead: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Send approved response to client
app.post('/api/crm/replies/:id/send-response', requireOwner, async (req: Request, res: Response) => {
  try {
    const lead = crmDb.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const { responseBody } = req.body;
    if (!responseBody) return res.status(400).json({ error: 'Response body required' });

    const dispatchResult = await DiscoveryEngine.sendRealEmail({
      lead,
      subject: `Re: ${lead.selectedSubject}`,
      body: responseBody,
    });

    const integrations = crmDb.getIntegrations();
    const cleanPhone = sanitizePhoneForWhatsApp(lead.phone);
    const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(responseBody)}` : undefined;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}&su=${encodeURIComponent(`Re: ${lead.selectedSubject}`)}&body=${encodeURIComponent(responseBody)}`;
    const mailtoUrl = dispatchResult.mailtoUrl || `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(`Re: ${lead.selectedSubject}`)}&body=${encodeURIComponent(responseBody)}`;

    // Append to conversation
    crmDb.appendConversation(lead.id, {
      sender: 'me',
      senderEmail: integrations.emailSenderAddress,
      recipientEmail: lead.email,
      subject: `Re: ${lead.selectedSubject}`,
      body: responseBody,
      channel: 'email',
      messageId: dispatchResult.messageId || `manual-${Date.now()}`,
    });

    crmDb.updateLead(lead.id, {
      suggestedAiResponse: undefined,
      lastContactDate: new Date().toISOString(),
      emailStatus: 'SENT',
    });

    if (!dispatchResult.success) {
      return res.json({
        success: true,
        directEmailDispatched: false,
        integrationError: true,
        error: dispatchResult.error,
        mailtoUrl,
        gmailUrl,
        whatsappUrl,
        message: 'Response recorded in conversation history. 1-click dispatch links ready for Gmail & WhatsApp.',
      });
    }

    res.json({
      success: true,
      directEmailDispatched: true,
      provider: dispatchResult.provider,
      messageId: dispatchResult.messageId,
      gmailUrl,
      whatsappUrl,
      mailtoUrl,
      message: 'Response dispatched via provider.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Provider bounce webhook
app.post('/api/crm/webhooks/bounce', async (req: Request, res: Response) => {
  try {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const clean = email.toLowerCase().trim();
    const leads = crmDb.getLeads();
    const matched = leads.find((l) => l.email.toLowerCase() === clean);

    if (matched) {
      crmDb.updateLead(matched.id, {
        emailStatus: 'BOUNCED',
      });

      await DiscoveryEngine.sendWhatsAppAlert({
        type: 'EMAIL_BOUNCED',
        company: matched.company,
        email: clean,
        bounceReason: reason || 'Mailbox unavailable',
      });

      crmDb.logAudit({
        action: 'EMAIL_BOUNCED',
        leadId: matched.id,
        companyName: matched.company,
        details: `Bounce notification recorded: ${reason || 'Delivery failure'}.`,
        status: 'WARNING',
      });
    }

    res.json({ success: true, matched: Boolean(matched) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// --- INTEGRATIONS & SETTINGS ---

// Get integrations
app.get('/api/crm/integrations', requireOwner, (_req: Request, res: Response) => {
  const integrations = crmDb.getIntegrations();
  res.json({
    ...integrations,
    resendApiKey: integrations.resendApiKey ? '••••••••••••••••' : undefined,
    sendgridApiKey: integrations.sendgridApiKey ? '••••••••••••••••' : undefined,
    smtpPassword: integrations.smtpPassword ? '••••••••••••••••' : undefined,
    imapPassword: integrations.imapPassword ? '••••••••••••••••' : undefined,
    whatsappAccessToken: integrations.whatsappAccessToken ? '••••••••••••••••' : undefined,
    twilioAuthToken: integrations.twilioAuthToken ? '••••••••••••••••' : undefined,
  });
});

// Update integrations
app.post('/api/crm/integrations', requireOwner, (req: Request, res: Response) => {
  try {
    const updated = crmDb.updateIntegrations(req.body);
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Real WhatsApp alert trigger / tester
app.post('/api/crm/notifications/whatsapp', requireOwner, async (req: Request, res: Response) => {
  try {
    const { type, company, country, website, service, email, details, actualReply } = req.body;
    const result = await DiscoveryEngine.sendWhatsAppAlert({
      type: (type as WhatsAppNotificationType) || 'NEW_CLIENT',
      company: company || 'Apex Dental Care & Implant Center',
      country: country || 'United Kingdom',
      website: website || 'https://apexdentalcare.org',
      service: service || 'WordPress & Elementor Revamp',
      email: email || 'info@apexdentalcare.org',
      details: details || 'Sluggish mobile load speed and non-responsive patient booking form',
      actualReply,
    });
    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Trigger the daily acquisition pipeline manually (owner login required).
// Discovers up to DAILY_OUTREACH_LIMIT (default 10) new leads and auto-sends
// an outreach email to each one — no "Approve & Send" click needed per lead.
const DAILY_OUTREACH_LIMIT = process.env.DAILY_OUTREACH_LIMIT ? parseInt(process.env.DAILY_OUTREACH_LIMIT, 10) : 10;

app.post('/api/crm/cron/daily-acquisition', requireOwner, async (_req: Request, res: Response) => {
  try {
    const result = await DiscoveryEngine.runDailyPipeline((lead) => sendOutreachToLead(lead), DAILY_OUTREACH_LIMIT);
    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

// Self-contained daily scheduler: runs once per process, checks once an hour
// whether today's automated run has already happened (via lastDailyRun in
// the database). This only fires while the server process is awake — see
// the hosting notes for why a free-tier host that sleeps needs an external
// pinger/cron (e.g. cron-job.org) instead of relying on this alone.
function startDailyScheduler() {
  const CHECK_INTERVAL_MS = 60 * 60 * 1000; // check every hour
  setInterval(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const last = crmDb.getLastDailyRun();
      const lastDay = last ? last.split('T')[0] : undefined;
      if (lastDay === today) return; // already ran today
      console.log('[Daily Scheduler] Running automated acquisition pipeline...');
      const result = await DiscoveryEngine.runDailyPipeline((lead) => sendOutreachToLead(lead), DAILY_OUTREACH_LIMIT);
      console.log('[Daily Scheduler] Result:', result.auditLog);
    } catch (err) {
      console.error('[Daily Scheduler] Error:', err);
    }
  }, CHECK_INTERVAL_MS);
}

// Audit logs
app.get('/api/crm/audit-logs', requireOwner, (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
  res.json(crmDb.getAuditLogs(limit));
});

// --- VITE MIDDLEWARE (DEV) OR STATIC ASSETS (PROD) ---

async function setupServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mahnoor Digital Solution CRM] Server running on http://0.0.0.0:${PORT}`);
  });
}

startDailyScheduler();

setupServer().catch((err) => {
  console.error('[Server Startup Error]:', err);
});
