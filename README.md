# Sovereign HQ Operator UI

AI Operations Platform — [operator.sovereign-hq.com](https://operator.sovereign-hq.com)

## Stack
- React + TypeScript + Tailwind CSS + shadcn/ui
- React Flow + Framer Motion (integration animation map)
- Vite (build)
- Vercel (deploy)

## Local Dev
```bash
npm install
cp .env.example .env
npm run dev
```

## Deploy
Push to `main` → Vercel auto-deploys.

## Phases
- **P0** ✅ Skeleton — layout, sidebar, all views, build passing
- **P1** 🔜 Core — live WebSocket gateway, real agent data
- **P2** 🔜 Differentiators — live integration animation, Telegram feeds
- **P3** 🔜 Ship — Nginx auth, custom domain, QA
