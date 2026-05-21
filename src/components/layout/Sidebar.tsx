import { cn } from '@/lib/utils'
import {
  Bot, Cpu, MessageSquare, Zap, BookOpen, Palette,
  Activity, Settings, ChevronRight
} from 'lucide-react'

export type NavSection = 'agents' | 'channels' | 'models' | 'skills' | 'integrations' | 'design' | 'logs' | 'settings'

interface SidebarProps {
  active: NavSection
  onChange: (s: NavSection) => void
}

const navItems: { id: NavSection; label: string; icon: React.FC<any>; badge?: string }[] = [
  { id: 'agents',       label: 'Agents',       icon: Bot },
  { id: 'channels',     label: 'Channels',      icon: MessageSquare },
  { id: 'models',       label: 'Models',        icon: Cpu },
  { id: 'skills',       label: 'Skills',        icon: BookOpen },
  { id: 'integrations', label: 'Integrations',  icon: Zap, badge: 'LIVE' },
  { id: 'design',       label: 'Design Center', icon: Palette },
  { id: 'logs',         label: 'Logs',          icon: Activity },
  { id: 'settings',     label: 'Settings',      icon: Settings },
]

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-[#111111] border-r border-[#1e1e1e] w-[220px] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-[#1e1e1e]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">S</div>
        <div>
          <div className="text-xs font-semibold text-white leading-none">Sovereign HQ</div>
          <div className="text-[10px] text-[#555] leading-none mt-0.5">Operator Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors group',
                isActive
                  ? 'bg-[#1a1a2e] text-violet-400 border-r-2 border-violet-500'
                  : 'text-[#888] hover:text-[#ccc] hover:bg-[#161616]'
              )}
            >
              <Icon size={15} className={cn(isActive ? 'text-violet-400' : 'text-[#555] group-hover:text-[#999]')} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] px-1 py-0.5 rounded bg-violet-900/50 text-violet-400 font-mono">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight size={12} className="text-violet-500 opacity-60" />}
            </button>
          )
        })}
      </nav>

      {/* Bottom — version */}
      <div className="px-4 py-3 border-t border-[#1e1e1e]">
        <div className="text-[10px] text-[#444]">v1.0.0 · operator.sovereign-hq.com</div>
      </div>
    </aside>
  )
}
