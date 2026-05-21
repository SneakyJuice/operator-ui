import { useState } from 'react'
import Sidebar, { NavSection } from '@/components/layout/Sidebar'
import IntelligenceBar from '@/components/layout/IntelligenceBar'
import Inspector from '@/components/layout/Inspector'
import AgentsView from '@/views/AgentsView'
import ModelsView from '@/views/ModelsView'
import SkillsView from '@/views/SkillsView'
import DesignView from '@/views/DesignView'
import IntegrationsView from '@/views/IntegrationsView'
import PlaceholderView from '@/views/PlaceholderView'
import ProjectsView from '@/views/ProjectsView'
import BuildTasksView from '@/views/BuildTasksView'
import TaskFeedView from '@/views/TaskFeedView'
import AgentManagerView from '@/views/AgentManagerView'
import { PanelRight, Menu } from 'lucide-react'
import { useLiveData } from '@/lib/useLiveData'

export default function App() {
  const [section, setSection] = useState<NavSection>('agents')
  const [inspectorOpen, setInspectorOpen] = useState(false)

  const liveData = useLiveData(30000)

  const renderMain = () => {
    switch (section) {
      case 'agents':       return <AgentsView />
      case 'projects':     return <ProjectsView />
      case 'buildtasks':   return <BuildTasksView />
      case 'channels':     return <AgentsView />
      case 'models':       return <ModelsView />
      case 'skills':       return <SkillsView />
      case 'integrations': return <IntegrationsView />
      case 'design':       return <DesignView />
      case 'logs':         return <PlaceholderView title="Activity Logs" desc="Real-time API call log, agent action history, and cost attribution." icon="📋" />
      case 'settings':     return <PlaceholderView title="Settings" desc="Gateway config, auth, notifications, and workspace preferences." icon="⚙️" />
      case 'taskfeed':     return <TaskFeedView />
      case 'agentmanager': return <AgentManagerView liveData={liveData} />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a1e2a]">

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-4 h-10 bg-[#071820] border-b border-[#1a4a62] shrink-0 z-10">
        {/* Left: logo on mobile, status on desktop */}
        <div className="flex items-center gap-3">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#ECAB23] to-[#f0c050] flex items-center justify-center text-[10px] font-bold text-[#071820]">S</div>
            <span className="text-xs font-semibold text-[#f0f0f0]">Sovereign HQ</span>
          </div>
          {/* Desktop status */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-[#4a7a94]">operator.sovereign-hq.com</span>
          </div>
        </div>

        <div className="text-[10px] text-[#2a4a5a] font-mono tracking-widest hidden md:block">SOVEREIGN HQ OPERATOR</div>

        {/* Right: inspector toggle */}
        <button
          onClick={() => setInspectorOpen(v => !v)}
          className="text-[#4a7a94] hover:text-[#f0f0f0] transition-colors p-1"
          title="Toggle Inspector"
        >
          <PanelRight size={15} />
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop sidebar — hidden on mobile */}
        <Sidebar active={section} onChange={setSection} />

        {/* Main content — full width on mobile, add pb for mobile bottom nav */}
        <main className="flex-1 min-w-0 overflow-hidden bg-[#0a1e2a] pb-14 md:pb-0">
          {renderMain()}
        </main>

        {/* Inspector — hidden on mobile unless toggled */}
        <div className={`${inspectorOpen ? 'flex' : 'hidden'} md:flex`}>
          <Inspector open={inspectorOpen} onClose={() => setInspectorOpen(false)} liveData={liveData} />
        </div>
      </div>

      {/* ── Intelligence bar — hidden on mobile (saves space) ── */}
      <div className="hidden md:block">
        <IntelligenceBar liveData={liveData} />
      </div>

      {/* ── Mobile bottom nav (rendered inside Sidebar component) ── */}
    </div>
  )
}
