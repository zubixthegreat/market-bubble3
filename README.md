Market Bubble — Unified Live Dashboard
> Premium crypto media terminal. One stream. Three platforms. All conversations merged.
![Market Bubble](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink?style=flat-square)
---
What is Market Bubble?
Market Bubble streams one live show simultaneously to Twitch, Kick, and X. The dashboard aggregates all three audience chat streams into a single, chronological unified feed — so guests, hosts, and the Market Bubble community never have to switch between tabs.
Core value proposition
```
Twitch chat  ─┐
Kick chat     ├──▶  Unified Feed  ──▶  One experience
X replies    ─┘
```
No other platform does this. Every message shows its source badge so you always know where it came from — but you never have to look elsewhere.
---
Features
Feature	Description
Unified Chat	Twitch + Kick + X merged in real-time with platform badges
Bubble AI	Late-join summaries: discussion recap, bull/bear arguments, key quotes, actionable insights
Live Markets	BTC, ETH, SOL, BNB, XRP with live-updating prices and sparklines
Guest Profiles	Featured spotlight + expandable cards with bio, expertise, X, website
Trending Narratives	Topic clusters from discussion with sentiment & momentum
Sentiment Analysis	Live bull/bear/neutral breakdown with visual bar
Translation	Chat translated into EN / FR / ES / PT / AR / ZH
Settings	Alert levels, display preferences, notification controls
Mobile-first	Full bottom-nav mobile layout
---
Tech Stack
Framework: Next.js 14 (App Router)
Language: TypeScript 5
Styling: Tailwind CSS 3.4
Animations: Framer Motion 11
Icons: Lucide React
Charts: Custom SVG sparklines
Deployment: Vercel
---
Getting Started
Prerequisites
Node.js 18+
npm / yarn / pnpm
Local development
```bash
# Clone the repo
git clone https://github.com/yourusername/market-bubble.git
cd market-bubble

# Install dependencies
npm install

# Start dev server
npm run dev
```
Open http://localhost:3000
Build for production
```bash
npm run build
npm run start
```
---
Deploy to Vercel
Option 1 — One-click (fastest)
![Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/market-bubble)
Option 2 — CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Production deploy
vercel --prod
```
Option 3 — GitHub integration
Push to GitHub
Go to vercel.com/new
Import your repository
Click Deploy — zero config needed (`vercel.json` handles everything)
---
Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, fonts
│   ├── page.tsx            # Main page — three-column layout
│   └── globals.css         # Global styles, CSS variables
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Top nav with simulcast status
│   │   └── TickerStrip.tsx # Live price ticker
│   │
│   ├── panels/
│   │   ├── StreamPlayer.tsx    # ONE stream + three audience counters
│   │   ├── ChatPanel.tsx       # Unified Twitch + Kick + X feed
│   │   ├── AISummaryPanel.tsx  # Bubble AI late-join summaries
│   │   ├── GuestsPanel.tsx     # Guest profiles with spotlight
│   │   ├── MarketsPanel.tsx    # Live market data + narratives
│   │   ├── LeftSidebar.tsx     # Context: guests, prices, sentiment
│   │   └── SettingsPanel.tsx   # User preferences
│   │
│   └── ui/
│       ├── LoadingScreen.tsx   # Animated boot sequence
│       ├── PlatformBadge.tsx   # \[Twitch] \[Kick] \[X] badges
│       ├── UserHoverCard.tsx   # Hover profile cards
│       ├── Sparkline.tsx       # SVG price charts
│       └── LiveIndicator.tsx   # Pulsing live dot
│
├── data/
│   └── mockData.ts         # All mock data + translations
│
├── lib/
│   └── utils.ts            # Shared utilities
│
└── types/
    └── index.ts            # TypeScript interfaces
```
---
Design System
Token	Value	Use
`bubble-bg`	`#080B14`	App background
`bubble-surface`	`#0D1120`	Panel backgrounds
`bubble-border`	`#1E2A3A`	Dividers, borders
`bubble-accent`	`#00D4FF`	Primary actions, active states
`bubble-accent2`	`#7B61FF`	Gradient partner
`bubble-green`	`#00E676`	Bullish, live, positive
`bubble-red`	`#FF4444`	Bearish, negative
`bubble-amber`	`#FFB020`	Neutral, warnings
`bubble-text`	`#E8EDF5`	Primary text
`bubble-muted`	`#6B7A99`	Secondary text
`bubble-dim`	`#2A3548`	Tertiary / placeholders
---
Roadmap
[ ] Real Twitch EventSub WebSocket integration
[ ] Kick API integration
[ ] X/Twitter API v2 filtered stream
[ ] Actual AI summaries via Claude API
[ ] User authentication
[ ] Stream scheduling / calendar
[ ] Mobile app (React Native)
[ ] Multi-stream support (watch multiple hosts)
[ ] Clip sharing & highlights
---
License
MIT — built for the Market Bubble vibe coding challenge
