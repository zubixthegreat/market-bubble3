'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Globe, ChevronDown, Users } from 'lucide-react';
import { MOCK_GUESTS } from '@/data/mockData';
import { Guest } from '@/types';

const GUEST_COLORS = [200, 270, 140, 40, 330];

function GuestAvatar({ guest, index, size = 'md' }: { guest: Guest; index: number; size?: 'sm' | 'md' | 'lg' }) {
  const hue = GUEST_COLORS[index % GUEST_COLORS.length];
  const sz = size === 'lg' ? 'w-14 h-14 text-base' : size === 'md' ? 'w-9 h-9 text-sm' : 'w-6 h-6 text-[9px]';
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue},50%,20%), hsl(${hue+20},55%,15%))`,
        color: `hsl(${hue},70%,68%)`,
        border: `1px solid hsl(${hue},50%,30%)`,
      }}
    >
      {guest.avatar}
    </div>
  );
}

function FeaturedGuest({ guest, index }: { guest: Guest; index: number }) {
  const hue = GUEST_COLORS[index % GUEST_COLORS.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 mb-3 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(${hue},40%,10%) 0%, hsl(${hue},35%,7%) 100%)`,
        border: `1px solid hsl(${hue},45%,22%)`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20"
        style={{ background: `hsl(${hue},60%,50%)` }}
      />

      <div className="relative flex items-start gap-3">
        <GuestAvatar guest={guest} index={index} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-display font-bold text-sm text-bubble-text">{guest.name}</span>
            <span
              className="text-[9px] px-1.5 py-px rounded font-semibold"
              style={{
                background: `hsl(${hue},50%,15%)`,
                color: `hsl(${hue},70%,65%)`,
                border: `1px solid hsl(${hue},50%,28%)`,
              }}
            >
              FEATURED
            </span>
          </div>
          <div className="text-xs text-bubble-muted mb-2">{guest.role} · {guest.company}</div>
          <p className="text-xs text-bubble-muted leading-relaxed mb-3">{guest.bio}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {guest.expertise.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: `hsl(${hue},40%,12%)`,
                  color: `hsl(${hue},60%,60%)`,
                  border: `1px solid hsl(${hue},40%,22%)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href="#" className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg bg-white/5 text-bubble-muted hover:text-bubble-text transition-colors border border-bubble-border">
              <Twitter size={10} />
              {guest.xHandle}
            </a>
            <a href="#" className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg bg-white/5 text-bubble-muted hover:text-bubble-text transition-colors border border-bubble-border">
              <Globe size={10} />
              {guest.website}
            </a>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-bubble-dim font-mono">
              <Users size={9} />
              {guest.followers}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GuestsPanel() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const featuredGuests = MOCK_GUESTS.filter((g) => g.featured);
  const regularGuests = MOCK_GUESTS.filter((g) => !g.featured);

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-sm text-bubble-text">Today's Guests</h2>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-bubble-green animate-pulse" />
          <span className="text-[10px] text-bubble-muted font-mono">{MOCK_GUESTS.length} on air</span>
        </div>
      </div>

      {/* Featured guests */}
      {featuredGuests.map((guest) => {
        const idx = MOCK_GUESTS.indexOf(guest);
        return <FeaturedGuest key={guest.id} guest={guest} index={idx} />;
      })}

      {/* Divider */}
      {regularGuests.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-bubble-border" />
          <span className="text-[10px] text-bubble-dim font-mono uppercase tracking-wider">Also on air</span>
          <div className="flex-1 h-px bg-bubble-border" />
        </div>
      )}

      {/* Regular guests */}
      <div className="space-y-2">
        {regularGuests.map((guest) => {
          const idx = MOCK_GUESTS.indexOf(guest);
          const isOpen = expanded === guest.id;
          return (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : guest.id)}
                className={`w-full glass-panel rounded-xl p-3 text-left transition-all duration-200 hover:border-bubble-accent/20 ${
                  isOpen ? 'border-bubble-accent/25 bg-bubble-accent/[0.04]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <GuestAvatar guest={guest} index={idx} size="md" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-bubble-text block">{guest.name}</span>
                    <span className="text-xs text-bubble-muted">{guest.role} · {guest.company}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} className="text-bubble-dim" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-panel rounded-b-xl border-t-0 px-4 py-3 space-y-3 -mt-1">
                      <p className="text-xs text-bubble-muted leading-relaxed">{guest.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {guest.expertise.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-bubble-dim text-bubble-muted border border-bubble-border font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex gap-1.5">
                          <a href="#" className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg bg-white/5 text-bubble-muted hover:text-bubble-text transition-colors border border-bubble-border">
                            <Twitter size={10} />
                            {guest.xHandle}
                          </a>
                          <a href="#" className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg bg-white/5 text-bubble-muted hover:text-bubble-text transition-colors border border-bubble-border">
                            <Globe size={10} />
                            {guest.website}
                          </a>
                        </div>
                        <span className="text-[10px] text-bubble-dim font-mono flex items-center gap-1">
                          <Users size={9} />
                          {guest.followers}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
