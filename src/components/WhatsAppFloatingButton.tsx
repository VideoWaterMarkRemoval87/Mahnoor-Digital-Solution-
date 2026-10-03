import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl } from '../config/portfolioData';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('WordPress Website');
  const [customMsg, setCustomMsg] = useState('');

  const services = [
    'WordPress Website Design',
    'Canva Templates & Branding',
    'Website Speed & Redesign',
    'SEO Content Writing',
  ];

  const handleSend = () => {
    const inquiryText = customMsg.trim()
      ? `Hello Mahnoor! ${customMsg.trim()}`
      : `Hello Mahnoor! I visited your portfolio and I would like a quote for ${selectedService}.`;

    const url = buildWhatsAppUrl(inquiryText);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-[#0B706A]/20 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-left">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#033B39] to-[#075B57] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#033B39] rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Mahnoor Naaz</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                    Online
                  </span>
                </h4>
                <p className="text-[11px] text-white/80 font-medium">
                  Send Message
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#F8FBFA] space-y-3">
            <div className="p-3 bg-white rounded-2xl border border-gray-200 text-xs text-gray-700 shadow-xs">
              <p className="font-medium text-[#033B39] mb-1">
                👋 Hello & Welcome to Mahnoor Digital Solution!
              </p>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                How can I assist your business today? Select a service or type your requirements for a guaranteed rapid reply!
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Service needed:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {services.map((svc) => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => setSelectedService(svc)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-left transition-colors border ${
                      selectedService === svc
                        ? 'bg-[#064946] text-white border-[#064946]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {svc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Quick message / Budget details (optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Need site completed in 5 days"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
              />
            </div>

            <button
              type="button"
              onClick={handleSend}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message on WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-gray-500">
              Direct connection • 100% Guaranteed Fast Response
            </p>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id="btn-whatsapp-floating"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none"
        aria-label="Chat on WhatsApp"
        title="Send Message on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
        <MessageCircle className="w-6 h-6 shrink-0" />
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-xs font-extrabold uppercase tracking-wider">WhatsApp</span>
          <span className="text-[11px] text-white/90 font-medium">
            Send Message
          </span>
        </div>
      </button>
    </div>
  );
};
