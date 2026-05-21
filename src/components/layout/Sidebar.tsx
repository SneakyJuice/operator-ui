import { cn } from '@/lib/utils'
import {
  Bot, Cpu, MessageSquare, Zap, BookOpen, Palette,
  Activity, Settings, ChevronRight, FolderKanban, CheckSquare
} from 'lucide-react'

export type NavSection = 'agents' | 'projects' | 'buildtasks' | 'channels' | 'models' | 'skills' | 'integrations' | 'design' | 'logs' | 'settings'

interface SidebarProps {
  active: NavSection
  onChange: (s: NavSection) => void
}

const navItems: { id: NavSection; label: string; icon: React.FC<any>; badge?: string }[] = [
  { id: 'agents',       label: 'Agents',       icon: Bot },
  { id: 'projects',     label: 'Projects',     icon: FolderKanban },
  { id: 'buildtasks',   label: 'Build Tasks',  icon: CheckSquare, badge: 'CU' },
  { id: 'channels',     label: 'Channels',     icon: MessageSquare },
  { id: 'models',       label: 'Models',       icon: Cpu },
  { id: 'skills',       label: 'Skills',       icon: BookOpen },
  { id: 'integrations', label: 'Integrations', icon: Zap, badge: 'LIVE' },
  { id: 'design',       label: 'Design Center',icon: Palette },
  { id: 'logs',         label: 'Logs',         icon: Activity },
  { id: 'settings',     label: 'Settings',     icon: Settings },
]

// Mobile bottom nav — show only the most important 5
const mobileNavItems = navItems.filter(i => ['agents', 'projects', 'buildtasks', 'integrations', 'settings'].includes(i.id))

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col h-full bg-[#0E3846] border-r border-[#1a4a62] w-[220px] shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-[#1a4a62]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ECAB23] to-[#f0c050] flex items-center justify-center text-xs font-bold text-[#071820]">S</div>
          <div>
            <div className="text-xs font-semibold text-[#f0f0f0] leading-none">Sovereign HQ</div>
            <div className="text-[10px] text-[#4a7a94] leading-none mt-0.5">Operator Platform</div>
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
                    ? 'bg-[#ECAB23]/10 text-[#ECAB23] border-r-2 border-[#ECAB23]'
                    : 'text-[#8aacbc] hover:text-[#f0f0f0] hover:bg-[#123347]'
                )}
              >
                <Icon size={15} className={cn(isActive ? 'text-[#ECAB23]' : 'text-[#4a7a94] group-hover:text-[#8aacbc]')} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-[#ECAB23]/10 text-[#ECAB23] font-mono">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={12} className="text-[#ECAB23] opacity-60" />}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-3 border-t border-[#1a4a62]">
          <div className="text-[10px] text-[#2a4a5a]">v1.1.0 · operator.sovereign-hq.com</div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex bg-[#071820] border-t border-[#1a4a62] z-50 safe-area-pb">
        {mobileNavItems.map(item => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors relative',
                isActive ? 'text-[#ECAB23]' : 'text-[#4a7a94]'
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#ECAB23] rounded-full" />
              )}
              <Icon size={18} />
              <span className="text-[9px] font-medium leading-none">{item.label}</span>
              {item.badge && (
                <div className="absolute top-1.5 right-1/4 w-1.5 h-1.5 rounded-full bg-[#ECAB23]" />
              )}
            </button>
          )
        })}
      </nav>
    </>
  )
}
