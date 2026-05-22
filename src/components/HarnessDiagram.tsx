import { useEffect, useRef } from 'react'

const GOLD = '#ECAB23'
const BORDER = '#1a4a62'
const CARD = '#0a2535'
const BG = '#071820'
const MUTED = '#4a7a94'
const SUB = '#8aacbc'
const GREEN = '#10b981'
const BLUE = '#3b82f6'

interface Node {
  id: string
  emoji: string
  name: string
  sub: string
  badge?: string
  tip: string[]
  special?: 'anthony' | 'zion' | 'integration'
}

const LANES: { label: string; nodes: Node[] }[] = [
  {
    label: 'Human Operator',
    nodes: [
      { id: 'anthony', emoji: '👑', name: 'Anthony Sealey', sub: 'Operator · Override Authority', tip: ['Commands · Override · Approval', 'Telegram: primary interface', 'Trust level: absolute'], special: 'anthony' },
    ],
  },
  {
    label: 'Zion — Orchestration Pipeline',
    nodes: [
      { id: 'telegram', emoji: '📨', name: 'Telegram Input', sub: 'Commands & messages', tip: ['Bot API webhook', 'requireMention: true (groups)', 'Channels: HQ · Build Room · Bot Ops'] },
      { id: 'zion', emoji: '⚡', name: 'Zion', sub: 'Orchestrator · DO Droplet', badge: 'claude-sonnet-4-6', tip: ['IP: 165.245.136.97', 'Model: claude-sonnet-4-6', 'Gateway: port 18789', 'Always On · Memory owner'], special: 'zion' },
      { id: 'memory', emoji: '🧠', name: 'Memory Layer', sub: 'MEMORY.md · Mem0 · Qdrant', tip: ['MEMORY.md: structured facts', 'Mem0/Qdrant: semantic search', '36 memories seeded · shared'] },
      { id: 'taskcard', emoji: '📋', name: 'Task Card Writer', sub: 'JSON · scope locks · retry', tip: ['Schema: TASK_HARNESS_SPEC.json', 'Fields: taskId · surface · model', 'Retry: 3x exponential backoff'] },
      { id: 'dispatch', emoji: '🚀', name: 'Dispatch Engine', sub: 'dispatch.sh · A2A primary', tip: ['Primary: A2A Protocol (port 10002)', 'Fallback: SSH', '3-strike rule · Dead Man\'s Switch 45min', 'Max 5 concurrent sub-agents'] },
    ],
  },
  {
    label: 'Execution Layer',
    nodes: [
      { id: 'atlas', emoji: '🔵', name: 'Atlas', sub: 'Primary Executor · Always On', badge: 'qwen3-235b', tip: ['Beelink WSL2 · IP: 100.78.163.113', 'A2A: port 10002 · autostart', 'Default route for all tasks'] },
      { id: 'ark', emoji: '🟢', name: 'Ark', sub: 'Secondary Executor · Mobile', badge: 'qwen3-235b', tip: ['Laptop (Windows) · IP: 100.124.40.44', 'A2A: port 10002 · autostart', 'Use when: mobile · GUI · Playwright'] },
      { id: 'subagents', emoji: '🤖', name: 'Sub-Agents', sub: 'Spawned on demand · max 5', badge: 'qwen3-235b default', tip: ['Spawned via sessions_spawn', 'Never Sonnet on runners (GR-016)', 'Budget cap: $10/day hard stop'] },
      { id: 'buildroom', emoji: '🏗️', name: 'Build Room', sub: 'Telegram audit trail', tip: ['ID: -1003772945765', 'States: DELEGATE→ACCEPT→', 'IN_PROGRESS→COMPLETE/FAILED', 'Human-visible · bots post only'] },
    ],
  },
  {
    label: 'Integration Layer',
    nodes: [
      { id: 'openrouter', emoji: '🔀', name: 'OpenRouter', sub: 'Model router', tip: ['Routes to Claude · Qwen · Gemini'], special: 'integration' },
      { id: 'claude', emoji: '🤖', name: 'Claude', sub: 'Anthropic', tip: ['claude-sonnet-4-6 · claude-opus-4-7'], special: 'integration' },
      { id: 'qwen', emoji: '🧬', name: 'Qwen3-235b', sub: 'Execution default', tip: ['83% cheaper than DeepSeek V3.1', '2.7x faster · 262K ctx'], special: 'integration' },
      { id: 'gemini', emoji: '✨', name: 'Gemini Flash', sub: 'Bulk tasks', tip: ['gemini-2.5-flash · cheapest tier'], special: 'integration' },
      { id: 'clickup', emoji: '📊', name: 'ClickUp', sub: 'Task mgmt', tip: ['Workspace: 9017933951', 'Bot Ops Folder: 90176900706'], special: 'integration' },
      { id: 'gws', emoji: '📧', name: 'Google WS', sub: 'Gmail · Cal · Drive', tip: ['5 accounts via mcporter MCP'], special: 'integration' },
      { id: 'github', emoji: '🐙', name: 'GitHub', sub: 'Source control', tip: ['SneakyJuice org · operator-ui repo'], special: 'integration' },
      { id: 'vercel', emoji: '▲', name: 'Vercel', sub: 'Deploy', tip: ['Auto-deploy on git push to main'], special: 'integration' },
      { id: 'supabase', emoji: '🟩', name: 'Supabase', sub: 'Database', tip: ['GlowRoute clinic data · 1054 rows'], special: 'integration' },
      { id: 'mem0', emoji: '💾', name: 'Mem0/Qdrant', sub: 'Vector memory', tip: ['Qdrant on Zion: 100.89.96.32:6333', 'Collection: sovereign_hq_memories'], special: 'integration' },
      { id: 'elevenlabs', emoji: '🎙️', name: 'ElevenLabs', sub: 'TTS · Lamin', tip: ['Voice ID: hILdTfuUq4LRBMrxHERr', 'Deep, calm — Anthony\'s preferred'], special: 'integration' },
      { id: 'do', emoji: '🌊', name: 'Digital Ocean', sub: 'Zion host', tip: ['Droplet: 165.245.136.97'], special: 'integration' },
      { id: 'tailscale', emoji: '🔗', name: 'Tailscale', sub: 'Mesh VPN', tip: ['100.x.x.x addressing', 'Zion ↔ Atlas ↔ Ark tunnel'], special: 'integration' },
    ],
  },
]

