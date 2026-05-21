import { useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Node, Edge, Background, Controls,
  useNodesState, useEdgesState, BackgroundVariant,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { cn } from '@/lib/utils'

type NodeStatus = 'active' | 'idle' | 'offline' | 'pulsing'

interface IntegrationNode {
  id: string
  label: string
  emoji: string
  category: string
  color: string
  status: NodeStatus
}

const integrationNodes: IntegrationNode[] = [
  // ── Surfaces (center cluster)
  { id: 'zion',       label: 'Zion',             emoji: '⚡', category: 'Surface',  color: '#ECAB23', status: 'active' },
  { id: 'atlas',      label: 'Atlas',            emoji: '🔵', category: 'Surface',  color: '#3b82f6', status: 'idle' },
  { id: 'ark',        label: 'Ark',              emoji: '🟣', category: 'Surface',  color: '#6366f1', status: 'offline' },
  // ── AI / Models
  { id: 'openrouter', label: 'OpenRouter',       emoji: '🔀', category: 'AI',       color: '#f59e0b', status: 'active' },
  { id: 'claude',     label: 'Claude',           emoji: '✦',  category: 'AI',       color: '#a855f7', status: 'idle' },
  { id: 'qwen',       label: 'Qwen3-235b',       emoji: '🧠', category: 'AI',       color: '#10b981', status: 'idle' },
  { id: 'gemini',     label: 'Gemini Flash',     emoji: '💡', category: 'AI',       color: '#f97316', status: 'idle' },
  // ── Channels
  { id: 'telegram',   label: 'Telegram',         emoji: '✈️', category: 'Channel',  color: '#0ea5e9', status: 'active' },
  { id: 'twilio',     label: 'Twilio',           emoji: '📱', category: 'Channel',  color: '#f22f46', status: 'idle' },
  // ── Productivity tools
  { id: 'clickup',    label: 'ClickUp',          emoji: '✅', category: 'Tool',     color: '#7c3aed', status: 'active' },
  { id: 'gws',        label: 'Google Workspace', emoji: '📁', category: 'Tool',     color: '#ef4444', status: 'active' },
  { id: 'miro',       label: 'Miro',             emoji: '🖼️', category: 'Tool',     color: '#ffd02f', status: 'idle' },
  // ── Data / Enrichment
  { id: 'apollo',     label: 'Apollo.io',        emoji: '🚀', category: 'Data',     color: '#00c2ff', status: 'active' },
  { id: 'apify',      label: 'Apify',            emoji: '🕷️', category: 'Data',     color: '#ff9012', status: 'idle' },
  { id: 'supabase',   label: 'Supabase',         emoji: '🟩', category: 'Data',     color: '#3ecf8e', status: 'active' },
  // ── Voice / Comms
  { id: 'elevenlabs', label: 'ElevenLabs',       emoji: '🎙️', category: 'Voice',    color: '#9b59b6', status: 'active' },
  // ── Automation
  { id: 'n8n',        label: 'n8n',              emoji: '🔁', category: 'Automation', color: '#ea4b71', status: 'active' },
  // ── Payments
  { id: 'stripe',     label: 'Stripe',           emoji: '💳', category: 'Payments',  color: '#635bff', status: 'idle' },
  { id: 'privacy',    label: 'Privacy.com',      emoji: '🔒', category: 'Payments',  color: '#00c48c', status: 'idle' },
  // ── Analytics
  { id: 'posthog',    label: 'PostHog',          emoji: '📊', category: 'Analytics', color: '#f54e00', status: 'active' },
  { id: 'ga4',        label: 'GA4',              emoji: '📈', category: 'Analytics', color: '#e37400', status: 'active' },
  { id: 'looker',     label: 'Looker Studio',    emoji: '🔭', category: 'Analytics', color: '#4285f4', status: 'idle' },
  // ── Data / Research
  { id: 'firecrawl',  label: 'Firecrawl',        emoji: '🔥', category: 'Data',      color: '#ff6b35', status: 'idle' },
  { id: 'tavily',     label: 'Tavily',           emoji: '🔍', category: 'Data',      color: '#6366f1', status: 'idle' },
  // ── Scheduling
  { id: 'calcom',     label: 'Cal.com',          emoji: '📅', category: 'Tool',      color: '#292929', status: 'idle' },
  // ── Infra / Deploy
  { id: 'github',     label: 'GitHub',           emoji: '🐙', category: 'Infra',    color: '#94a3b8', status: 'idle' },
  { id: 'vercel',     label: 'Vercel',           emoji: '▲',  category: 'Infra',    color: '#e8e8e8', status: 'idle' },
  { id: 'cloudflare', label: 'Cloudflare',       emoji: '🌐', category: 'Infra',    color: '#f6821f', status: 'active' },
  { id: 'digitalocean',label: 'Digital Ocean',   emoji: '🌊', category: 'Infra',    color: '#0080ff', status: 'active' },
  { id: 'tailscale',  label: 'Tailscale',        emoji: '🔗', category: 'Infra',    color: '#5b5ea6', status: 'active' },
  // ── Memory
  { id: 'mem0',       label: 'Mem0',             emoji: '💾', category: 'Memory',   color: '#84cc16', status: 'active' },
  { id: 'qdrant',     label: 'Qdrant',           emoji: '🗄️', category: 'Infra',    color: '#06b6d4', status: 'active' },
]

// 33-node layout — Zion at center, clusters by category
const positions: Record<string, { x: number; y: number }> = {
  // ── Hub
  zion:         { x: 600, y: 360 },
  // ── Surfaces — upper left
  atlas:        { x: 340, y: 200 },
  ark:          { x: 340, y: 440 },
  // ── Memory — far left
  mem0:         { x: 120, y: 300 },
  qdrant:       { x: 120, y: 440 },
  // ── AI — right spoke
  openrouter:   { x: 860, y: 360 },
  claude:       { x: 1080, y: 200 },
  qwen:         { x: 1080, y: 360 },
  gemini:       { x: 1080, y: 520 },
  // ── Infra — top arc
  digitalocean: { x: 380, y: 60 },
  tailscale:    { x: 540, y: 60 },
  cloudflare:   { x: 700, y: 60 },
  github:       { x: 860, y: 60 },
  vercel:       { x: 1020, y: 60 },
  // ── Channels — lower left
  telegram:     { x: 380, y: 580 },
  twilio:       { x: 220, y: 580 },
  // ── Tools — bottom center-left
  clickup:      { x: 460, y: 660 },
  gws:          { x: 600, y: 720 },
  miro:         { x: 740, y: 660 },
  calcom:       { x: 340, y: 720 },
  // ── Data / Enrichment — bottom center-right
  apollo:       { x: 860, y: 580 },
  apify:        { x: 980, y: 660 },
  supabase:     { x: 740, y: 500 },
  firecrawl:    { x: 980, y: 500 },
  tavily:       { x: 1100, y: 580 },
  // ── Automation
  n8n:          { x: 460, y: 500 },
  // ── Voice
  elevenlabs:   { x: 860, y: 720 },
  // ── Payments
  stripe:       { x: 200, y: 460 },
  privacy:      { x: 120, y: 580 },
  // ── Analytics
  posthog:      { x: 740, y: 780 },
  ga4:          { x: 600, y: 840 },
  looker:       { x: 860, y: 840 },
}

const connections: [string, string][] = [
  // Surfaces
  ['zion', 'atlas'], ['zion', 'ark'],
  // AI routing
  ['zion', 'openrouter'],
  ['openrouter', 'claude'], ['openrouter', 'qwen'], ['openrouter', 'gemini'],
  // Memory
  ['zion', 'mem0'], ['mem0', 'qdrant'], ['zion', 'qdrant'],
  // Infra
  ['zion', 'digitalocean'], ['zion', 'tailscale'], ['zion', 'cloudflare'],
  ['zion', 'github'], ['github', 'vercel'],
  // Channels
  ['zion', 'telegram'], ['zion', 'twilio'],
  // Tools
  ['zion', 'clickup'], ['zion', 'gws'], ['zion', 'miro'], ['zion', 'calcom'],
  // Data
  ['zion', 'apollo'], ['zion', 'apify'], ['zion', 'supabase'],
  ['zion', 'firecrawl'], ['zion', 'tavily'],
  // Automation
  ['zion', 'n8n'],
  // Voice
  ['zion', 'elevenlabs'],
  // Payments
  ['zion', 'stripe'], ['zion', 'privacy'],
  // Analytics
  ['zion', 'posthog'], ['zion', 'ga4'], ['zion', 'looker'],
]

// Edge color when idle vs active
const IDLE_STROKE   = '#1a4a62'
const ACTIVE_STROKE = '#ECAB23'

function makeNode(n: IntegrationNode): Node {
  return {
    id: n.id,
    position: positions[n.id] || { x: 0, y: 0 },
    data: { label: n },
    type: 'integrationNode',
    style: { background: 'transparent', border: 'none', padding: 0 },
  }
}

function makeEdge(from: string, to: string, active = false): Edge {
  return {
    id: `${from}-${to}`,
    source: from,
    target: to,
    animated: active,
    style: {
      stroke: active ? ACTIVE_STROKE : IDLE_STROKE,
      strokeWidth: active ? 2 : 1,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: active ? ACTIVE_STROKE : IDLE_STROKE,
      width: 14,
      height: 14,
    },
  }
}

function IntegrationNodeComponent({ data }: { data: { label: IntegrationNode } }) {
  const n = data.label
  const statusColor =
    n.status === 'active'  ? '#10b981' :
    n.status === 'pulsing' ? '#ECAB23' :
    n.status === 'idle'    ? '#f59e0b' : '#2a4a5a'

  return (
    <div
      className="flex flex-col items-center gap-1 p-3 rounded-xl border backdrop-blur-sm cursor-default select-none transition-all"
      style={{
        background: n.color + '0a',
        borderColor: n.status === 'pulsing' ? n.color : n.color + '35',
        boxShadow:
          n.status === 'pulsing' ? `0 0 20px ${n.color}50` :
          n.status === 'active'  ? `0 0 8px ${n.color}25` : 'none',
        minWidth: 88,
      }}
    >
      <div className="text-xl leading-none">{n.emoji}</div>
      <div className="text-[10px] font-medium text-[#d0d8e0] text-center leading-tight">{n.label}</div>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
        <span className="text-[8px] text-[#4a7a94] uppercase tracking-wide">{n.status}</span>
      </div>
    </div>
  )
}

const nodeTypes = { integrationNode: IntegrationNodeComponent }

interface PulseEvent {
  id: string
  from: string
  to: string
  label: string
  ts: string
}

const seedEvents: PulseEvent[] = [
  { id: 's1',  from: 'zion',        to: 'openrouter',   label: 'LLM request → claude-sonnet-4-6',       ts: '21:21:03' },
  { id: 's2',  from: 'zion',        to: 'clickup',      label: 'POST /task — P1 created',                ts: '21:20:45' },
  { id: 's3',  from: 'zion',        to: 'telegram',     label: 'sendMessage → Build Room',                ts: '21:20:12' },
  { id: 's4',  from: 'mem0',        to: 'qdrant',       label: 'vector search — memory recall',           ts: '21:19:55' },
  { id: 's5',  from: 'zion',        to: 'gws',          label: 'calendar.list — morning brief',           ts: '21:19:30' },
  { id: 's6',  from: 'openrouter',  to: 'claude',       label: 'Routing → claude-sonnet-4-6',             ts: '21:18:44' },
  { id: 's7',  from: 'zion',        to: 'github',       label: 'git push — operator-ui main',             ts: '21:17:58' },
  { id: 's8',  from: 'github',      to: 'vercel',       label: 'deploy triggered — v1.2',                 ts: '21:17:59' },
  { id: 's9',  from: 'zion',        to: 'apollo',       label: 'people.search — 50 leads enriched',       ts: '21:16:22' },
  { id: 's10', from: 'zion',        to: 'supabase',     label: 'SELECT clinics — 1054 rows',              ts: '21:15:44' },
  { id: 's11', from: 'zion',        to: 'elevenlabs',   label: 'TTS synthesis — Lamin voice',             ts: '21:14:30' },
  { id: 's12', from: 'zion',        to: 'apify',        label: 'actor.run → tweet-scraper-v2',            ts: '21:13:10' },
  { id: 's13', from: 'zion',        to: 'n8n',          label: 'workflow.trigger — lead-enrichment',      ts: '21:12:44' },
  { id: 's14', from: 'zion',        to: 'cloudflare',   label: 'DNS check — operator.sovereign-hq.com',  ts: '21:12:01' },
  { id: 's15', from: 'zion',        to: 'tailscale',    label: 'peer.ping — atlas 100.78.163.113',        ts: '21:11:30' },
  { id: 's16', from: 'zion',        to: 'posthog',      label: 'event.capture — page_view GlowRoute',    ts: '21:10:55' },
  { id: 's17', from: 'zion',        to: 'stripe',       label: 'payment.intent — $249 plan',              ts: '21:09:20' },
  { id: 's18', from: 'zion',        to: 'digitalocean', label: 'droplet.status — healthy 99.9%',          ts: '21:08:44' },
  { id: 's19', from: 'zion',        to: 'firecrawl',    label: 'scrape — competitor landing page',        ts: '21:07:30' },
  { id: 's20', from: 'zion',        to: 'tavily',       label: 'search — AI automation trends 2026',     ts: '21:06:15' },
]

const samplePulses = [
  ['zion',       'openrouter',   'LLM call → claude-sonnet-4-6'],
  ['zion',       'telegram',     'sendMessage → Build Room'],
  ['zion',       'clickup',      'Task update — P1 in progress'],
  ['mem0',       'qdrant',       'vector search — memory recall'],
  ['zion',       'gws',          'calendar.list — next 24h'],
  ['openrouter', 'claude',       'Routing → Claude Sonnet 4.6'],
  ['openrouter', 'qwen',         'Routing → Qwen3-235b'],
  ['zion',       'atlas',        'SSH dispatch → atlas executor'],
  ['zion',       'github',       'git push — operator-ui main'],
  ['github',     'vercel',       'deploy triggered — v1.2'],
  ['zion',       'apollo',       'people.search — 50 leads enriched'],
  ['zion',       'apify',        'actor.run → tweet-scraper-v2'],
  ['zion',       'supabase',     'SELECT clinics WHERE active=true'],
  ['zion',       'elevenlabs',   'TTS → Lamin voice — morning brief'],
  ['zion',       'twilio',       'SMS alert → +1813xxxxxx'],
  ['zion',       'miro',         'board.create — sprint planning'],
  ['zion',       'mem0',         'memory.add — preference stored'],
  ['zion',       'qdrant',       'vector upsert — session embedding'],
  ['zion',       'ark',          'task dispatch → ark executor'],
  ['zion',       'n8n',          'workflow.trigger — lead-enrichment'],
  ['zion',       'stripe',       'payment.intent — $249 plan'],
  ['zion',       'posthog',      'event.capture — page_view GlowRoute'],
  ['zion',       'ga4',          'report.query — 7d organic traffic'],
  ['zion',       'cloudflare',   'DNS check — operator.sovereign-hq.com'],
  ['zion',       'firecrawl',    'scrape — glowroute competitor page'],
  ['zion',       'tavily',       'search — AI automation trends 2026'],
  ['zion',       'digitalocean', 'droplet.status — healthy 99.9%'],
  ['zion',       'tailscale',    'peer.ping — atlas 100.78.163.113'],
  ['zion',       'calcom',       'booking.create — demo slot reserved'],
  ['zion',       'privacy',      'card.create — SINGLE_USE $249'],
  ['zion',       'looker',       'dashboard.refresh — GlowRoute KPIs'],
]

export default function IntegrationsView() {
  const initNodes = integrationNodes.map(makeNode)
  const initEdges = connections.map(([f, t]) => makeEdge(f, t, false))

  const [nodes, , onNodesChange] = useNodesState(initNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges)
  const [isPlaying, setIsPlaying] = useState(true)
  const [events, setEvents] = useState<PulseEvent[]>(seedEvents)
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Pulse animation — light up the edge between active nodes
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const pick = samplePulses[Math.floor(Math.random() * samplePulses.length)]
      const [from, to, evtLabel] = pick
      const edgeId = `${from}-${to}`

      // Activate edge
      setEdges(prev => prev.map(e =>
        e.id === edgeId ? makeEdge(from, to, true) : e
      ))

      // Push event into marquee list
      const newEvt: PulseEvent = {
        id: Date.now().toString(),
        from, to,
        label: evtLabel,
        ts: new Date().toLocaleTimeString('en-US', { hour12: false }),
      }
      setEvents(prev => [newEvt, ...prev.slice(0, 29)])

      // Deactivate after 1.8s
      setTimeout(() => {
        setEdges(prev => prev.map(e =>
          e.id === edgeId ? makeEdge(from, to, false) : e
        ))
      }, 1800)
    }, 2200)

    return () => clearInterval(interval)
  }, [isPlaying, setEdges])

  return (
    <div className="flex flex-col h-full">

      {/* ── Graph — takes all available height above marquee ── */}
      <div className="flex-1 relative min-h-0">

        {/* Header controls */}
        <div className="absolute top-3 left-4 z-10 flex items-center gap-2.5">
          <span className="text-[11px] font-semibold text-[#8aacbc]">Integration Map</span>
          <button
            onClick={() => setIsPlaying(v => !v)}
            className={cn(
              'text-[9px] px-2 py-0.5 rounded font-mono transition-colors',
              isPlaying
                ? 'bg-[#ECAB23]/10 text-[#ECAB23] border border-[#ECAB23]/20'
                : 'bg-[#0a2535] text-[#4a7a94] border border-[#1a4a62]'
            )}
          >
            {isPlaying ? '● LIVE' : '○ PAUSED'}
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          proOptions={{ hideAttribution: true }}
          style={{ background: '#0a1e2a' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#1a4a62" />
          <Controls
            style={{
              background: '#0E3846',
              border: '1px solid #1a4a62',
              borderRadius: 8,
            }}
          />
        </ReactFlow>
      </div>

      {/* ── Marquee — horizontal scrolling live events ── */}
      <div className="shrink-0 h-8 bg-[#071820] border-t border-[#1a4a62] flex items-center overflow-hidden relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #071820, transparent)' }} />

        {/* Label pill */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 border-r border-[#1a4a62] h-full z-10 bg-[#071820]">
          <div className={cn(
            'w-1.5 h-1.5 rounded-full',
            isPlaying ? 'bg-[#ECAB23] animate-pulse' : 'bg-[#2a4a5a]'
          )} />
          <span className="text-[9px] font-mono text-[#4a7a94] uppercase tracking-wider whitespace-nowrap">Live Events</span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex items-center gap-0 whitespace-nowrap"
            style={{
              animation: isPlaying ? 'marquee 40s linear infinite' : 'none',
              display: 'inline-flex',
            }}
          >
            {/* Duplicate for seamless loop */}
            {[...events, ...events].map((evt, i) => (
              <span key={`${evt.id}-${i}`} className="inline-flex items-center gap-1.5 px-4 text-[10px]">
                <span className="text-[#ECAB23] font-mono">{evt.ts}</span>
                <span className="text-[#4a7a94] font-mono">{evt.from}</span>
                <span className="text-[#2a4a5a]">→</span>
                <span className="text-[#4a7a94] font-mono">{evt.to}</span>
                <span className="text-[#8aacbc]">{evt.label}</span>
                <span className="text-[#1a4a62] mx-2">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #071820, transparent)' }} />
      </div>

      {/* Marquee keyframe — injected via style tag */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
