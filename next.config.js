'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Sparkles, Users, Settings } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import TickerStrip from '@/components/layout/TickerStrip';
import LeftSidebar from '@/components/panels/LeftSidebar';
import StreamPlayer from '@/components/panels/StreamPlayer';
import ChatPanel from '@/components/panels/ChatPanel';
import MarketsPanel from '@/components/panels/MarketsPanel';
import GuestsPanel from '@/components/panels/GuestsPanel';
import AISummaryPanel from '@/components/panels/AISummaryPanel';
import SettingsPanel from '@/components/panels/SettingsPanel';
import LoadingScreen from '@/components/ui/LoadingScreen';

// ─── Types ───────────────────────────────────────────────────
const RIGHT_TABS = [
  { id: 'ai',       label: 'Bubble AI', icon: Sparkles  },
  { id: 'guests',   label: 'Guests',    icon: Users     },
  { id: 'markets',  label: 'Markets',   icon: BarChart2 },
  { id: 'settings', label: 'Settings',  icon: Settings  },
] as const;

type RightTab    = typeof RIGHT_TABS[number]['id'];
type MobileView  = 'stream' | 'chat' | RightTab;

const NAV_TO_TAB: Record<string, RightTab> = {
  'AI Summary': 'ai',
  'Guests':     'guests',
  'Markets':    'markets',
  'Settings':   'settings',
};

// ─── Component ───────────────────────────────────────────────
export default function Home() {
  const [loading,      setLoading]      = useState(true);
  const [activeNav,    setActiveNav]    = useState('Dashboard');
  const [rightTab,     setRightTab]     = useState<RightTab>('ai');
  const [mobileView,   setMobileView]   = useState<MobileView>('stream');

  const handleNavChange = useCallback((tab: string) => {
    setActiveNav(tab);
    const mapped = NAV_TO_TAB[tab];
    if (mapped) {
      setRightTab(mapped);
      setMobileView(mapped);
    } else {
      setMobileView('stream');
    }
  }, []);

  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  // ─── Shared right-panel content ──────────────────────────
  const RightPanelContent = ({ tab }: { tab: RightTab }) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -6 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col flex-1 overflow-hidden"
      >
        {tab === 'ai'       && <AISummaryPanel />}
        {tab === 'guests'   && <GuestsPanel />}
        {tab === 'markets'  && <MarketsPanel />}
        {tab === 'settings' && <SettingsPanel />}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      {/* Loading screen — fades out after init */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      <AnimatePresence>
        {!loading && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-screen overflow-hidden bg-bubble-bg"
          >
            <Navbar activeTab={activeNav} onTabChange={handleNavChange} />
            <TickerStrip />

            {/* ── Desktop three-column layout ── */}
            <div className="hidden md:flex flex-1 overflow-hidden">

              {/* Left: context sidebar */}
              <div className="hidden xl:flex flex-shrink-0">
                <LeftSidebar />
              </div>

              {/* Center: ONE stream, always */}
              <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                <StreamPlayer />
              </main>

              {/* Right: context panel + persistent chat */}
              <div className="flex flex-shrink-0">

                {/* Tabbed context panel */}
                <div className="w-72 flex flex-col border-l border-bubble-border overflow-hidden">
                  {/* Tab bar */}
                  <div className="flex border-b border-bubble-border flex-shrink-0">
                    {RIGHT_TABS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setRightTab(id)}
                        className={`relative flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
                          rightTab === id
                            ? 'text-bubble-accent'
                            : 'text-bubble-muted hover:text-bubble-text'
                        }`}
                      >
                        {rightTab === id && (
                          <motion.div
                            layoutId="ctx-tab-line"
                            className="absolute bottom-0 left-0 right-0 h-px bg-bubble-accent"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                          />
                        )}
                        <Icon size={11} />
                        <span className="hidden lg:inline">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="flex-1 overflow-y-auto">
                    <RightPanelContent tab={rightTab} />
                  </div>
                </div>

                {/* Unified chat — always visible */}
                <ChatPanel />
              </div>
            </div>

            {/* ── Mobile layout ── */}
            <div className="md:hidden flex flex-1 flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileView}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 overflow-hidden flex flex-col"
                >
                  {mobileView === 'stream' && <StreamPlayer />}
                  {mobileView === 'chat'   && <ChatPanel />}
                  {(mobileView === 'ai' || mobileView === 'guests' ||
                    mobileView === 'markets' || mobileView === 'settings') && (
                    <div className="flex-1 overflow-y-auto">
                      <RightPanelContent tab={mobileView as RightTab} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Mobile bottom nav */}
              <div className="flex border-t border-bubble-border bg-bubble-surface flex-shrink-0">
                {[
                  { view: 'stream',   icon: '📺', label: 'Live'    },
                  { view: 'ai',       icon: '✨', label: 'AI'      },
                  { view: 'markets',  icon: '📊', label: 'Markets' },
                  { view: 'guests',   icon: '👥', label: 'Guests'  },
                  { view: 'chat',     icon: '💬', label: 'Chat'    },
                ].map((item) => (
                  <button
                    key={item.view}
                    onClick={() => setMobileView(item.view as MobileView)}
                    className={`flex-1 py-2.5 text-[9px] font-medium flex flex-col items-center gap-0.5 transition-colors ${
                      mobileView === item.view
                        ? 'text-bubble-accent'
                        : 'text-bubble-dim'
                    }`}
                  >
                    <span className="text-sm leading-none">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