function NodeCard({ node, onRef }: { node: Node; onRef?: (el: HTMLDivElement | null) => void }) {
  const isIntegration = node.special === 'integration'
  const isZion = node.special === 'zion'
  const isAnthony = node.special === 'anthony'

  return (
    <div
      ref={onRef}
      data-node-id={node.id}
      className="relative group"
      style={{
        background: CARD,
        border: `1px solid ${isAnthony || isZion ? GOLD : BORDER}`,
        borderRadius: isIntegration ? '10px' : '14px',
        padding: isIntegration ? '10px 14px' : '16px 20px',
        textAlign: 'center',
        minWidth: isIntegration ? '90px' : isZion ? '180px' : '130px',
        cursor: 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: isZion ? `0 0 20px rgba(236,171,35,0.2)` : isAnthony ? `0 0 16px rgba(236,171,35,0.15)` : 'none',
        animation: isZion ? 'zionPulse 3s ease-in-out infinite' : undefined,
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px ${GOLD}`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = ''
        el.style.boxShadow = isZion ? `0 0 20px rgba(236,171,35,0.2)` : isAnthony ? `0 0 16px rgba(236,171,35,0.15)` : 'none'
      }}
    >
      <div style={{ fontSize: isIntegration ? '18px' : isZion ? '28px' : '22px', marginBottom: '4px' }}>{node.emoji}</div>
      <div style={{ fontSize: isIntegration ? '10px' : isZion ? '14px' : '12px', fontWeight: 600, color: isAnthony || isZion ? GOLD : '#e8e8e8' }}>{node.name}</div>
      <div style={{ fontSize: '9px', color: MUTED, marginTop: '2px' }}>{node.sub}</div>
      {node.badge && (
        <div style={{ display: 'inline-block', marginTop: '4px', fontSize: '9px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', background: 'rgba(236,171,35,0.1)', color: GOLD, border: `1px solid rgba(236,171,35,0.2)` }}>{node.badge}</div>
      )}
      {/* Tooltip */}
      <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50"
        style={{ background: '#0d1f2d', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '10px 14px', fontSize: '10px', color: SUB, whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', textAlign: 'left', lineHeight: '1.7' }}
      >
        <div style={{ color: GOLD, fontWeight: 600, marginBottom: '2px', fontSize: '11px' }}>{node.name}</div>
        {node.tip.map((t, i) => <div key={i}>{t}</div>)}
        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${BORDER}` }} />
      </div>
    </div>
  )
}

