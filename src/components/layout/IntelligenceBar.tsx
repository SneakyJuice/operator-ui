import { cn } from '@/lib/utils'
import { BUDGET, AGENTS } from '@/lib/constants'
import { Activity, DollarSign, Zap } from 'lucide-react'

interface AgentDot {
  id: string
  name: string
  status: 'online' | 'working' | 'idle' | 'offline'
}

const mockAgentStatus: AgentDot[] = [
  { id: 'zion', name: 'Zion', status: 'online' },
  { id: 'atlas', name: 'Atlas', status: 'idle' },
  { id: 'ark', name: 'Ark', status: 'offline' },
]

const statusColor = {
  online:  'bg-emerald-500',
  working: 'bg-violet-500 animate-pulse',
  idle:    'bg-yellow-500',
  offline: 'bg-[#444]',
}

function CostMeter({ spent, limit, label }: { spent: number; limit: number; label: string }) {
  const pct = Math.min((spent / limit) * 100, 100)
  const color = pct >= 90 ? 'text-red-400' : pct >= 70 ? 'text-yellow-400' : 'text-emerald-400'
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-emerald-500'

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[#555]">{label}</span>
      <div className="w-16 h-1 bg-[#222] rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-[10px] font-mono', color)}>
        ${spent.toFixed(2)}<span className="text-[#444]">/${limit}</span>
      </span>
    </div>
  )
}

export default function IntelligenceBar() {
  return (
    <footer className="flex items-center justify-between px-4 h-[36px] bg-[#0a0a0a] border-t border-[#1a1a1a] shrink-0 text-xs">

      {/* Left — agent status */}
      <div className="flex items-center gap-3">
        <Activity size={11} className="text-[#444]" />
        {mockAgentStatus.map(a => (
          <div key={a.id} className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', statusColor[a.status])} />
            <span className="text-[#555] text-[10px]">{a.name}</span>
          </div>
        ))}
        <span className="text-[#333] mx-1">|</span>
        <span className="text-[#555] text-[10px]">0 active tasks</span>
      </div>

      {/* Center — current activity */}
      <div className="flex items-center gap-1.5 text-[10px] text-[#444]">
        <Zap size={10} className="text-violet-600" />
        <span>Sovereign HQ Operator — Ready</span>
      </div>

      {/* Right — cost meters */}
      <div className="flex items-center gap-4">
        <DollarSign size={11} className="text-[#444]" />
        <CostMeter spent={BUDGET.dailySpent} limit={BUDGET.dailyLimit} label="Today" />
        <CostMeter spent={BUDGET.monthlySpent} limit={BUDGET.monthlyLimit} label="Month" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1" title="All systems operational" />
      </div>

    </footer>
  )
}
