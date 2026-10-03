import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Send,
  Mail,
  History,
  Settings,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Sparkles,
  Calendar,
  Lock,
  LogOut,
  ChevronRight,
  TrendingUp,
  FileText,
  Phone,
  ArrowUpRight,
  Eye,
  Check,
  X,
  Target,
  Shield,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { SITE_CONFIG, buildWhatsAppUrl } from '../config/portfolioData';
import { ownerFetch, isOwnerLoggedIn, clearOwnerSession } from '../utils/ownerAuth';

interface OwnerNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  clientName: string;
  email: string;
  service?: string;
  sourcePage?: string;
  timestamp: string;
  read: boolean;
  inquiryId?: string;
}

interface ClientInquiry {
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
  status: string;
  responsePending: boolean;
  respondedAt?: string;
  followUpDate?: string;
  notes?: string;
  timeline: Array<{
    id: string;
    type: string;
    title: string;
    detail: string;
    timestamp: string;
  }>;
}

interface CrmLead {
  id: string;
  company: string;
  domain: string;
  country: string;
  city: string;
  industry: string;
  website: string;
  email: string;
  possibleDecisionMaker: string;
  potentialProblem: string;
  recommendedService: string;
  leadFit: string;
  discoveryDate: string;
  emailStatus: string;
  selectedSubject: string;
  pitchBody: string;
  sentAt?: string;
  nextFollowUpDate?: string;
  hasReplied: boolean;
  lastReplyDate?: string;
  lastClientMessage?: string;
}

interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  primaryService: string;
  firstInquiryDate: string;
  lastContactDate: string;
  status: string;
  totalInquiries: number;
  emailsCount: number;
  hasReplied: boolean;
  notes?: string;
  timeline: Array<{
    id: string;
    type: string;
    title: string;
    detail: string;
    timestamp: string;
  }>;
}

interface EmailHistoryItem {
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
}

interface OwnerOverviewData {
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
  todaySentEmails: any[];
}

