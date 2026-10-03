import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown, RefreshCw, Search } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const POPULAR_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (Original)', flag: '🇬🇧' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
];

export const ALL_ADDITIONAL_LANGUAGES: LanguageOption[] = [
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇵🇰' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'tl', name: 'Tagalog (Filipino)', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
];

export const ALL_LANGUAGES = [...POPULAR_LANGUAGES, ...ALL_ADDITIONAL_LANGUAGES];

interface LanguageTranslatorProps {
  variant?: 'navbar' | 'compact' | 'drawer';
}

export const LanguageTranslator: React.FC<LanguageTranslatorProps> = ({ variant = 'navbar' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageOption>(POPULAR_LANGUAGES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read existing Google Translate cookie if present
  useEffect(() => {
    try {
      const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      if (match && match[1]) {
        const code = match[1];
        const found = ALL_LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
        if (found) {
          setCurrentLang(found);
        }
      }
    } catch (e) {}
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang: LanguageOption) => {
    setCurrentLang(lang);
    setIsOpen(false);

    try {
      // 1. Set Google Translate cookies
      const host = window.location.hostname;
      const domainParts = host.split('.');
      const rootDomain = domainParts.length > 1 ? `.${domainParts.slice(-2).join('.')}` : host;

      if (lang.code === 'en') {
        // Clear translation
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
      } else {
        document.cookie = `googtrans=/en/${lang.code}; path=/;`;
        document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${host};`;
        document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${rootDomain};`;
      }

      // 2. Trigger native Google Translate select element if initialized
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = lang.code === 'en' ? '' : lang.code;
        combo.dispatchEvent(new Event('change'));
      } else {
        // Fallback: reload page to let Google translate read the new cookie
        window.location.reload();
      }
    } catch (e) {
      console.warn('Translate trigger failed:', e);
    }
  };

  const filteredLanguages = ALL_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="btn-language-selector"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-full transition-all duration-200 focus:outline-none ${
          variant === 'drawer'
            ? 'w-full justify-between bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-bold border border-white/15'
            : variant === 'compact'
            ? 'bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs font-semibold rounded-full border border-white/20'
            : 'bg-[#0B706A]/30 hover:bg-[#0B706A]/50 text-white px-3.5 py-1.5 text-xs font-bold rounded-full border border-white/20 shadow-xs'
        }`}
        aria-label="Select Language"
        title="Translate Website to Any Language"
      >
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
          <span className="text-sm">{currentLang.flag}</span>
          <span className="hidden sm:inline font-medium">{currentLang.name}</span>
          {currentLang.code !== 'en' && (
            <span className="text-[10px] bg-[#F5A623] text-black px-1 rounded font-bold uppercase">
              {currentLang.code}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/80 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Language Selection Modal / Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-[#033B39] to-[#075B57] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#F5A623]" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Website Translator
              </span>
            </div>
            {currentLang.code !== 'en' && (
              <button
                type="button"
                onClick={() => changeLanguage(POPULAR_LANGUAGES[0])}
                className="text-[11px] text-[#F5A623] hover:underline font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to English</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="p-2 border-b border-gray-100 bg-[#F8FBFA]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search any language (Urdu, Arabic, Spanish...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Selection List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">
                No language found matching "{searchQuery}"
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = currentLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#064946] text-white font-bold'
                        : 'text-gray-700 hover:bg-[#F0F7F6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base shrink-0">{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                      <span
                        className={`text-[11px] truncate ${
                          isSelected ? 'text-white/80' : 'text-gray-400'
                        }`}
                      >
                        ({lang.nativeName})
                      </span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#F5A623] shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer notice */}
          <div className="p-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 text-center">
            Powered by Google Translate • Real-time multilingual support
          </div>
        </div>
      )}
    </div>
  );
};
