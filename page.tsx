'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, MessageSquare, RefreshCw, ChevronDown } from 'lucide-react';
import { MOCK_AI_SUMMARY } from '@/data/mockData';

export default function AISummaryPanel() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(true);
  const [expanded, setExpanded] = useState<string | null>('What Was Discussed');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const regenerate = () => {
    setLoading(true);
    setGenerated(false);
    setLoadingProgress(0);
    const steps = [15, 35, 55, 72, 88, 100];
    steps.forEach((p, i) => {
      setTimeout(() => {
        setLoadingProgress(p);
        if (p === 100) {
          setTimeout(() => {
            setLoading(false);
            setGenerated(true);
          }, 300);
        }
      }, i * 400);
    });
  };

  const LOADING_STEPS = [
    'Analyzing 14,847 messages...',
    'Extracting key discussion points...',
    'Identifying bullish & bearish signals...',
    'Generating actionable insights...',
    'Summarizing guest quotes...',
    'Summary ready.',
  ];

  const currentStep = Math.floor((loadingProgress / 100) * (LOADING_STEPS.length - 1));

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-bubble-accent/30 to-bubble-accent2/30 flex items-center justify-center">
            <Sparkles size={13} className="text-bubble-accent" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-bubble-text">Bubble AI</h2>
            <p className="text-[10px] text-bubble-muted">Stream Intelligence Engine</p>
          </div>
        </div>
        <button
          onClick={regenerate}
          disabled={loading}
          className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
            loading
              ? 'border-bubble-border text-bubble-dim cursor-wait'
              : 'border-bubble-accent/30 bg-bubble-accent/10 text-bubble-accent hover:bg-bubble-accent/15'
          }`}
        >
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Analyzing...' : 'Regenerate'}
        </button>
      </div>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="mb-3">
              <div className="flex justify-between text-[10px] font-mono text-bubble-muted mb-1.5">
                <span>{LOADING_STEPS[currentStep]}</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="h-1.5 bg-bubble-dim rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-bubble-accent to-bubble-accent2 rounded-full"
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <div className="space-y-1">
              {LOADING_STEPS.slice(0, currentStep + 1).map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  <span className="text-bubble-green">✓</span>
                  <span className="text-bubble-muted">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary metadata */}
      {generated && !loading && (
        <>
          <div className="glass-panel rounded-xl p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-sm font-bold font-mono text-bubble-text">{MOCK_AI_SUMMARY.duration}</div>
                <div className="text-[10px] text-bubble-dim flex items-center justify-center gap-1 mt-0.5">
                  <Clock size={9} /> Duration
                </div>
              </div>
              <div>
                <div className="text-sm font-bold font-mono text-bubble-accent">{MOCK_AI_SUMMARY.totalMessages.toLocaleString()}</div>
                <div className="text-[10px] text-bubble-dim flex items-center justify-center gap-1 mt-0.5">
                  <MessageSquare size={9} /> Messages
                </div>
              </div>
              <div>
                <div className="text-sm font-bold font-mono text-bubble-green">62%</div>
                <div className="text-[10px] text-bubble-dim mt-0.5">Bullish</div>
              </div>
            </div>
          </div>

          {/* Segments */}
          <div className="space-y-2">
            {MOCK_AI_SUMMARY.segments.map((segment) => (
              <div key={segment.label} className="glass-panel rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === segment.label ? null : segment.label)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-white/2 transition-colors"
                >
                  <span className="text-base">{segment.icon}</span>
                  <span className="flex-1 text-left text-sm font-semibold text-bubble-text">{segment.label}</span>
                  <ChevronDown
                    size={14}
                    className={`text-bubble-dim transition-transform ${expanded === segment.label ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expanded === segment.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-bubble-border"
                    >
                      <ul className="p-4 space-y-2.5">
                        {segment.content.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2.5"
                          >
                            <span className="text-bubble-accent mt-0.5 flex-shrink-0 text-xs">›</span>
                            <span className="text-xs text-bubble-muted leading-relaxed">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!generated && !loading && (
        <div className="glass-panel rounded-xl p-8 text-center">
          <Sparkles size={24} className="text-bubble-dim mx-auto mb-3" />
          <p className="text-sm text-bubble-muted mb-4">
            Join any stream and Bubble AI will generate an instant summary so you never miss the alpha.
          </p>
          <button
            onClick={regenerate}
            className="px-4 py-2 rounded-lg bg-bubble-accent/10 border border-bubble-accent/30 text-xs text-bubble-accent hover:bg-bubble-accent/15 transition-colors"
          >
            Generate Summary
          </button>
        </div>
      )}
    </div>
  );
}
