'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, Hash, Sparkles } from 'lucide-react';
import { MOCK_NARRATIVES, MOCK_GUESTS, SENTIMENT_DATA } from '@/data/mockData';

// Contextual sidebar: market snapshot, narratives, guest roster.
// No stream switching — Market Bubble is ONE stream.

function LivePrice({ symbol, price, change, up }: { symbol: string; price: string; change: string; up: boolean }) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-white/3 cursor-pointer transition-colors">
      <span className="text-xs font-mono font-bold text-bubble-text">{symbol}</span>
      <div className="text-right">
        <motion.div
          animate={flash ? { color: up ? '#00E676' : '#FF4444' } : { color: '#E8EDF5' }}
          transition={{ duration: 0.15 }}
          className="text-xs font-mono font-semibold"
        >
          {price}
        </motion.div>
        <div className={`text-[10px] font-mono ${up ? 'text-bubble-green' : 'text-bubble-red'}`}>
          {change}
        </div>
      </div>
    </div>
  );
}

export default function LeftSidebar() {
  return (
    <aside className="w-56 flex flex-col overflow-y-auto border-r border-bubble-border">

      {/* ── On Air ── */}
      <section className="border-b border-bubble-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Users size={12} className="text-bubble-muted" />
          <span className="text-[10px] font-semibold text-bubble-muted uppercase tracking-wider">On Air Now</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-bubble-green animate-pulse" />
        </div>
        <div className="pb-3 px-3 flex flex-col gap-1.5">
          {MOCK_GUESTS.slice(0, 4).map((guest, i) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/3 cursor-pointer transition-colors group"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{
                  background: `hsl(${i * 72 + 190}, 50%, 18%)`,
                  color: `hsl(${i * 72 + 190}, 70%, 65%)`,
                  border: `1px solid hsl(${i * 72 + 190}, 50%, 28%)`,
                }}
              >
                {guest.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-bubble-muted group-hover:text-bubble-text truncate transition-colors">
                  {guest.name}
                </div>
                <div className="text-[10px] text-bubble-dim truncate">{guest.company}</div>
              </div>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
                className="w-1.5 h-1.5 rounded-full bg-bubble-green flex-shrink-0"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Market snapshot ── */}
      <section className="border-b border-bubble-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <BarChart2 size={12} className="text-bubble-muted" />
          <span className="text-[10px] font-semibold text-bubble-muted uppercase tracking-wider">Markets</span>
        </div>
        <div className="pb-2">
          {[
            { symbol: 'BTC', price: '$104,280', change: '+2.30%', up: true },
            { symbol: 'ETH', price: '$3,847', change: '-1.08%', up: false },
            { symbol: 'SOL', price: '$187.42', change: '+7.35%', up: true },
            { symbol: 'BNB', price: '$612.30', change: '-1.36%', up: false },
            { symbol: 'XRP', price: '$2.847', change: '+4.86%', up: true },
          ].map((item) => (
            <LivePrice key={item.symbol} {...item} />
          ))}
        </div>
      </section>

      {/* ── Sentiment ── */}
      <section className="border-b border-bubble-border px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={12} className="text-bubble-muted" />
          <span className="text-[10px] font-semibold text-bubble-muted uppercase tracking-wider">Sentiment</span>
        </div>
        {/* Bar */}
        <div className="flex h-2 rounded-full overflow-hidden gap-px mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${SENTIMENT_DATA.bullish}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-bubble-green rounded-l-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${SENTIMENT_DATA.neutral}%` }}
            transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
            className="bg-bubble-amber"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${SENTIMENT_DATA.bearish}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="bg-bubble-red rounded-r-full"
          />
        </div>
        <div className="flex justify-between font-mono text-[10px]">
          <span className="text-bubble-green font-bold">{SENTIMENT_DATA.bullish}% Bull</span>
          <span className="text-bubble-amber">{SENTIMENT_DATA.neutral}% Neu</span>
          <span className="text-bubble-red">{SENTIMENT_DATA.bearish}% Bear</span>
        </div>
      </section>

      {/* ── Trending Narratives ── */}
      <section>
        <div className="flex items-center gap-2 px-4 py-3">
          <Hash size={12} className="text-bubble-muted" />
          <span className="text-[10px] font-semibold text-bubble-muted uppercase tracking-wider">Trending</span>
        </div>
        <div className="pb-3">
          {MOCK_NARRATIVES.slice(0, 7).map((n, i) => (
            <div
              key={n.id}
              className="flex items-center gap-2 px-4 py-1.5 hover:bg-white/3 cursor-pointer transition-colors group"
            >
              <span className="text-[10px] text-bubble-dim font-mono w-4 text-right flex-shrink-0">{i + 1}</span>
              <span className="text-xs text-bubble-muted group-hover:text-bubble-text truncate flex-1 transition-colors">
                {n.topic}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span
                  className={`text-[10px] font-mono ${
                    n.sentiment === 'bullish' ? 'text-bubble-green' :
                    n.sentiment === 'bearish' ? 'text-bubble-red' : 'text-bubble-amber'
                  }`}
                >
                  {n.trend === 'up' ? '↑' : n.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
