'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, ChevronDown } from 'lucide-react';
import { ChatMessage, Platform, Language } from '@/types';
import { createMessages } from '@/data/mockData';
import PlatformBadge from '@/components/ui/PlatformBadge';
import UserHoverCard from '@/components/ui/UserHoverCard';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English',    flag: '🇺🇸' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷' },
  { code: 'ar', label: 'العربية',    flag: '🇸🇦' },
  { code: 'zh', label: '中文',        flag: '🇨🇳' },
];

// Platform colours referenced in filter tabs
const PLATFORM_META: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  all:    { color: '#E8EDF5', bg: 'rgba(232,237,245,0.06)', border: 'rgba(232,237,245,0.12)', icon: '⬡' },
  twitch: { color: '#9146FF', bg: 'rgba(145,70,255,0.10)', border: 'rgba(145,70,255,0.25)',   icon: '📡' },
  kick:   { color: '#53FC18', bg: 'rgba(83,252,24,0.08)',  border: 'rgba(83,252,24,0.20)',    icon: '⚡' },
  x:      { color: '#E8EDF5', bg: 'rgba(232,237,245,0.06)', border: 'rgba(232,237,245,0.15)', icon: '𝕏' },
};

// Incoming live messages — evenly distributed across platforms
const LIVE_POOL: { platform: Platform; username: string; content: string; followers: number; bio: string; verified?: boolean }[] = [
  { platform: 'twitch', username: 'pumpdegen',      content: 'This call is free alpha. Taking notes 📝', followers: 2100, bio: 'Degen. Mostly losing but learning.' },
  { platform: 'x',      username: 'cryptoanalyst',  content: 'SOL volume on DEXs just flipped ETH for the 3rd time this week', followers: 74000, bio: 'On-chain analyst.', verified: true },
  { platform: 'kick',   username: 'letsgoooo',      content: 'Marcus just said agents will manage $10B. Not if, WHEN', followers: 890, bio: 'AI + crypto believer.' },
  { platform: 'twitch', username: 'watcher99',      content: 'Been here 2hrs — best crypto stream I have seen all year', followers: 560, bio: 'Long-time lurker.' },
  { platform: 'x',      username: 'onchainora',     content: 'Smart money inflows into SOL hit a 6-month high. Following data not noise', followers: 91000, bio: 'On-chain analytics.', verified: true },
  { platform: 'kick',   username: 'memetard',       content: 'BONK still sleeping. Dani mentioned early internet memes — researching now 👀', followers: 1890, bio: 'Memecoin specialist.' },
  { platform: 'twitch', username: 'stacksats',      content: 'Every dip is a gift. Stack hard, zoom out, stay patient. This is the way', followers: 18400, bio: 'Bitcoin only. Stack sats daily.' },
  { platform: 'x',      username: 'fudbuster',      content: 'The FUD merchants will be FUDing all the way until $200k BTC. Ignore and accumulate', followers: 62000, bio: 'BTC and ETH holder.', verified: true },
  { platform: 'kick',   username: 'solsurfer',      content: 'Buying more SOL right now. Alex literally just described the exact setup I was watching', followers: 4300, bio: 'SOL maxi since 2021.' },
  { platform: 'twitch', username: 'chartmaster',    content: 'Weekly RSI divergence on BTC is the most bullish signal I have seen since 2020', followers: 56000, bio: 'Technical analyst. 8 years experience.', verified: true },
  { platform: 'x',      username: 'altszn_official',content: 'Solana thesis: better UX + Firedancer + institutional inflows = unstoppable 💚', followers: 38000, bio: 'Alt season tracker.' },
  { platform: 'kick',   username: 'blockninja',     content: 'The Fed correlation chart Priya showed is insane — 94% correlation since 2022', followers: 9800, bio: 'Chart analyst and data nerd.' },
  { platform: 'twitch', username: 'moonboy420',     content: 'when lambo ser??? jk but seriously SOL $500 EOY is fud at this point', followers: 670, bio: 'Degen trader.' },
  { platform: 'x',      username: 'defi_alice',     content: 'Sarah Chen just said she is still buying ETH under $4k. Strong signal from Paradigm', followers: 88000, bio: 'DeFi researcher.', verified: true },
  { platform: 'kick',   username: 'wagmi_degen',    content: 'The meta detection angle is real — was early on WIF because of narrative clustering', followers: 3200, bio: 'Memecoin degen. Up 10x this cycle.' },
];