export default function HarnessDiagram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Small delay for layout to settle
    const t = setTimeout(() => drawLines(), 150)
    window.addEventListener('resize', drawLines)
    return () => { clearTimeout(t); window.removeEventListener('resize', drawLines) }
  }, [])

  function getCenter(id: string): { x: number; y: number; top: number; bottom: number; left: number; right: number } | null {
    const container = containerRef.current
    const el = container?.querySelector(`[data-node-id="${id}"]`) as HTMLElement
    if (!el || !container) return null
    const cr = container.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    return {
      x: er.left - cr.left + er.width / 2,
      y: er.top - cr.top + er.height / 2,
      top: er.top - cr.top,
      bottom: er.top - cr.top + er.height,
      left: er.left - cr.left,
      right: er.left - cr.left + er.width,
    }
  }

  function makePath(svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, stroke: string, dasharray?: string, opacity = 1, id?: string) {
    const dy = (y2 - y1) * 0.45
    const d = `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', stroke)
    path.setAttribute('stroke-width', '1.5')
    path.setAttribute('opacity', String(opacity))
    if (dasharray) path.setAttribute('stroke-dasharray', dasharray)
    if (id) path.setAttribute('id', id)
    svg.appendChild(path)
    return path
  }

  function addTravelDot(svg: SVGSVGElement, pathId: string, dur: number) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('r', '3.5')
    circle.setAttribute('fill', GOLD)
    circle.style.filter = `drop-shadow(0 0 4px ${GOLD})`
    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion')
    anim.setAttribute('dur', `${dur}s`)
    anim.setAttribute('repeatCount', 'indefinite')
    const mpath = document.createElementNS('http://www.w3.org/2000/svg', 'mpath')
    mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${pathId}`)
    anim.appendChild(mpath)
    circle.appendChild(anim)
    svg.appendChild(circle)
  }

  let pid = 0
  function drawLines() {
    const svg = svgRef.current
    const container = containerRef.current
    if (!svg || !container) return
    // Clear previous
    while (svg.firstChild) svg.removeChild(svg.firstChild)
    pid = 0
    const nextId = () => `hp${++pid}`

    // Anthony → Zion
    const anthony = getCenter('anthony')
    const zion = getCenter('zion')
    if (anthony && zion) {
      const id = nextId()
      makePath(svg, anthony.x, anthony.bottom, zion.x, zion.top, GOLD, '6 4', 0.8, id)
      addTravelDot(svg, id, 2.2)
    }

    // Zion → Atlas
    const atlas = getCenter('atlas')
    if (zion && atlas) {
      const id = nextId()
      makePath(svg, zion.x - 50, zion.bottom, atlas.x, atlas.top, GOLD, undefined, 0.8, id)
      addTravelDot(svg, id, 1.8)
    }

    // Zion → Ark
    const ark = getCenter('ark')
    if (zion && ark) {
      const id = nextId()
      makePath(svg, zion.x, zion.bottom, ark.x, ark.top, GOLD, undefined, 0.6, id)
      addTravelDot(svg, id, 2.4)
    }

    // Zion → Sub-agents
    const sub = getCenter('subagents')
    if (zion && sub) {
      const id = nextId()
      makePath(svg, zion.x + 50, zion.bottom, sub.x, sub.top, GOLD, '4 6', 0.6, id)
      addTravelDot(svg, id, 3.0)
    }

    // Atlas/Ark/Sub → Build Room
    const buildroom = getCenter('buildroom')
    if (atlas && buildroom) makePath(svg, atlas.right, atlas.y, buildroom.left, buildroom.y, BLUE, '4 4', 0.4)
    if (ark && buildroom) makePath(svg, ark.right, ark.y, buildroom.left, buildroom.y + 10, BLUE, '4 4', 0.3)

    // Zion ↔ Memory (bidirectional green)
    const memory = getCenter('memory')
    if (zion && memory) {
      makePath(svg, zion.right, zion.y - 8, memory.left, memory.y - 8, GREEN, '4 4', 0.5)
      makePath(svg, memory.left, memory.y + 8, zion.right, zion.y + 8, GREEN, '4 4', 0.5)
    }

    // Dispatch → OpenRouter (integration)
    const dispatch = getCenter('dispatch')
    const openrouter = getCenter('openrouter')
    if (dispatch && openrouter) makePath(svg, dispatch.x, dispatch.bottom, openrouter.x, openrouter.top, BORDER, undefined, 0.5)
  }

  return (
    <div ref={containerRef} style={{ background: BG, borderRadius: '14px', padding: '20px 16px 16px', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes zionPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(236,171,35,0.15); }
          50% { box-shadow: 0 0 40px rgba(236,171,35,0.35), 0 0 80px rgba(236,171,35,0.08); }
        }
        @keyframes dashAnim { to { stroke-dashoffset: -20; } }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: GOLD, letterSpacing: '-0.2px' }}>⚡ Sovereign HQ — Harness Architecture</div>
        <div style={{ fontSize: '10px', color: MUTED, marginTop: '3px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>IACP v2.0 · Multi-Agent Orchestration Layer · Built May 2026</div>
      </div>

      {/* SVG lines overlay */}
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />

      {/* Lanes */}
      {LANES.map(lane => (
        <div key={lane.label} style={{ position: 'relative', zIndex: 2, marginBottom: '20px' }}>
          <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: MUTED, marginBottom: '10px', paddingLeft: '8px', borderLeft: `2px solid ${BORDER}` }}>
            {lane.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: lane.nodes[0].special === 'integration' ? '10px' : '14px', flexWrap: 'wrap' }}>
            {lane.nodes.map((node, i) => (
              <>
                {i > 0 && lane.label.includes('Zion') && (
                  <div key={`arr-${i}`} style={{ color: BORDER, fontSize: '16px', userSelect: 'none' }}>→</div>
                )}
                <NodeCard key={node.id} node={node} />
              </>
            ))}
          </div>
        </div>
      ))}

      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '12px', borderTop: `1px solid ${BORDER}`, fontSize: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ color: MUTED }}>Sovereign HQ · IACP v2.0 · May 2026</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Zion', online: true },
            { label: 'Atlas', online: false },
            { label: 'Ark', online: false },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', border: `1px solid ${BORDER}`, background: CARD, fontSize: '10px', fontWeight: 600, color: '#e8e8e8' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.online ? GREEN : MUTED, boxShadow: s.online ? `0 0 6px ${GREEN}` : undefined }} />
              {s.label} {s.online ? 'ONLINE' : 'OFFLINE'}
            </div>
          ))}
        </div>
        <div style={{ color: MUTED }}>3 surfaces · 33 integrations · $10/day</div>
      </div>
    </div>
  )
}
