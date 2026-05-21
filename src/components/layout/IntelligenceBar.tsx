import { cn } from '@/lib/utils'
import { BUDGET } from '@/lib/constants'
import { Activity, DollarSign, Zap } from 'lucide-react'
import type { LiveData } from '@/lib/useLiveData'

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
  working: 'bg-[#ECAB23] animate-pulse',
  idle:    'bg-yellow-500',
  offline: 'bg-[#2a4a5a]',
}

function CostMeter({ spent, limit, label }: { spent: number; limit: number; label: string }) {
  const pct = Math.min((spent / limit) * 100, 100)
  const color = pct >= 90 ? 'text-red-400' : pct >= 70 ? 'text-yellow-400' : 'text-[#ECAB23]'
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-[#ECAB23]'

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[#4a7a94]">{label}</span>
      <div className="w-16 h-1 bg-[#0a2535] rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-[10px] font-mono', color)}>
        ${spent.toFixed(2)}<span className="text-[#2a4a5a]">/{limit}</span>
      </span>
    </div>
  )
}

interface IntelligenceBarProps {
  liveData?: LiveData
}

export default function IntelligenceBar({ liveData = undefined }: IntelligenceBarProps) {
  return (
    <footer className="flex items-center justify-between px-4 h-[36px] bg-[#071820] border-t border-[#1a4a62] shrink-0 text-xs">

      {/* Left — agent status */}
      <div className="flex items-center gap-3">
        <Activity size={11} className="text-[#2a4a5a]" />
        {liveData?.agents.zion && <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', 
              liveData.agents.zion.status === 'online' ? 'bg-emerald-500' :
              liveData.agents.zion.status === 'loading' ? 'bg-[#ECAB23] animate-pulse' :
              liveData.agents.zion.status === 'degraded' ? 'bg-yellow-500' :
              'bg-[#2a4a5a]'
            )} />
            <span className="text-[#4a7a94] text-[10px]">Zion</span>
          </div>}
        {liveData?.agents.atlas && <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', 
              liveData.agents.atlas.status === 'online' ? 'bg-emerald-500' :
              liveData.agents.atlas.status === 'loading' ? 'bg-[#ECAB23] animate-pulse' :
              liveData.agents.atlas.status === 'degraded' ? 'bg-yellow-500' :
              'bg-[#2a4a5a]'
            )} />
            <span className="text-[#4a7a94] text-[10px]">Atlas</span>
          </div>}
        {liveData?.agents.ark && <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', 
              liveData.agents.ark.status === 'online' ? 'bg-emerald-500' :
              liveData.agents.ark.status === 'loading' ? 'bg-[#ECAB23] animate-pulse' :
              liveData.agents.ark.status === 'degraded' ? 'bg-yellow-500' :
              'bg-[#2a4a5a]'
            )} />
            <span className="text-[#4a7a94] text-[10px]">Ark</span>
          </div>}
        <span className="text-[#1a4a62] mx-1">|</span>
        <span className="text-[#4a7a94] text-[10px]">0 active tasks</span>
      </div>

      {/* Center — current activity */}
      <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#2a4a5a]">
        <Zap size={10} className="text-[#ECAB23]" />
        <span>Sovereign HQ Operator — Ready</span>
        <span className="flex items-center text-[#4a7a94] px-1">
          {liveData?.lastFetch 
            ? (new Date().getTime() - new Date(liveData.lastFetch).getTime()) / 1000 < 60 
              ? <><span>●</span><span className="ml-1 text-[#ECAB23] text-[9px]">LIVE</span></> 
              : <><span>○</span><span className="ml-1 text-[#4a7a94] text-[9px]">CACHED</span></>
            : <><span>○</span><span className="ml-1 text-[#4a7a94] text-[9px]">CACHED</span></>
          }
        </span>
      </div>

      {/* Right — cost meters */}
      <div className="flex items-center gap-4">
        <DollarSign size={11} className="text-[#2a4a5a] hidden sm:block" />
        <CostMeter spent={liveData?.cost.daily.spent ?? BUDGET.dailySpent} limit={liveData?.cost.daily.limit ?? BUDGET.dailyLimit} label="Today" />
        <CostMeter spent={liveData?.cost.monthly.spent ?? BUDGET.monthlySpent} limit={liveData?.cost.monthly.limit ?? BUDGET.monthlyLimit} label="Month" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1" title="All systems operational" />
      </div>

    </footer>
  )
}