// Translated versions for key messages
const TRANSLATED: Record<string, Record<Language, string>> = {
  'This call is free alpha. Taking notes 📝': {
    en: 'This call is free alpha. Taking notes 📝',
    fr: 'Cet appel est de l\'alpha gratuit. Je prends des notes 📝',
    es: 'Esta llamada es alpha gratuita. Tomando notas 📝',
    pt: 'Esta call é alpha gratuita. Anotando 📝',
    ar: 'هذه المكالمة معلومات مجانية. أدوّن ملاحظات 📝',
    zh: '这个分析是免费的内幕。正在记录 📝',
  },
  'SOL volume on DEXs just flipped ETH for the 3rd time this week': {
    en: 'SOL volume on DEXs just flipped ETH for the 3rd time this week',
    fr: 'Le volume SOL sur les DEX vient de dépasser ETH pour la 3ème fois cette semaine',
    es: 'El volumen de SOL en DEXs acaba de superar a ETH por tercera vez esta semana',
    pt: 'Volume do SOL nas DEXs acabou de superar o ETH pela 3ª vez esta semana',
    ar: 'حجم SOL على منصات DEX تجاوز ETH للمرة الثالثة هذا الأسبوع',
    zh: 'SOL在DEX上的交易量本周第三次超过ETH',
  },
  'Smart money inflows into SOL hit a 6-month high. Following data not noise': {
    en: 'Smart money inflows into SOL hit a 6-month high. Following data not noise',
    fr: 'Les entrées d\'argent intelligent dans SOL atteignent un plus haut sur 6 mois. Je suis les données pas le bruit',
    es: 'Los flujos de dinero inteligente hacia SOL alcanzan máximo de 6 meses. Siguiendo datos no ruido',
    pt: 'Entradas de smart money no SOL atingem máximo de 6 meses. Seguindo dados não barulho',
    ar: 'تدفقات الأموال الذكية إلى SOL تبلغ أعلى مستوى في 6 أشهر',
    zh: '流入SOL的聪明钱创6个月新高，跟随数据而非噪音',
  },
  'Solana thesis: better UX + Firedancer + institutional inflows = unstoppable 💚': {
    en: 'Solana thesis: better UX + Firedancer + institutional inflows = unstoppable 💚',
    fr: 'Thèse Solana : meilleure UX + Firedancer + flux institutionnels = inarrêtable 💚',
    es: 'Tesis Solana: mejor UX + Firedancer + flujos institucionales = imparable 💚',
    pt: 'Tese Solana: melhor UX + Firedancer + fluxos institucionais = imparável 💚',
    ar: 'أطروحة Solana: تجربة مستخدم أفضل + Firedancer + تدفقات مؤسسية = لا يوقف 💚',
    zh: 'Solana论点：更好的用户体验+Firedancer+机构资金流入=势不可挡 💚',
  },
};

