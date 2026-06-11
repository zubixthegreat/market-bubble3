@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  background: #080B14;
  color: #E8EDF5;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #0D1120;
}

::-webkit-scrollbar-thumb {
  background: #2A3548;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3A4560;
}

.glass-panel {
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
}

.glass-panel-hover:hover {
  background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  border-color: rgba(0, 212, 255, 0.2);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00E676;
  box-shadow: 0 0 8px #00E676;
  animation: livePulse 1.5s ease-in-out infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.accent-text {
  background: linear-gradient(135deg, #00D4FF 0%, #7B61FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Range input — cross-browser */
input[type='range'] {
  -webkit-appearance: none;
  background: transparent;
}
input[type='range']::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: #2A3548;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #00D4FF;
  margin-top: -5px;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.4);
}
input[type='range']::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: #2A3548;
}
input[type='range']::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #00D4FF;
  border: none;
  cursor: pointer;
}

/* Select element */
select {
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath stroke='%236B7A99' stroke-width='1.5' d='M1 1l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px !important;
}

.ticker-strip {
  animation: ticker 40s linear infinite;
}

@keyframes ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.platform-twitch { color: #9146FF; }
.platform-x { color: #E8EDF5; }
.platform-kick { color: #53FC18; }
.platform-bubble { color: #00D4FF; }

.bg-platform-twitch { background: rgba(145, 70, 255, 0.15); border-color: rgba(145, 70, 255, 0.3); }
.bg-platform-x { background: rgba(232, 237, 245, 0.08); border-color: rgba(232, 237, 245, 0.15); }
.bg-platform-kick { background: rgba(83, 252, 24, 0.1); border-color: rgba(83, 252, 24, 0.25); }
.bg-platform-bubble { background: rgba(0, 212, 255, 0.1); border-color: rgba(0, 212, 255, 0.25); }

.gradient-border {
  position: relative;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(0,212,255,0.4), rgba(123,97,255,0.4));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.hover-card {
  position: absolute;
  z-index: 100;
  min-width: 240px;
  transform: translateY(-50%);
}

.chat-message {
  animation: fadeSlideIn 0.3s ease-out;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.sentiment-bar {
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
}

.chart-glow-green {
  filter: drop-shadow(0 0 4px rgba(0, 230, 118, 0.5));
}

.chart-glow-red {
  filter: drop-shadow(0 0 4px rgba(255, 68, 68, 0.5));
}
