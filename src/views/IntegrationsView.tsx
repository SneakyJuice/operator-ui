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
  { id: 'zion',       label: 'Zion',             emoji: '⚡', category: 'Surface', color: '#ECAB23', status: 'active' },
  { id: 'atlas',      label: 'Atlas',            emoji: '🔵', category: 'Surface', color: '#3b82f6', status: 'idle' },
  { id: 'ark',        label: 'Ark',              emoji: '🟣', category: 'Surface', color: '#6366f1', status: 'offline' },
  { id: 'openrouter', label: 'OpenRouter',       emoji: '🔀', category: 'AI',      color: '#f59e0b', status: 'active' },
  { id: 'claude',     label: 'Claude',           emoji: '✦',  category: 'AI',      color: '#a855f7', status: 'idle' },
  { id: 'qwen',       label: 'Qwen3-235b',       emoji: '🧠', category: 'AI',      color: '#10b981', status: 'idle' },
  { id: 'gemini',     label: 'Gemini Flash',     emoji: '💡', category: 'AI',      color: '#f97316', status: 'idle' },
  { id: 'telegram',   label: 'Telegram',         emoji: '✈️', category: 'Channel', color: '#0ea5e9', status: 'active' },
  { id: 'clickup',    label: 'ClickUp',          emoji: '✅', category: 'Tool',    color: '#7c3aed', status: 'active' },
  { id: 'gws',        label: 'Google Workspace', emoji: '📁', category: 'Tool',    color: '#ef4444', status: 'active' },
  { id: 'vercel',     label: 'Vercel',           emoji: '▲',  category: 'Infra',   color: '#e8e8e8', status: 'idle' },
  { id: 'qdrant',     label: 'Qdrant',           emoji: '🗄️', category: 'Infra',   color: '#06b6d4', status: 'active' },
  { id: 'mem0',       label: 'Mem0',             emoji: '💾', category: 'Memory',  color: '#84cc16', status: 'active' },
  { id: 'github',     label: 'GitHub',           emoji: '🐙', category: 'Infra',   color: '#94a3b8', status: 'idle' },
]

const positions: Record<string, { x: number; y: number }> = {
  zion:       { x: 360, y: 200 },
  atlas:      { x: 120, y: 80 },
  ark:        { x: 120, y: 320 },
  openrouter: { x: 600, y: 200 },
  claude:     { x: 820, y: 80 },
  qwen:       { x: 820, y: 200 },
  gemini:     { x: 820, y: 320 },
  telegram:   { x: 360, y: 420 },
  clickup:    { x: 120, y: 480 },
  gws:        { x: 360, y: 540 },
  vercel:     { x: 600, y: 480 },
  qdrant:     { x: 600, y: 380 },
  mem0:       { x: 120, y: 200 },
  github:     { x: 600, y: 60 },
}

const connections: [string, string][] = [
  ['zion', 'atlas'], ['zion', 'ark'], ['zion', 'openrouter'],
  ['zion', 'telegram'], ['zion', 'clickup'], ['zion', 'gws'],
  ['openrouter', 'claude'], ['openrouter', 'qwen'], ['openrouter', 'gemini'],
  ['zion', 'mem0'], ['mem0', 'qdrant'],
  ['zion', 'github'], ['github', 'vercel'],
  ['zion', 'qdrant'],
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
  { id: 's1', from: 'zion',      to: 'openrouter', label: 'LLM request → claude-sonnet-4-6', ts: '21:21:03' },
  { id: 's2', from: 'zion',      to: 'clickup',    label: 'POST /task — P0 created',          ts: '21:20:45' },
  { id: 's3', from: 'zion',      to: 'telegram',   label: 'sendMessage → Build Room',          ts: '21:20:12' },
  { id: 's4', from: 'mem0',      to: 'qdrant',     label: 'vector search — memory recall',     ts: '21:19:55' },
  { id: 's5', from: 'zion',      to: 'gws',        label: 'calendar.list — morning brief',     ts: '21:19:30' },
  { id: 's6', from: 'openrouter',to: 'claude',     label: 'Routing → claude-sonnet-4-6',       ts: '21:18:44' },
  { id: 's7', from: 'zion',      to: 'github',     label: 'push — operator-ui main',           ts: '21:17:58' },
  { id: 's8', from: 'github',    to: 'vercel',     label: 'deploy triggered — v1.1',           ts: '21:17:59' },
]

const samplePulses = [
  ['zion', 'openrouter', 'LLM call → claude-sonnet-4-6'],
  ['zion', 'telegram',   'sendMessage → Build Room'],
  ['zion', 'clickup',    'Task update — P1 in progress'],
  ['mem0', 'qdrant',     'vector search — memory recall'],
  ['zion', 'gws',        'calendar.list — next 24h'],
  ['openrouter', 'claude',  'Routing → Claude Sonnet'],
  ['openrouter', 'qwen',    'Routing → Qwen3-235b'],
  ['zion', 'atlas',         'SSH dispatch → atlas executor'],
  ['zion', 'github',        'git push — operator-ui'],
  ['github', 'vercel',      'Vercel deploy triggered'],
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
