import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, BackgroundVariant,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
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
  { id: 'zion',      label: 'Zion',            emoji: '⚡', category: 'Surface',  color: '#8b5cf6', status: 'active' },
  { id: 'atlas',     label: 'Atlas',           emoji: '🔵', category: 'Surface',  color: '#3b82f6', status: 'idle' },
  { id: 'ark',       label: 'Ark',             emoji: '🟣', category: 'Surface',  color: '#6366f1', status: 'offline' },
  { id: 'openrouter',label: 'OpenRouter',      emoji: '🔀', category: 'AI',       color: '#f59e0b', status: 'active' },
  { id: 'claude',    label: 'Claude',          emoji: '✦',  category: 'AI',       color: '#a855f7', status: 'idle' },
  { id: 'qwen',      label: 'Qwen3-235b',      emoji: '🧠', category: 'AI',       color: '#10b981', status: 'idle' },
  { id: 'gemini',    label: 'Gemini Flash',    emoji: '💡', category: 'AI',       color: '#f97316', status: 'idle' },
  { id: 'telegram',  label: 'Telegram',        emoji: '✈️', category: 'Channel',  color: '#0ea5e9', status: 'active' },
  { id: 'clickup',   label: 'ClickUp',         emoji: '✅', category: 'Tool',     color: '#7c3aed', status: 'active' },
  { id: 'gws',       label: 'Google Workspace',emoji: '📁', category: 'Tool',     color: '#ef4444', status: 'active' },
  { id: 'vercel',    label: 'Vercel',          emoji: '▲',  category: 'Infra',    color: '#e8e8e8', status: 'idle' },
  { id: 'qdrant',    label: 'Qdrant',          emoji: '🗄️', category: 'Infra',    color: '#06b6d4', status: 'active' },
  { id: 'mem0',      label: 'Mem0',            emoji: '💾', category: 'Memory',   color: '#84cc16', status: 'active' },
  { id: 'github',    label: 'GitHub',          emoji: '🐙', category: 'Infra',    color: '#94a3b8', status: 'idle' },
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

function makeNode(n: IntegrationNode): Node {
  const pos = positions[n.id] || { x: 0, y: 0 }
  return {
    id: n.id,
    position: pos,
    data: { label: n, status: n.status },
    type: 'integrationNode',
    style: { background: 'transparent', border: 'none', padding: 0 },
  }
}

function makeEdge(from: string, to: string): Edge {
  return {
    id: `${from}-${to}`,
    source: from,
    target: to,
    animated: false,
    style: { stroke: '#2a2a2a', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#333', width: 12, height: 12 },
  }
}

function IntegrationNodeComponent({ data }: { data: { label: IntegrationNode; status: NodeStatus } }) {
  const n = data.label
  const statusColor = n.status === 'active' ? '#10b981' : n.status === 'pulsing' ? '#8b5cf6' : n.status === 'idle' ? '#f59e0b' : '#444'
  return (
    <div
      className="flex flex-col items-center gap-1 p-3 rounded-xl border backdrop-blur-sm transition-all cursor-default select-none"
      style={{
        background: n.color + '08',
        borderColor: n.status === 'pulsing' ? n.color : n.color + '30',
        boxShadow: n.status === 'pulsing' ? `0 0 16px ${n.color}40` : n.status === 'active' ? `0 0 8px ${n.color}20` : 'none',
        minWidth: 90,
      }}
    >
      <div className="text-xl leading-none">{n.emoji}</div>
      <div className="text-[10px] font-medium text-[#ccc] text-center leading-tight">{n.label}</div>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
        <span className="text-[8px] text-[#555] uppercase">{n.status}</span>
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

const mockEvents: PulseEvent[] = [
  { id: '1', from: 'zion', to: 'openrouter', label: 'LLM request → claude-sonnet-4-6', ts: '20:21:03' },
  { id: '2', from: 'zion', to: 'clickup', label: 'POST /task — P0 created', ts: '20:20:45' },
  { id: '3', from: 'zion', to: 'telegram', label: 'sendMessage → Build Room', ts: '20:20:12' },
  { id: '4', from: 'mem0', to: 'qdrant', label: 'vector search — memory recall', ts: '20:19:55' },
  { id: '5', from: 'zion', to: 'gws', label: 'docs.create — BRD document', ts: '20:19:30' },
]

export default function IntegrationsView() {
  const initNodes = integrationNodes.map(makeNode)
  const initEdges = connections.map(([f, t]) => makeEdge(f, t))
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges)
  const [isPlaying, setIsPlaying] = useState(true)
  const [events, setEvents] = useState<PulseEvent[]>(mockEvents)
  const [pulsingEdge, setPulsingEdge] = useState<string | null>(null)

  // Simulate pulse animations
  useEffect(() => {
    if (!isPlaying) return
    const sampleConnections = [
      ['zion', 'openrouter', 'LLM call'],
      ['zion', 'telegram', 'Message sent'],
      ['zion', 'clickup', 'Task update'],
      ['mem0', 'qdrant', 'Memory search'],
      ['zion', 'gws', 'Calendar check'],
      ['openrouter', 'claude', 'Routing to Claude'],
      ['openrouter', 'qwen', 'Routing to Qwen'],
    ]
    const interval = setInterval(() => {
      const pick = sampleConnections[Math.floor(Math.random() * sampleConnections.length)]
      const edgeId = `${pick[0]}-${pick[1]}`
      setPulsingEdge(edgeId)
      setEdges(prev => prev.map(e =>
        e.id === edgeId
          ? { ...e, animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }
          : e
      ))
      const newEvt: PulseEvent = {
        id: Date.now().toString(),
        from: pick[0], to: pick[1], label: pick[2],
        ts: new Date().toLocaleTimeString('en-US', { hour12: false }),
      }
      setEvents(prev => [newEvt, ...prev.slice(0, 9)])
      setTimeout(() => {
        setEdges(prev => prev.map(e =>
          e.id === edgeId
            ? { ...e, animated: false, style: { stroke: '#2a2a2a', strokeWidth: 1.5 } }
            : e
        ))
        setPulsingEdge(null)
      }, 1800)
    }, 2500)
    return () => clearInterval(interval)
  }, [isPlaying, setEdges])

  return (
    <div className="flex h-full">
      {/* Graph */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="text-xs font-semibold text-[#666]">Integration Map</span>
          <button
            onClick={() => setIsPlaying(v => !v)}
            className={cn(
              'text-[9px] px-2 py-0.5 rounded font-mono transition-colors',
              isPlaying ? 'bg-violet-900/50 text-violet-400' : 'bg-[#222] text-[#555]'
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
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          style={{ background: '#0d0d0d' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1a1a1a" />
          <Controls style={{ background: '#111', border: '1px solid #222' }} />
        </ReactFlow>
      </div>

      {/* Event log */}
      <div className="w-[240px] border-l border-[#1e1e1e] bg-[#0f0f0f] flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">Live Events</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {events.map(evt => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-2.5 border-b border-[#111] hover:bg-[#111] transition-colors"
              >
                <div className="text-[10px] text-[#888] leading-snug">{evt.label}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] text-[#555] font-mono">{evt.from}</span>
                  <span className="text-[9px] text-[#444]">→</span>
                  <span className="text-[9px] text-[#555] font-mono">{evt.to}</span>
                  <span className="text-[9px] text-[#333] ml-auto">{evt.ts}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
