'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Globe, Moon, Zap, Shield, Layout,
  Volume2, ChevronRight, Check, ToggleLeft, ToggleRight
} from 'lucide-react';

interface ToggleProps {
  on: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${
        on ? 'bg-bubble-accent' : 'bg-bubble-dim'
      }`}
    >
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-bubble-border last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <div className="text-sm text-bubble-text font-medium">{label}</div>
        {description && (
          <div className="text-[11px] text-bubble-muted mt-0.5">{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-2">
      <div className="w-5 h-5 rounded-md bg-bubble-accent/10 flex items-center justify-center">
        <Icon size={11} className="text-bubble-accent" />
      </div>
      <span className="text-[11px] font-semibold text-bubble-muted uppercase tracking-wider">
        {title}
      </span>
    </div>
  );
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    autoScroll: true,
    soundAlerts: false,
    desktopNotifs: true,
    compactChat: false,
    showTranslationIndicator: true,
    animationsEnabled: true,
    chatBubbleMode: false,
    highlightVerified: true,
    showViewerCounts: true,
    priceAlerts: true,
    btcAlert: '105000',
    solAlert: '200',
    theme: 'dark',
    defaultLanguage: 'en',
    defaultTab: 'ai',
    messageDensity: 'comfortable',
  });

  const set = (key: string, value: any) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-base text-bubble-text">Settings</h2>
            <p className="text-xs text-bubble-muted mt-0.5">Customize your Market Bubble experience</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              saved
                ? 'bg-bubble-green/15 border border-bubble-green/30 text-bubble-green'
                : 'bg-bubble-accent text-black hover:bg-bubble-accent/80'
            }`}
          >
            {saved ? <><Check size={11} /> Saved</> : 'Save Changes'}
          </button>
        </div>

        {/* Chat section */}
        <div className="glass-panel rounded-xl p-4 mb-3">
          <SectionHeader icon={Layout} title="Chat & Feed" />
          <SettingRow label="Auto-scroll chat" description="Automatically scroll to new messages">
            <Toggle on={settings.autoScroll} onChange={(v) => set('autoScroll', v)} />
          </SettingRow>
          <SettingRow label="Compact message view" description="Reduce spacing between messages">
            <Toggle on={settings.compactChat} onChange={(v) => set('compactChat', v)} />
          </SettingRow>
          <SettingRow label="Highlight verified users" description="Show extra indicator on verified accounts">
            <Toggle on={settings.highlightVerified} onChange={(v) => set('highlightVerified', v)} />
          </SettingRow>
          <SettingRow label="Show translation indicator" description="Small label when message is translated">
            <Toggle on={settings.showTranslationIndicator} onChange={(v) => set('showTranslationIndicator', v)} />
          </SettingRow>
          <SettingRow label="Message density">
            <select
              value={settings.messageDensity}
              onChange={(e) => set('messageDensity', e.target.value)}
              className="bg-bubble-dim/40 border border-bubble-border rounded-lg px-2 py-1.5 text-xs text-bubble-text focus:outline-none focus:border-bubble-accent/40"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </SettingRow>
        </div>

        {/* Notifications */}
        <div className="glass-panel rounded-xl p-4 mb-3">
          <SectionHeader icon={Bell} title="Notifications" />
          <SettingRow label="Sound alerts" description="Play a sound for new messages">
            <Toggle on={settings.soundAlerts} onChange={(v) => set('soundAlerts', v)} />
          </SettingRow>
          <SettingRow label="Desktop notifications" description="Browser notifications for key events">
            <Toggle on={settings.desktopNotifs} onChange={(v) => set('desktopNotifs', v)} />
          </SettingRow>
          <SettingRow label="Price alerts" description="Notify on watched asset price levels">
            <Toggle on={settings.priceAlerts} onChange={(v) => set('priceAlerts', v)} />
          </SettingRow>
        </div>

        {/* Price alerts */}
        {settings.priceAlerts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel rounded-xl p-4 mb-3"
          >
            <SectionHeader icon={Zap} title="Alert Levels" />
            <SettingRow label="BTC alert price">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-bubble-muted">$</span>
                <input
                  type="text"
                  value={settings.btcAlert}
                  onChange={(e) => set('btcAlert', e.target.value)}
                  className="w-24 bg-bubble-dim/40 border border-bubble-border rounded-lg px-2 py-1.5 text-xs text-bubble-text font-mono focus:outline-none focus:border-bubble-accent/40 text-right"
                />
              </div>
            </SettingRow>
            <SettingRow label="SOL alert price">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-bubble-muted">$</span>
                <input
                  type="text"
                  value={settings.solAlert}
                  onChange={(e) => set('solAlert', e.target.value)}
                  className="w-24 bg-bubble-dim/40 border border-bubble-border rounded-lg px-2 py-1.5 text-xs text-bubble-text font-mono focus:outline-none focus:border-bubble-accent/40 text-right"
                />
              </div>
            </SettingRow>
          </motion.div>
        )}

        {/* Display */}
        <div className="glass-panel rounded-xl p-4 mb-3">
          <SectionHeader icon={Moon} title="Display" />
          <SettingRow label="Enable animations" description="Framer Motion transitions and micro-interactions">
            <Toggle on={settings.animationsEnabled} onChange={(v) => set('animationsEnabled', v)} />
          </SettingRow>
          <SettingRow label="Show viewer counts" description="Display live viewer numbers on stream">
            <Toggle on={settings.showViewerCounts} onChange={(v) => set('showViewerCounts', v)} />
          </SettingRow>
          <SettingRow label="Default context panel">
            <select
              value={settings.defaultTab}
              onChange={(e) => set('defaultTab', e.target.value)}
              className="bg-bubble-dim/40 border border-bubble-border rounded-lg px-2 py-1.5 text-xs text-bubble-text focus:outline-none focus:border-bubble-accent/40"
            >
              <option value="ai">Bubble AI</option>
              <option value="guests">Guests</option>
              <option value="markets">Markets</option>
            </select>
          </SettingRow>
        </div>

        {/* Language */}
        <div className="glass-panel rounded-xl p-4 mb-3">
          <SectionHeader icon={Globe} title="Language" />
          <SettingRow label="Default chat language" description="Language for chat translation">
            <select
              value={settings.defaultLanguage}
              onChange={(e) => set('defaultLanguage', e.target.value)}
              className="bg-bubble-dim/40 border border-bubble-border rounded-lg px-2 py-1.5 text-xs text-bubble-text focus:outline-none focus:border-bubble-accent/40"
            >
              <option value="en">🇺🇸 English</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="es">🇪🇸 Español</option>
              <option value="pt">🇧🇷 Português</option>
              <option value="ar">🇸🇦 العربية</option>
              <option value="zh">🇨🇳 中文</option>
            </select>
          </SettingRow>
        </div>

        {/* About */}
        <div className="glass-panel rounded-xl p-4 mb-6">
          <SectionHeader icon={Shield} title="About" />
          <div className="space-y-2 text-xs text-bubble-muted">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-mono text-bubble-text">1.0.0-beta</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span className="font-mono text-bubble-text">2026.06</span>
            </div>
            <div className="flex justify-between">
              <span>Stack</span>
              <span className="font-mono text-bubble-text">Next.js 14 · TypeScript · Tailwind</span>
            </div>
            <div className="flex justify-between">
              <span>Stream platforms</span>
              <span className="font-mono text-bubble-text">Twitch · Kick · X</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