let livePoolIdx = 0;

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => createMessages());
  const [filter, setFilter] = useState<Platform | 'all'>('all');
  const [language, setLanguage] = useState<Language>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [input, setInput] = useState('');
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Platform message counts for the filter badges
  const counts = {
    all: messages.length,
    twitch: messages.filter(m => m.platform === 'twitch').length,
    x: messages.filter(m => m.platform === 'x').length,
    kick: messages.filter(m => m.platform === 'kick').length,
  };

  // Add new messages from all three platforms periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const raw = LIVE_POOL[livePoolIdx % LIVE_POOL.length];
      livePoolIdx++;

      const newMessage: ChatMessage = {
        id: `live-${Date.now()}-${Math.random()}`,
        platform: raw.platform,
        username: raw.username,
        avatar: raw.username.slice(0, 2).toUpperCase(),
        content: raw.content,
        timestamp: new Date(),
        followers: raw.followers,
        bio: raw.bio,
        verified: raw.verified,
        translatedContent: TRANSLATED[raw.content] || {
          en: raw.content, fr: raw.content, es: raw.content,
          pt: raw.content, ar: raw.content, zh: raw.content,
        },
      };
      setMessages(prev => [...prev.slice(-80), newMessage]);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  const handleScroll = useCallback(() => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 80);
  }, []);

  const filtered = filter === 'all' ? messages : messages.filter(m => m.platform === filter);

  const getContent = (msg: ChatMessage): string => {
    if (language === 'en') return msg.content;
    return msg.translatedContent?.[language] || msg.content;
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: `user-${Date.now()}`,
      platform: 'bubble',
      username: 'ZuBix',
      avatar: 'ZB',
      content: input,
      timestamp: new Date(),
      followers: 5500,
      bio: 'Web3 founder. Solana native.',
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setAutoScroll(true);
  };

  return (
    <aside className="w-80 flex flex-col border-l border-bubble-border overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 py-2.5 border-b border-bubble-border flex items-center gap-2 flex-shrink-0">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-bubble-text">Unified Chat</span>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-bubble-green"
            />
          </div>
          <p className="text-[10px] text-bubble-dim mt-0.5">Twitch · Kick · X merged</p>
        </div>
        <span className="text-[10px] font-mono text-bubble-muted bg-bubble-dim/40 px-2 py-0.5 rounded-full">
          {messages.length.toLocaleString()} msgs
        </span>
      </div>

      {/* ── Language selector ── */}
      <div className="px-3 py-2 border-b border-bubble-border flex-shrink-0">
        <button
          onClick={() => setShowLangMenu(v => !v)}
          className="flex items-center gap-1.5 text-[11px] text-bubble-muted hover:text-bubble-text transition-colors w-full"
        >
          <Globe size={11} />
          <span className="font-mono">
            {LANGUAGES.find(l => l.code === language)?.flag}{' '}
            {LANGUAGES.find(l => l.code === language)?.label}
          </span>
          <ChevronDown size={10} className={`ml-auto transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {showLangMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1 mt-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                    className={`text-[10px] px-2 py-1 rounded font-mono transition-all flex items-center gap-1 ${
                      language === lang.code
                        ? 'bg-bubble-accent/15 text-bubble-accent border border-bubble-accent/30'
                        : 'text-bubble-dim hover:text-bubble-muted border border-transparent hover:border-bubble-border'
                    }`}
                  >
                    {lang.flag} {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
              {language !== 'en' && (
                <p className="text-[10px] text-bubble-dim mt-1.5 font-mono">
                  ✓ Translating messages to {LANGUAGES.find(l => l.code === language)?.label}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Platform filters with counts ── */}
      <div className="px-3 py-2 border-b border-bubble-border flex gap-1.5 flex-shrink-0">
        {(['all', 'twitch', 'x', 'kick'] as const).map((f) => {
          const meta = PLATFORM_META[f];
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border"
              style={
                active
                  ? { color: meta.color, background: meta.bg, borderColor: meta.border }
                  : { color: '#2A3548', background: 'transparent', borderColor: 'transparent' }
              }
            >
              <span>{meta.icon}</span>
              <span>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</span>
              <span
                className="text-[9px] font-mono rounded-full px-1 py-px"
                style={{ background: active ? meta.border : 'rgba(255,255,255,0.04)', color: active ? meta.color : '#2A3548' }}
              >
                {counts[f as keyof typeof counts]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Messages ── */}
      <div
        ref={chatRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-1 relative"
      >
        {filtered.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="group relative px-2.5 py-2 hover:bg-white/[0.025] transition-colors"
            onMouseEnter={() => setHoveredMsg(msg.id)}
            onMouseLeave={() => setHoveredMsg(null)}
          >
            <div className="flex items-start gap-2">
              {/* Avatar */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-bubble-dim to-bubble-border flex items-center justify-center text-[9px] font-bold text-bubble-muted flex-shrink-0 mt-0.5">
                {msg.avatar}
              </div>

              <div className="flex-1 min-w-0">
                {/* Username row */}
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="text-xs font-semibold text-bubble-text hover:text-bubble-accent cursor-pointer transition-colors">
                    {msg.username}
                  </span>
                  {msg.verified && (
                    <span className="text-[9px] text-bubble-accent font-bold">✓</span>
                  )}
                  {/* Platform badge is the key differentiator */}
                  <PlatformBadge platform={msg.platform} size="sm" />
                  <span className="text-[9px] text-bubble-dim font-mono ml-auto">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>

                {/* Message content */}
                <p className={`text-xs text-bubble-muted leading-relaxed ${language === 'ar' ? 'text-right' : ''}`}>
                  {getContent(msg)}
                </p>

                {/* Translation indicator */}
                {language !== 'en' && msg.translatedContent?.[language] && msg.translatedContent[language] !== msg.content && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Globe size={8} className="text-bubble-accent/50" />
                    <span className="text-[9px] text-bubble-accent/50 font-mono">translated</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover card */}
            {hoveredMsg === msg.id && (
              <div className="absolute left-10 z-50" style={{ top: '100%', marginTop: '4px' }}>
                <UserHoverCard
                  username={msg.username}
                  avatar={msg.avatar}
                  platform={msg.platform}
                  followers={msg.followers}
                  bio={msg.bio}
                  verified={msg.verified}
                />
              </div>
            )}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Scroll-to-bottom nudge */}
      <AnimatePresence>
        {!autoScroll && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            onClick={() => { setAutoScroll(true); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
            className="absolute bottom-20 right-4 flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-full bg-bubble-accent text-black font-semibold shadow-accent z-10"
          >
            <ChevronDown size={10} />
            New messages
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Input ── */}
      <div className="border-t border-bubble-border p-3 flex-shrink-0 bg-bubble-surface/50">
        <div className="text-[10px] text-bubble-dim mb-1.5 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-bubble-accent/60" />
          Market Bubble Community
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-bubble-accent/40 to-bubble-accent2/40 flex items-center justify-center text-[9px] font-bold text-bubble-accent flex-shrink-0 border border-bubble-accent/20">
            ZB
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share your take..."
            className="flex-1 bg-bubble-dim/30 border border-bubble-border rounded-lg px-3 py-2 text-xs text-bubble-text placeholder-bubble-dim focus:outline-none focus:border-bubble-accent/40 focus:bg-bubble-dim/50 transition-all"
          />
          <button
            onClick={sendMessage}
            className="w-8 h-8 rounded-lg bg-bubble-accent flex items-center justify-center hover:bg-bubble-accent/80 transition-colors flex-shrink-0"
          >
            <Send size={12} className="text-black" />
          </button>
        </div>
      </div>
    </aside>
  );
}
