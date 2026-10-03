export type EmailStatus =
  | 'DRAFT'
  | 'APPROVED'
  | 'SENT'
  | 'DELIVERED'
  | 'BOUNCED'
  | 'REPLIED'
  | 'FOLLOW-UP DUE'
  | 'NOT INTERESTED'
  | 'DO NOT CONTACT';

export type LeadFit = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ConversationMessage {
  id: string;
  sender: 'me' | 'client' | 'system';
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  body: string;
  timestamp: string;
  channel: 'email' | 'whatsapp';
  status?: string;
  messageId?: string;
}

export interface CrmLead {
  id: string;
  company: string;
  domain: string;
  country: string;
  city: string;
  industry: string;
  website: string;
  email: string; // If unverified, 'Unavailable'
  isEmailVerified: boolean;
  phone?: string;
  socialProfiles: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  possibleDecisionMaker: string;
  potentialProblem: string;
  recommendedService: string;
  reasonRelevant: string;
  leadFit: LeadFit;
  leadFitReasons: string[];
  discoveryDate: string;
  leadSource: string;
  emailStatus: EmailStatus;
  
  // Outreach drafts
  subjectOptions: string[];
  selectedSubject: string;
  pitchBody: string;
  whatsappPitch: string;
  followUpPitch: string;

  // Tracking
  approvedAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  optedOut: boolean;
  optedOutReason?: string;

  // Reply tracking
  hasReplied: boolean;
  lastReplyDate?: string;
  lastClientMessage?: string;
  suggestedAiResponse?: string;

  // Conversations
  conversationHistory: ConversationMessage[];

  createdAt: string;
  updatedAt: string;
}

export interface IntegrationSettings {
  // Email Provider
  emailProvider: 'smtp' | 'resend' | 'sendgrid' | 'gmail' | 'manual';
  emailSenderAddress: string;
  emailSenderName: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  resendApiKey?: string;
  sendgridApiKey?: string;
  isEmailConfigured: boolean;

  // IMAP Inbox Monitoring
  imapHost?: string;
  imapPort?: number;
  imapUser?: string;
  imapPassword?: string;
  isImapConfigured?: boolean;
  lastInboxSync?: string;

  // WhatsApp Business API
  whatsappProvider: 'cloud_api' | 'twilio' | 'none';
  whatsappPhoneNumberId?: string;
  whatsappAccessToken?: string;
  whatsappRecipientNumber: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromNumber?: string;
  isWhatsappConfigured: boolean;

  // Active Integration Errors (No fake status)
  lastEmailError?: string;
  lastWhatsappError?: string;
  lastImapError?: string;

  // Automation
  dailyDiscoveryEnabled: boolean;
  dailyDiscoveryTime: string; // e.g. "09:00"
  targetDailyLeadsCount: number; // default 10
  autoDraftPitches: boolean;
  requireApprovalBeforeSend: boolean; // default true (mandatory)
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  leadId?: string;
  companyName?: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
}

export interface CrmStats {
  newLeadsToday: number;
  emailsAwaitingApproval: number;
  emailsSent: number;
  bounces: number;
  replies: number;
  interestedLeads: number;
  followUpsDue: number;
  meetings: number;
  convertedClients: number;
  totalLeads: number;
}

export type InquiryStatus =
  | 'NEW'
  | 'PENDING_RESPONSE'
  | 'RESPONDED'
  | 'FOLLOW_UP_SCHEDULED'
  | 'CONVERTED'
  | 'ARCHIVED';

export interface TimelineEvent {
  id: string;
  type: 'INQUIRY' | 'EMAIL' | 'WHATSAPP' | 'REPLY' | 'STATUS_CHANGE' | 'NOTE';
  title: string;
  detail: string;
  timestamp: string;
}

export interface ClientInquiry {
  id: string;
  clientName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  service: string;
  budget?: string;
  message: string;
  preferredDateTime?: string;
  sourcePage: string;
  createdAt: string;
  status: InquiryStatus;
  responsePending: boolean;
  respondedAt?: string;
  followUpDate?: string;
  notes?: string;
  timeline: TimelineEvent[];
}

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  primaryService: string;
  firstInquiryDate: string;
  lastContactDate: string;
  status: 'INQUIRY' | 'PITCHED' | 'REPLIED' | 'ACTIVE_NEGOTIATION' | 'CONVERTED' | 'LOST';
  totalInquiries: number;
  emailsCount: number;
  hasReplied: boolean;
  notes?: string;
  timeline: TimelineEvent[];
}

export interface OwnerNotification {
  id: string;
  type: 'NEW_CLIENT_INQUIRY' | 'CLIENT_REPLY' | 'EMAIL_SENT' | 'FOLLOW_UP_REMINDER' | 'LEAD_GENERATED';
  title: string;
  message: string;
  clientName: string;
  email: string;
  service?: string;
  sourcePage?: string;
  timestamp: string;
  read: boolean;
  inquiryId?: string;
  leadId?: string;
}

export interface OwnerOverview {
  todayNewClients: number;
  todayLeadsCount: number;
  dailyTarget: number;
  todayEmailsSent: number;
  remainingEmails: number;
  newReplies: number;
  pendingResponses: number;
  followUpsDue: number;
  unreadNotificationsCount: number;
  notifications: OwnerNotification[];
  recentInquiries: ClientInquiry[];
  todaySentEmails: Array<{
    id: string;
    company: string;
    email: string;
    subject: string;
    service: string;
    sentAt: string;
    status: string;
    hasReplied: boolean;
    replyAt?: string;
    nextFollowUpDate?: string;
  }>;
}
