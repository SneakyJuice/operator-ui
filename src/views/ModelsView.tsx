import { useState } from 'react'
import { MODELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Zap, DollarSign, CheckCircle } from 'lucide-react'

const speedDots = { Slow: 1, Medium: 2, Fast: 3, Fastest: 4 }

export default function ModelsView() {
  const [selected, setSelected] = useState('claude-sonnet-4-6')
  const [autoRoute, setAutoRoute] = useState(true)

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Model Selection</h2>
        <p className="text-sm text-[#555] mt-1">Choose a model or enable auto-routing by task size (S/M/L)</p>
      </div>

      {/* Auto-route toggle */}
      <div className="flex items-center justify-between p-4 bg-[#111] border border-[#222] rounded-xl mb-6">
        <div>
          <div className="text-sm font-medium text-[#ccc]">Auto-Route</div>
          <div className="text-[11px] text-[#555] mt-0.5">Platform selects model by task complexity (S/M/L)</div>
        </div>
        <button
          onClick={() => setAutoRoute(v => !v)}
          className={cn(
            'w-10 h-5 rounded-full transition-colors relative shrink-0',
            autoRoute ? 'bg-violet-600' : 'bg-[#333]'
          )}
        >
          <div className={cn(
            'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
            autoRoute ? 'translate-x-5' : 'translate-x-0.5'
          )} />
        </button>
      </div>

      {/* Model cards */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {MODELS.map(model => {
          const isSelected = selected === model.id
          const dots = speedDots[model.speed as keyof typeof speedDots] || 2
          return (
            <button
              key={model.id}
              onClick={() => { if (!autoRoute) setSelected(model.id) }}
              className={cn(
                'text-left p-4 rounded-xl border transition-all',
                isSelected && !autoRoute
                  ? 'bg-[#1a1a2e] border-violet-700/60 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                  : 'bg-[#111] border-[#1e1e1e] hover:border-[#333] hover:bg-[#141414]',
                autoRoute && 'opacity-60 cursor-default'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#e8e8e8]">{model.name}</span>
                    {isSelected && !autoRoute && <CheckCircle size={13} className="text-violet-400" />}
                  </div>
                  <div className="text-[10px] text-[#555]">{model.provider}</div>
                </div>
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: model.tierColor + '20', color: model.tierColor }}
                >
                  {model.tier.toUpperCase()}
                </span>
              </div>

              <div className="text-[11px] text-[#666] mb-3 leading-relaxed">{model.bestFor}</div>

              <div className="flex items-center justify-between">
                {/* Cost */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <DollarSign size={9} className="text-[#555]" />
                    <span className="text-[10px] text-[#666]">In: </span>
                    <span className="text-[10px] font-mono text-[#aaa]">${model.costIn.toFixed(2)}/M</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#666]">Out: </span>
                    <span className="text-[10px] font-mono text-[#aaa]">${model.costOut.toFixed(2)}/M</span>
                  </div>
                </div>
                {/* Speed dots */}
                <div className="flex items-center gap-1">
                  <Zap size={9} className="text-[#555]" />
                  <div className="flex gap-0.5">
                    {[1,2,3,4].map(d => (
                      <div
                        key={d}
                        className={cn('w-1.5 h-1.5 rounded-full', d <= dots ? 'bg-violet-500' : 'bg-[#2a2a2a]')}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] text-[#555] ml-0.5">{model.speed}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Cost estimate preview */}
      <div className="mt-6 p-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl">
        <div className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Cost Preview</div>
        <div className="text-xs text-[#777]">
          {autoRoute
            ? 'Auto-route active — model selected per task: S→Qwen, M→Sonnet, L→Opus'
            : `Selected: ${MODELS.find(m => m.id === selected)?.name} · Est. ~1000 tokens → $${((MODELS.find(m => m.id === selected)?.costIn || 0) / 1000).toFixed(5)}`
          }
        </div>
      </div>
    </div>
  )
}