export const OwnerDashboard: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isOwnerLoggedIn());
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inquiries' | 'leads' | 'email-history' | 'client-history' | 'settings'
  >('overview');

  // Data states
  const [overview, setOverview] = useState<OwnerOverviewData | null>(null);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([]);
  const [notifications, setNotifications] = useState<OwnerNotification[]>([]);
  const [integrations, setIntegrations] = useState<any>(null);

  // Filters & Loading
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');
  const [emailHistoryFilter, setEmailHistoryFilter] = useState<'ALL' | 'TODAY' | 'OLDER'>('ALL');
  const [inquirySearch, setInquirySearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  // Active inquiry detail modal
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [inquiryNote, setInquiryNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Notification and integration settings form
  const [settingsForm, setSettingsForm] = useState({
    whatsappRecipientNumber: '+923247939635',
    smtpPassword: '',
    smtpUser: SITE_CONFIG.email,
    emailSenderAddress: SITE_CONFIG.email,
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Load all data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [ovRes, inqRes, leadRes, cliRes, mailRes, notifRes, intRes] = await Promise.all([
        ownerFetch('/api/owner/overview'),
        ownerFetch('/api/inquiries'),
        ownerFetch('/api/crm/leads'),
        ownerFetch('/api/clients'),
        ownerFetch(`/api/emails/history?filter=${emailHistoryFilter}`),
        ownerFetch('/api/notifications'),
        ownerFetch('/api/crm/integrations'),
      ]);

      if (ovRes.ok) setOverview(await ovRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (leadRes.ok) setLeads(await leadRes.json());
      if (cliRes.ok) setClients(await cliRes.json());
      if (mailRes.ok) setEmailHistory(await mailRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
      if (intRes.ok) {
        const intData = await intRes.json();
        setIntegrations(intData);
        setSettingsForm((prev) => ({
          ...prev,
          whatsappRecipientNumber: intData.whatsappRecipientNumber || '+923247939635',
          emailSenderAddress: intData.emailSenderAddress || SITE_CONFIG.email,
          smtpUser: intData.smtpUser || SITE_CONFIG.email,
        }));
      }
    } catch (err) {
      console.error('[Dashboard fetch error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, emailHistoryFilter]);

  // Auth Submit
  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/owner/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkeyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.authenticated && data.token) {
        localStorage.setItem('mds_owner_token', data.token);
        localStorage.setItem('mds_owner_token_expires', String(Date.now() + (data.expiresInMs || 0)));
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid credentials. Access is restricted to Studio Owner.');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    clearOwnerSession();
    setIsAuthenticated(false);
  };

  // Open inquiry in detail modal
  const handleOpenInquiry = (inq: ClientInquiry) => {
    setSelectedInquiry(inq);
    setInquiryNote(inq.notes || '');
    setCopiedMessage(false);
    setCopiedEmail(false);
    setCopiedPhone(false);
  };

  // Save private owner note for an inquiry
  const handleSaveInquiryNote = async () => {
    if (!selectedInquiry) return;
    setIsSavingNote(true);
    try {
      const res = await ownerFetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: inquiryNote }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedInquiry(updated);
        setActionSuccessMsg('نوٹ کامیابی سے محفوظ ہو گیا! (Note saved successfully)');
        setTimeout(() => setActionSuccessMsg(''), 4000);
        fetchDashboardData();
      }
    } catch {
      setActionErrorMsg('Failed to save note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setActionErrorMsg('');
    setActionSuccessMsg('');
    try {
      const res = await ownerFetch('/api/crm/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsappRecipientNumber: settingsForm.whatsappRecipientNumber.trim(),
          smtpPassword: settingsForm.smtpPassword.trim() || undefined,
          emailSenderAddress: settingsForm.emailSenderAddress.trim() || SITE_CONFIG.email,
        }),
      });
      if (res.ok) {
        setActionSuccessMsg('سیٹنگز کامیابی سے محفوظ ہو گئیں! (Notification settings updated successfully)');
        setTimeout(() => setActionSuccessMsg(''), 5000);
        fetchDashboardData();
      } else {
        setActionErrorMsg('Failed to update settings.');
      }
    } catch {
      setActionErrorMsg('Connection error saving settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Mark inquiry as responded
  const handleToggleResponded = async (inqId: string, currentPending: boolean) => {
    try {
      const res = await ownerFetch(`/api/inquiries/${inqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responsePending: !currentPending,
          status: currentPending ? 'RESPONDED' : 'PENDING_RESPONSE',
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        if (selectedInquiry && selectedInquiry.id === inqId) {
          setSelectedInquiry(updated);
        }
        setActionSuccessMsg(
          currentPending ? 'Client inquiry marked as Responded!' : 'Marked as Pending Response.'
        );
        setTimeout(() => setActionSuccessMsg(''), 4000);
        fetchDashboardData();
      }
    } catch (err) {
      setActionErrorMsg('Failed to update response status.');
    }
  };

  // Mark all notifications read
  const handleMarkNotificationsRead = async () => {
    try {
      await ownerFetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Real Email Outreach dispatch
  const handleApproveAndSendEmail = async (leadId: string) => {
    setActionErrorMsg('');
    setActionSuccessMsg('');
    try {
      const res = await ownerFetch(`/api/crm/leads/${leadId}/approve-and-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`Email successfully sent to ${data.lead?.company || 'Client'}!`);
        setTimeout(() => setActionSuccessMsg(''), 5000);
        fetchDashboardData();
      } else {
        const err = data.error || 'Email dispatch failed. Please configure SMTP or use Mail Client.';
        setActionErrorMsg(err);
      }
    } catch (err) {
      setActionErrorMsg('Failed to dispatch outreach email.');
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (!inquirySearch.trim()) return true;
    const q = inquirySearch.toLowerCase();
    return (
      inq.clientName.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.service.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q)
    );
  });

  // Filtered clients
  const filteredClients = clients.filter((c) => {
    if (!clientSearch.trim()) return true;
    const q = clientSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.primaryService.toLowerCase().includes(q)
    );
  });

  // --- ACCESS GATE SCREEN (If not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#033B39] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-[#0B706A]/30 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5A623]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#064946] text-[#F5A623] flex items-center justify-center font-bold text-xl shadow-md">
              M
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-[#033B39]">
                Owner Dashboard
              </h1>
              <p className="text-xs text-[#526060]">
                Private Administration & Client Relations
              </p>
            </div>
          </div>

          <p className="text-xs text-[#344040] leading-relaxed mb-6">
            Welcome, <span className="font-bold text-[#064946]">Mahnoor Naaz</span>. This private dashboard monitors real client inquiries, daily leads, email history, and automated notifications.
          </p>

          <form onSubmit={handleAuthenticate} className="space-y-4">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                Owner Access Key or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 'owner' or mahambitget9807@gmail.com"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className="w-full bg-[#F8FBFA] border border-[#0B706A]/25 rounded-xl px-4 py-3.5 text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-4 top-4" />
              </div>
              <p className="text-[11px] text-[#526060] mt-1.5">
                Tip: Enter your registered email (<span className="font-mono text-[#064946]">mahambitget9807@gmail.com</span>) or click Unlock below for instant 1-click access.
              </p>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              <span>Unlock Owner Dashboard</span>
              <Shield className="w-4 h-4 text-[#F5A623]" />
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/"
                className="text-xs text-[#526060] hover:text-[#064946] transition-colors"
              >
                ← Return to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED OWNER DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#F0F4F4] text-[#172222] flex flex-col">
      {/* Top Owner Header Bar */}
      <header className="bg-[#033B39] text-white border-b border-[#0B706A]/40 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#064946] border border-[#F5A623]/40 flex items-center justify-center font-bold text-sm text-[#F5A623] shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight">
                  Owner Dashboard
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F5A623]/20 text-[#F5A623] text-[10px] font-bold uppercase tracking-wider border border-[#F5A623]/40">
                  Private Owner Only
                </span>
              </div>
              <span className="text-[11px] text-white/70 block sm:inline">
                Mahnoor Naaz • Studio Lead & Developer ({SITE_CONFIG.email})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={fetchDashboardData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleMarkNotificationsRead}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {overview && overview.unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {overview.unreadNotificationsCount}
                </span>
              )}
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#F5A623]" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title="Lock Session"
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview (ایک نظر میں)', icon: LayoutDashboard },
            {
              id: 'inquiries',
              label: `Client Inquiries (${inquiries.length})`,
              icon: Users,
              badge: overview?.pendingResponses ? `${overview.pendingResponses} Pending` : undefined,
            },
            {
              id: 'leads',
              label: `Today's Leads (${overview?.todayLeadsCount || 10})`,
              icon: Target,
            },
            { id: 'email-history', label: 'Email History', icon: History },
            { id: 'client-history', label: 'Client History', icon: FileText },
            { id: 'settings', label: 'Notification Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F5A623] text-[#172222] shadow-sm font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Dashboard Canvas */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Flash Notifications */}
        {actionSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg('')} className="text-emerald-700">✕</button>
          </div>
        )}

        {actionErrorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{actionErrorMsg}</span>
            </div>
            <button onClick={() => setActionErrorMsg('')} className="text-amber-700">✕</button>
          </div>
        )}

        {/* --- TAB 1: OVERVIEW (ایک نظر میں اہم معلومات) --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Urgent Notification Banner if New Clients or Replies */}
            {overview && overview.notifications.length > 0 && !overview.notifications[0].read && (
              <div className="bg-gradient-to-r from-[#064946] to-[#0B706A] text-white p-5 rounded-3xl shadow-lg border border-[#F5A623]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5A623] text-[#172222] flex items-center justify-center font-bold shrink-0 shadow-md">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#F5A623]">
                        {overview.notifications[0].title}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-xs text-white/90 mt-0.5 max-w-2xl">
                      {overview.notifications[0].message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const notif = overview.notifications[0];
                      if (notif?.inquiryId) {
                        const targetInq = inquiries.find((i) => i.id === notif.inquiryId);
                        if (targetInq) {
                          handleOpenInquiry(targetInq);
                          return;
                        }
                      }
                      setActiveTab('inquiries');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>میسج کی تفصیل کھولیں (View Details)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkNotificationsRead}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Central Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Metric 1: Today's New Clients */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B706A]/15 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#526060] uppercase tracking-wider">
                    آج کے نئے Clients
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#033B39]">
                  {overview?.todayNewClients ?? 0}
                </div>
                <div className="text-[11px] text-[#526060] mt-1 flex items-center gap-1">
                  <span>New Client Inquiries Today</span>
                </div>
              </div>

              {/* Metric 2: Today's Leads: 10 */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B706A]/15 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#526060] uppercase tracking-wider">
                    آج کی Leads
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#064946]/10 text-[#064946] flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#033B39]">
                  Today's Leads: {overview?.todayLeadsCount ?? 10}
                </div>
                <div className="text-[11px] text-[#526060] mt-1 flex items-center gap-1">
                  <span>Target: {overview?.dailyTarget ?? 10} verified businesses</span>
                </div>
              </div>

              {/* Metric 3: Sent vs Remaining Emails */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B706A]/15 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#526060] uppercase tracking-wider">
                    آج بھیجی گئی Emails
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-bold text-xl sm:text-2xl text-[#033B39]">
                  {overview?.todayEmailsSent ?? 0} Sent
                </div>
                <div className="text-[11px] font-semibold text-amber-700 mt-1">
                  {overview?.remainingEmails ?? 10} Remaining / Scheduled
                </div>
              </div>

              {/* Metric 4: Pending Responses & Follow-ups */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B706A]/15 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#526060] uppercase tracking-wider">
                    Pending Responses
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-800">
                  {overview?.pendingResponses ?? 0}
                </div>
                <div className="text-[11px] text-[#526060] mt-1">
                  Follow-ups Due: {overview?.followUpsDue ?? 0}
                </div>
              </div>
            </div>

            {/* Email Sending Progress Bar */}
            <div className="bg-white rounded-3xl p-6 border border-[#0B706A]/15 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-display font-bold text-base text-[#033B39]">
                    Daily Outreach Status • {overview?.todayEmailsSent ?? 0} of {overview?.dailyTarget ?? 10} Emails Sent
                  </h3>
                  <p className="text-xs text-[#526060]">
                    Real sending pipeline. Emails are marked "Sent" only upon provider confirmation.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 self-start sm:self-auto">
                  {overview && overview.todayEmailsSent >= (overview.dailyTarget || 10)
                    ? '10 میں سے 10 Emails Sent ✓'
                    : `${overview?.dailyTarget ?? 10} میں سے ${overview?.todayEmailsSent ?? 0} Sent — ${overview?.remainingEmails ?? 10} Remaining`}
                </span>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#064946] to-[#F5A623] transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(((overview?.todayEmailsSent || 0) / (overview?.dailyTarget || 10)) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Response Reminder & Latest Inquiries List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/15 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#0B706A]/10 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#033B39] flex items-center gap-2">
                    <span>New Client Inquiries & Response Reminders</span>
                    {overview?.pendingResponses ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold animate-pulse">
                        {overview.pendingResponses} Need Response
                      </span>
                    ) : null}
                  </h3>
                  <p className="text-xs text-[#526060]">
                    Direct contacts from website visitors requiring timely follow-up.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-bold text-[#064946] hover:text-[#F5A623] transition-colors inline-flex items-center gap-1"
                >
                  <span>View All Inquiries ({inquiries.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#526060]">
                  No client inquiries yet. All new contact form submissions will appear here instantly.
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.slice(0, 4).map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        inq.responsePending
                          ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                          : 'bg-[#F8FBFA] border-[#0B706A]/15'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#064946] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {inq.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#033B39]">
                                {inq.clientName}
                              </span>
                              <span className="text-xs text-[#526060]">({inq.email})</span>
                            </div>
                            <div className="text-xs font-semibold text-[#064946]">
                              Client interested in: <span className="text-[#0B706A] underline">{inq.service}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {inq.responsePending ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold flex items-center gap-1 border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              <span>Response Pending</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Responded</span>
                            </span>
                          )}
                          <span className="text-[11px] text-[#526060]">
                            {new Date(inq.createdAt).toLocaleDateString()} at{' '}
                            {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#344040] bg-white p-3 rounded-xl border border-gray-100 my-3 leading-relaxed">
                        "{inq.message}"
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                        <div className="flex items-center gap-3 text-[#526060]">
                          <span>Budget: <strong className="text-[#033B39]">{inq.budget || 'Custom'}</strong></span>
                          <span>•</span>
                          <span>Source: <strong>{inq.sourcePage}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenInquiry(inq)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-xs transition-colors shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>پیغام دیکھیں (View Details)</span>
                          </button>

                          <a
                            href={buildWhatsAppUrl(
                              `Hello ${inq.clientName}! Thank you for reaching out to Mahnoor Digital Solution regarding "${inq.service}". I would love to answer your questions and share a wireframe concept.`,
                              inq.phone || inq.whatsapp || undefined
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`mailto:${inq.email}?subject=Re:%20${encodeURIComponent(inq.service)}%20Inquiry%20-%20Mahnoor%20Digital%20Solution`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#064946] hover:bg-[#033B39] text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email Client</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleToggleResponded(inq.id, inq.responsePending)}
                            className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                          >
                            {inq.responsePending ? 'Mark as Responded' : 'Mark Pending'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 2: INQUIRIES & RESPONSE REMINDERS --- */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/15 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0B706A]/10">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#033B39]">
                    Client Inquiries & Response Queue
                  </h2>
                  <p className="text-xs text-[#526060] mt-1">
                    Every inquiry submitted through the Contact or Client Request pages is logged here with full timeline history.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search inquiries..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="bg-[#F8FBFA] border border-[#0B706A]/20 rounded-xl px-4 py-2 pl-9 text-xs text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946]"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="text-center py-16 text-xs text-[#526060]">
                  No matching inquiries found.
                </div>
              ) : (
                <div className="divide-y divide-[#0B706A]/10 mt-4">
                  {filteredInquiries.map((inq) => (
                    <div key={inq.id} className="py-5 first:pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#064946] text-white flex items-center justify-center font-bold text-base shrink-0">
                            {inq.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#033B39]">{inq.clientName}</h4>
                              <span className="text-xs text-gray-500">• {inq.email}</span>
                              {inq.phone && (
                                <span className="text-xs text-emerald-700 font-mono">({inq.phone})</span>
                              )}
                            </div>
                            <div className="text-xs font-semibold text-[#064946] mt-0.5">
                              Client interested in: <span className="text-[#0B706A] underline">{inq.service}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {inq.responsePending ? (
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1.5 border border-red-200">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              <span>Response Pending</span>
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Responded</span>
                            </span>
                          )}
                          <span className="text-xs text-[#526060]">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#F8FBFA] p-4 rounded-2xl border border-gray-100 my-3 text-xs text-[#344040] leading-relaxed">
                        <div className="font-semibold text-[#064946] mb-1">Client Message:</div>
                        "{inq.message}"
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                        <div className="flex items-center gap-4 text-[#526060]">
                          <span>Budget: <strong className="text-[#033B39]">{inq.budget || 'Custom'}</strong></span>
                          <span>•</span>
                          <span>Source Page: <strong>{inq.sourcePage}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenInquiry(inq)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-xs transition-colors shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>پیغام کی تفصیل (View Message Detail)</span>
                          </button>

                          <a
                            href={buildWhatsAppUrl(
                              `Hello ${inq.clientName}! Thank you for reaching out to Mahnoor Digital Solution regarding "${inq.service}". I would love to discuss your project!`,
                              inq.phone || inq.whatsapp || undefined
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Direct WhatsApp Reply</span>
                          </a>

                          <a
                            href={`mailto:${inq.email}?subject=Re:%20${encodeURIComponent(inq.service)}%20Inquiry%20-%20Mahnoor%20Digital%20Solution`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#064946] hover:bg-[#033B39] text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Send Email</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleToggleResponded(inq.id, inq.responsePending)}
                            className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                          >
                            {inq.responsePending ? 'Mark Responded' : 'Revert to Pending'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: TODAY'S LEAD GENERATION --- */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/15 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0B706A]/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-xl text-[#033B39]">
                      Today's Leads: {overview?.todayLeadsCount || 10}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {overview?.todayEmailsSent ?? 0} Sent • {overview?.remainingEmails ?? 10} Remaining
                    </span>
                  </div>
                  <p className="text-xs text-[#526060] mt-1">
                    Daily high-fit prospective international businesses requiring WordPress, Elementor speed revamps, or Canva branding.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const res = await ownerFetch('/api/crm/leads/discover', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ count: 5 }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setActionSuccessMsg(`Discovered ${data.discovered} fresh verified leads!`);
                          fetchDashboardData();
                        }
                      } catch (e) {
                        setActionErrorMsg('Lead discovery failed.');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#064946] hover:bg-[#033B39] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
                    <span>Discover 5 Fresh Leads</span>
                  </button>
                </div>
              </div>

              {/* Leads List */}
              <div className="space-y-4 mt-6">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 rounded-2xl bg-[#F8FBFA] border border-[#0B706A]/15 hover:border-[#064946] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-[#033B39]">{lead.company}</h4>
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#064946] hover:underline inline-flex items-center gap-1"
                          >
                            <span>{lead.domain}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="text-xs text-[#526060] mt-0.5">
                          {lead.city}, {lead.country} • {lead.industry} • Decision Maker:{' '}
                          <strong className="text-[#033B39]">{lead.possibleDecisionMaker}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            lead.emailStatus === 'SENT' || lead.emailStatus === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.emailStatus === 'REPLIED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Status: {lead.emailStatus}
                        </span>
                        <span className="text-xs text-[#526060]">
                          Discovered: {lead.discoveryDate}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-100 text-xs space-y-1.5 my-3">
                      <div>
                        <strong className="text-[#064946]">Opportunity: </strong>
                        <span className="text-[#344040]">{lead.potentialProblem}</span>
                      </div>
                      <div>
                        <strong className="text-[#064946]">Recommended Service: </strong>
                        <span className="text-[#0B706A] font-semibold">{lead.recommendedService}</span>
                      </div>
                      <div>
                        <strong className="text-[#064946]">Verified Email: </strong>
                        <span className="font-mono text-[#172222]">{lead.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                      <div className="text-[#526060]">
                        Subject: <strong className="text-[#033B39]">"{lead.selectedSubject}"</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {lead.emailStatus !== 'SENT' && lead.emailStatus !== 'REPLIED' ? (
                          <button
                            type="button"
                            onClick={() => handleApproveAndSendEmail(lead.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064946] hover:bg-[#033B39] text-white font-bold text-xs transition-colors shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5 text-[#F5A623]" />
                            <span>Approve & Send Outreach</span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Sent on {lead.sentAt ? new Date(lead.sentAt).toLocaleDateString() : 'Today'}</span>
                          </span>
                        )}

                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent(lead.selectedSubject)}&body=${encodeURIComponent(lead.pitchBody)}`}
                          className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
                        >
                          Open in Mail Client
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: EMAIL HISTORY (تمام بھیجی گئی Emails کا ریکارڈ) --- */}
        {activeTab === 'email-history' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/15 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0B706A]/10">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#033B39]">
                    Email History & Outreach Log
                  </h2>
                  <p className="text-xs text-[#526060] mt-1">
                    Permanent record of all outbound emails, delivery confirmations, recipient replies, and follow-up schedules.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#F8FBFA] p-1 rounded-xl border border-[#0B706A]/20">
                  {(['ALL', 'TODAY', 'OLDER'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setEmailHistoryFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        emailHistoryFilter === filter
                          ? 'bg-[#064946] text-white shadow-xs'
                          : 'text-[#526060] hover:text-[#064946]'
                      }`}
                    >
                      {filter === 'ALL' ? 'All Emails' : filter === 'TODAY' ? "Today's Emails" : 'Older Emails'}
                    </button>
                  ))}
                </div>
              </div>

              {emailHistory.length === 0 ? (
                <div className="text-center py-16 text-xs text-[#526060]">
                  No outbound email records found for this filter.
                </div>
              ) : (
                <div className="divide-y divide-[#0B706A]/10 mt-4">
                  {emailHistory.map((item) => (
                    <div key={item.id} className="py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#033B39]">{item.company}</span>
                              <span className="text-xs text-[#526060]">({item.email})</span>
                            </div>
                            <span className="text-xs font-semibold text-[#064946]">
                              Offered: {item.service}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              item.hasReplied
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.hasReplied ? 'Reply Received' : item.status}
                          </span>
                          <span className="text-xs text-[#526060]">
                            {item.sentAt ? new Date(item.sentAt).toLocaleString() : 'Recent'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-[#344040] bg-[#F8FBFA] p-3 rounded-xl border border-gray-100 my-2">
                        <div className="font-semibold text-[#064946] mb-0.5">Subject: {item.subject}</div>
                        <p className="line-clamp-2 text-gray-600">{item.body}</p>
                      </div>

                      {item.hasReplied && item.lastReplySnippet && (
                        <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs text-purple-950 my-2">
                          <div className="font-bold flex items-center gap-1.5 text-purple-900 mb-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Client Reply ({item.replyDate ? new Date(item.replyDate).toLocaleDateString() : 'Received'}):</span>
                          </div>
                          "{item.lastReplySnippet}"
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-[#526060] pt-1">
                        <div>
                          Next Follow-up Due: <strong>{item.nextFollowUpDate || 'None Scheduled'}</strong>
                        </div>
                        <a
                          href={`mailto:${item.email}?subject=Follow-up:%20${encodeURIComponent(item.subject)}`}
                          className="text-[#064946] font-semibold hover:underline"
                        >
                          Send Follow-up Email →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 5: CLIENT HISTORY (ہر Client کا مکمل ریکارڈ) --- */}
        {activeTab === 'client-history' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/15 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0B706A]/10">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#033B39]">
                    Client History & Relationship Timeline
                  </h2>
                  <p className="text-xs text-[#526060] mt-1">
                    Complete lifecycle: Client → پہلی Inquiry → Service → Email → Reply → Response → Follow-up → Current Status
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search client record..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="bg-[#F8FBFA] border border-[#0B706A]/20 rounded-xl px-4 py-2 pl-9 text-xs text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {filteredClients.length === 0 ? (
                <div className="text-center py-16 text-xs text-[#526060]">
                  No client records found.
                </div>
              ) : (
                <div className="space-y-6 mt-6">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-6 rounded-2xl bg-[#F8FBFA] border border-[#0B706A]/15 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0B706A]/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#064946] text-[#F5A623] flex items-center justify-center font-bold text-base shrink-0">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base text-[#033B39]">{client.name}</h4>
                              <span className="text-xs text-[#526060]">({client.email})</span>
                            </div>
                            <span className="text-xs font-semibold text-[#064946]">
                              Primary Service: {client.primaryService} • Inquiries: {client.totalInquiries}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            Status: {client.status}
                          </span>
                          <span className="text-xs text-[#526060]">
                            First Contact: {new Date(client.firstInquiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Journey Timeline */}
                      <div className="pt-4">
                        <h5 className="text-xs font-bold text-[#064946] uppercase tracking-wider mb-3">
                          Client Journey & History Events:
                        </h5>
                        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#0B706A]/20">
                          {client.timeline.map((ev) => (
                            <div key={ev.id} className="relative">
                              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#064946] ring-4 ring-[#F8FBFA]" />
                              <div className="text-xs font-bold text-[#033B39] flex items-center gap-2">
                                <span>{ev.title}</span>
                                <span className="text-[10px] text-gray-500 font-normal">
                                  {new Date(ev.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{ev.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 6: NOTIFICATION & INTEGRATION SETTINGS --- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
            {/* Explainer Box in Urdu & English */}
            <div className="bg-gradient-to-br from-[#033B39] to-[#064946] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#F5A623]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F5A623] text-[#172222] flex items-center justify-center font-bold shrink-0 shadow-md">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    ای میل یا واٹس ایپ پر میسج کیوں نہیں آیا؟ (Why Didn't You Receive Alerts?)
                  </h3>
                  <span className="text-xs text-[#F5A623]">
                    وضاحت اور فوری حل (Explanation & 1-Click Solution)
                  </span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-white/90 leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                  <strong className="text-[#F5A623] block mb-1">
                    1. Email کا الرٹ خودکار کیوں نہیں آیا؟
                  </strong>
                  بیک اینڈ سرور سے آپ کی جی میل (<span className="font-mono text-[#F5A623]">{SITE_CONFIG.email}</span>) پر خود بخود ای میل بھیجنے کے لیے Google کا <strong>App Password</strong> درکار ہوتا ہے۔ کیونکہ گوگل بغیر پاس ورڈ کے کسی ویب سائٹ کو اپنے سرور سے ای میل بھیجنے کی اجازت نہیں دیتا۔ آپ نیچے اپنا 16 ہندسوں کا Gmail App Password محفوظ کر سکتی ہیں، یا کلائنٹ کو جواب دینے کے لیے ڈیش بورڈ پر موجود <strong>'Email Client'</strong> بٹن دبا سکتی ہیں جو آپ کی Gmail ایپ میں پورا میسج کھول دے گا۔
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                  <strong className="text-[#F5A623] block mb-1">
                    2. WhatsApp پر خودکار میسج کیوں نہیں آیا؟
                  </strong>
                  WhatsApp کے خودکار پس پردہ سسٹم کے لیے Meta کا آفیشل Cloud API اکاؤنٹ چاہیے ہوتا ہے۔ لیکن آپ کو پریشان ہونے کی بالکل ضرورت نہیں ہے: ہم نے آپ کے لیے <strong>1-Click Direct WhatsApp</strong> لنک لگا دیا ہے۔ جب بھی کوئی کلائنٹ آئے، آپ صرف <strong>'WhatsApp Reply'</strong> یا <strong>'پیغام کی تفصیل'</strong> میں واٹس ایپ کے بٹن پر کلک کریں، آپ کے فون یا لیپ ٹاپ پر واٹس ایپ فوراً کھل جائے گا اور کلائنٹ کو میسج سینڈ ہو جائے گا۔
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                  <strong className="text-[#F5A623] block mb-1">
                    3. کلائنٹ کا میسج اب کہاں ہے؟
                  </strong>
                  دونوں کلائنٹس کے تمام پیغامات ڈیش بورڈ میں 100% محفوظ ہیں۔ آپ <strong>'Client Inquiries'</strong> یا <strong>'Overview'</strong> میں جا کر <strong>'پیغام دیکھیں (View Details)'</strong> کے بٹن پر کلک کریں تو ان کا پورا میسج، فون، ای میل اور بجٹ سامنے آ جائے گا۔
                </div>
              </div>
            </div>

            {/* Notification Configuration Form */}
            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/15 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#033B39] mb-1">
                  نوٹیفکیشن اور رابطہ سیٹنگز (Notification Settings)
                </h3>
                <p className="text-xs text-[#526060]">
                  اپنا اصلی واٹس ایپ نمبر اور ترجیحات درج کریں تاکہ تمام لنکس آپ کے درست نمبر سے منسلک ہوں۔
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* WhatsApp Phone Number */}
                <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#0B706A]/20">
                  <label className="block font-bold text-[#064946] mb-1.5 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>آپ کا WhatsApp نمبر (Your WhatsApp Recipient Number)</span>
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappRecipientNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappRecipientNumber: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946]"
                  />
                  <p className="text-[11px] text-[#526060] mt-1">
                    ملکی کوڈ کے ساتھ لکھیں (مثال: +923001234567 یا 03001234567)۔
                  </p>
                </div>

                {/* Email Address */}
                <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#0B706A]/20">
                  <label className="block font-bold text-[#064946] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#064946]" />
                    <span>سٹوڈیو ای میل ایڈریس (Studio Email Address)</span>
                  </label>
                  <input
                    type="email"
                    value={settingsForm.emailSenderAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, emailSenderAddress: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946]"
                  />
                </div>

                {/* Optional Gmail SMTP App Password */}
                <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#0B706A]/20">
                  <label className="block font-bold text-[#064946] mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#F5A623]" />
                    <span>Gmail App Password (اختیاری - خودکار ای میلز کے لیے)</span>
                  </label>
                  <input
                    type="password"
                    value={settingsForm.smtpPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, smtpPassword: e.target.value })}
                    placeholder="16 ہندسوں کا گوگل ایپ پاس ورڈ (e.g. abcd efgh ijkl mnop)"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946]"
                  />
                  <p className="text-[11px] text-[#526060] mt-1">
                    اگر آپ سرور سے بغیر کلک کیے پس پردہ خودکار ای میل بھیجنا چاہتی ہیں تو Google Account → Security → 2-Step Verification → App passwords بنا کر یہاں درج کریں۔ اگر نہ بھی ڈالیں تو ڈائریکٹ Email بٹن سے آپ ایک سیکنڈ میں ای میل بھیج سکتی ہیں۔
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#064946] hover:bg-[#033B39] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {settingsSaving ? 'محفوظ کیا جا رہا ہے...' : 'سیٹنگز محفوظ کریں (Save Notification Settings)'}
                </button>

                <a
                  href={`https://wa.me/${settingsForm.whatsappRecipientNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `*ٹیسٹ الرٹ (Test Alert)*: Mahnoor Digital Solution نوٹیفکیشن سسٹم بالکل درست کام کر رہا ہے! سٹوڈیو ای میل: ${SITE_CONFIG.email}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Test WhatsApp Link</span>
                </a>
              </div>
            </form>
          </div>
        )}

        {/* --- INQUIRY DETAIL MODAL (پیغام کی مکمل تفصیلات) --- */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#0B706A]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="bg-[#033B39] text-white px-6 py-5 flex items-center justify-between border-b border-[#0B706A]/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5A623] text-[#172222] font-extrabold flex items-center justify-center text-lg shadow-sm">
                    {selectedInquiry.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-white">
                        {selectedInquiry.clientName}
                      </h3>
                      {selectedInquiry.responsePending ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/40">
                          Response Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                          Responded ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/70">
                      Client Inquiry Details • {selectedInquiry.service}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#172222]">
                {/* Quick Action Bar */}
                <div className="bg-[#F4F9F8] p-4 rounded-2xl border border-[#0B706A]/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#033B39]">فوری رابطہ (Instant Action):</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Direct WhatsApp to Client */}
                    <a
                      href={`https://wa.me/${(selectedInquiry.whatsapp || selectedInquiry.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedInquiry.clientName}, thank you for contacting Mahnoor Digital Solution regarding "${selectedInquiry.service}". I have reviewed your request and would love to assist you!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp پر میسج بھیجیں</span>
                    </a>

                    {/* Direct Email to Client */}
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re:%20${encodeURIComponent(selectedInquiry.service)}%20Inquiry%20-%20Mahnoor%20Digital%20Solution&body=${encodeURIComponent(
                        `Hello ${selectedInquiry.clientName},\n\nThank you for reaching out to Mahnoor Digital Solution regarding "${selectedInquiry.service}".\n\nI reviewed your project message and would love to discuss the wireframe, schedule, and scope with you.\n\nBest regards,\nMahnoor Naaz | Founder & Lead Developer\nMahnoor Digital Solution\nEmail: mahambitget9807@gmail.com`
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#064946] hover:bg-[#033B39] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email کریں</span>
                    </a>

                    {/* Toggle Responded */}
                    <button
                      type="button"
                      onClick={() => handleToggleResponded(selectedInquiry.id, selectedInquiry.responsePending)}
                      className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 font-semibold text-gray-700 transition-colors cursor-pointer"
                    >
                      {selectedInquiry.responsePending ? 'Mark as Responded ✓' : 'Mark as Pending'}
                    </button>
                  </div>
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Client Email
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-[#033B39] truncate">
                        {selectedInquiry.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedInquiry.email);
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 2000);
                        }}
                        className="text-[#064946] hover:underline font-bold text-[11px] shrink-0 cursor-pointer"
                      >
                        {copiedEmail ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Phone / WhatsApp Number
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-emerald-800 font-mono">
                        {selectedInquiry.phone || selectedInquiry.whatsapp || 'Not provided'}
                      </span>
                      {(selectedInquiry.phone || selectedInquiry.whatsapp) && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedInquiry.phone || selectedInquiry.whatsapp || '');
                            setCopiedPhone(true);
                            setTimeout(() => setCopiedPhone(false), 2000);
                          }}
                          className="text-[#064946] hover:underline font-bold text-[11px] shrink-0 cursor-pointer"
                        >
                          {copiedPhone ? 'Copied ✓' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Selected Service
                    </span>
                    <span className="font-semibold text-xs text-[#064946]">
                      {selectedInquiry.service}
                    </span>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Budget Estimate
                    </span>
                    <span className="font-semibold text-xs text-[#033B39]">
                      {selectedInquiry.budget || 'Custom Scope'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Preferred Schedule (تاریخ اور وقت)
                    </span>
                    <span className="font-semibold text-xs text-[#033B39]">
                      {selectedInquiry.preferredDateTime || 'Flexible'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Source Page & Time
                    </span>
                    <span className="font-semibold text-xs text-[#526060]">
                      {selectedInquiry.sourcePage} • {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Full Verbatim Client Message */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-sm text-[#033B39] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#064946]" />
                      <span>Client کا مکمل میسج (Full Verbatim Message):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedInquiry.message);
                        setCopiedMessage(true);
                        setTimeout(() => setCopiedMessage(false), 2000);
                      }}
                      className="text-xs text-[#064946] hover:text-[#033B39] font-semibold cursor-pointer"
                    >
                      {copiedMessage ? 'Message Copied ✓' : 'Copy Message'}
                    </button>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#0B706A]/20 text-xs text-[#172222] whitespace-pre-wrap leading-relaxed shadow-xs font-sans">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Forward to Owner WhatsApp */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-amber-900 block">
                      یہ میسج اپنے ذاتی WhatsApp پر بھیجنا چاہیں؟
                    </span>
                    <span className="text-[11px] text-amber-800">
                      ایک کلک پر کلائنٹ کے میسج کی مکمل تفصیل اپنے واٹس ایپ میں بھیجیں یا فارورڈ کریں۔
                    </span>
                  </div>
                  <a
                    href={buildWhatsAppUrl(
                      `*نیا کلائنٹ رابطہ (New Client Inquiry)*\n\nنام: ${selectedInquiry.clientName}\nای میل: ${selectedInquiry.email}\nفون/واٹس ایپ: ${selectedInquiry.phone || selectedInquiry.whatsapp || 'N/A'}\nسروس: ${selectedInquiry.service}\nبجٹ: ${selectedInquiry.budget || 'Custom'}\nتاریخ و وقت: ${selectedInquiry.preferredDateTime || 'N/A'}\n\n*میسج:*\n"${selectedInquiry.message}"`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs transition-colors shrink-0 text-center cursor-pointer"
                  >
                    Forward to My WhatsApp
                  </a>
                </div>

                {/* Private Notes on Inquiry */}
                <div>
                  <label className="font-bold text-xs text-[#033B39] block mb-1">
                    Private Owner Notes (ذاتی نوٹس):
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={inquiryNote}
                      onChange={(e) => setInquiryNote(e.target.value)}
                      placeholder="مثال: کلائنٹ سے واٹس ایپ پر بات ہو گئی، بجٹ $1,200 فائنل ہے۔"
                      className="flex-1 bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#064946]"
                    />
                    <button
                      type="button"
                      onClick={handleSaveInquiryNote}
                      disabled={isSavingNote}
                      className="px-4 py-2 bg-[#064946] hover:bg-[#033B39] text-white text-xs font-bold rounded-xl transition-colors shrink-0 self-end cursor-pointer disabled:opacity-50"
                    >
                      {isSavingNote ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>

                {/* Timeline Events */}
                {selectedInquiry.timeline && selectedInquiry.timeline.length > 0 && (
                  <div>
                    <span className="font-bold text-xs text-gray-500 uppercase tracking-wider block mb-2">
                      Inquiry History Timeline:
                    </span>
                    <div className="space-y-2 pl-3 border-l-2 border-[#0B706A]/30">
                      {selectedInquiry.timeline.map((item) => (
                        <div key={item.id} className="text-xs">
                          <div className="font-semibold text-[#033B39] flex items-center gap-2">
                            <span>{item.title}</span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-[11px]">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-gray-500">
                  Inquiry ID: <code className="font-mono text-[#064946]">{selectedInquiry.id}</code>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-5 py-2 rounded-xl bg-[#064946] hover:bg-[#033B39] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Close (بند کریں)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
