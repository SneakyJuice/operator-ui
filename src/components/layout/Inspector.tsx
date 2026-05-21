import { cn } from '@/lib/utils'
import { AGENTS, MODELS, BUDGET } from '@/lib/constants'
import { Bot, Cpu, TrendingUp, X } from 'lucide-react'

interface InspectorProps {
  open: boolean
  onClose: () => void
}

export default function Inspector({ open, onClose }: InspectorProps) {
  if (!open) return null

  return (
    <aside className="flex flex-col h-full bg-[#0E3846] border-l border-[#1a4a62] w-[280px] shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a4a62]">
        <span className="text-xs font-semibold text-[#8aacbc] uppercase tracking-wider">Inspector</span>
        <button onClick={onClose} className="text-[#4a7a94] hover:text-[#f0f0f0] transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Agent Status */}
        <div className="px-4 py-3 border-b border-[#1a4a62]">
          <div className="flex items-center gap-2 mb-3">
            <Bot size={12} className="text-[#4a7a94]" />
            <span className="text-[10px] font-semibold text-[#8aacbc] uppercase tracking-wider">Agents</span>
          </div>
          <div className="space-y-2">
            {AGENTS.map(agent => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{agent.emoji}</span>
                  <div>
                    <div className="text-xs text-[#f0f0f0]">{agent.name}</div>
                    <div className="text-[10px] text-[#4a7a94]">{agent.role}</div>
                  </div>
                </div>
                <div className={cn(
                  'text-[9px] px-1.5 py-0.5 rounded font-mono',
                  agent.id === 'zion' ? 'bg-emerald-900/40 text-emerald-400' :
                  agent.id === 'atlas' ? 'bg-yellow-900/40 text-yellow-400' :
                  'bg-[#0a2535] text-[#4a7a94]'
                )}>
                  {agent.id === 'zion' ? 'ONLINE' : agent.id === 'atlas' ? 'IDLE' : 'OFFLINE'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Model */}
        <div className="px-4 py-3 border-b border-[#1a4a62]">
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={12} className="text-[#4a7a94]" />
            <span className="text-[10px] font-semibold text-[#8aacbc] uppercase tracking-wider">Active Model</span>
          </div>
          <div className="bg-[#0a2535] rounded-lg p-3 border border-[#1a4a62]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[#f0f0f0]">Claude Sonnet 4.6</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ECAB23]/20 text-[#ECAB23] font-mono">HIGH</span>
            </div>
            <div className="text-[10px] text-[#4a7a94]">openrouter/anthropic</div>
            <div className="flex gap-3 mt-2 text-[10px]">
              <span className="text-[#4a7a94]">In: <span className="text-[#8aacbc]">$3.00/M</span></span>
              <span className="text-[#4a7a94]">Out: <span className="text-[#8aacbc]">$15.00/M</span></span>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={12} className="text-[#4a7a94]" />
            <span className="text-[10px] font-semibold text-[#8aacbc] uppercase tracking-wider">Budget</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Today', spent: BUDGET.dailySpent, limit: BUDGET.dailyLimit },
              { label: 'This Month', spent: BUDGET.monthlySpent, limit: BUDGET.monthlyLimit },
            ].map(b => {
              const pct = Math.min((b.spent / b.limit) * 100, 100)
              const color = pct >= 90 ? 'text-red-400' : pct >= 70 ? 'text-yellow-400' : 'text-[#ECAB23]'
              const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-[#ECAB23]'
              return (
                <div key={b.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-[#8aacbc]">{b.label}</span>
                    <span className={cn('text-[10px] font-mono', color)}>
                      ${b.spent.toFixed(2)} / ${b.limit}
                    </span>
                  </div>
                  <div className="h-1 bg-[#0a2535] rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', barColor)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
