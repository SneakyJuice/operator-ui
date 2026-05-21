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
import { PanelRight } from 'lucide-react'

export default function App() {
  const [section, setSection] = useState<NavSection>('agents')
  const [inspectorOpen, setInspectorOpen] = useState(true)

  const renderMain = () => {
    switch (section) {
      case 'agents':       return <AgentsView />
      case 'projects':     return <ProjectsView />
      case 'channels':     return <AgentsView />   // channels tab pre-selected
      case 'models':       return <ModelsView />
      case 'skills':       return <SkillsView />
      case 'integrations': return <IntegrationsView />
      case 'design':       return <DesignView />
      case 'logs':         return <PlaceholderView title="Activity Logs" desc="Real-time API call log, agent action history, and cost attribution." icon="📋" />
      case 'settings':     return <PlaceholderView title="Settings" desc="Gateway config, auth, notifications, and workspace preferences." icon="⚙️" />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a1e2a]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 h-10 bg-[#071820] border-b border-[#1a4a62] shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-[#555]">operator.sovereign-hq.com</span>
        </div>
        <div className="text-[10px] text-[#333] font-mono">SOVEREIGN HQ OPERATOR</div>
        <button
          onClick={() => setInspectorOpen(v => !v)}
          className="text-[#444] hover:text-[#888] transition-colors"
          title="Toggle Inspector"
        >
          <PanelRight size={15} />
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        <Sidebar active={section} onChange={setSection} />
        <main className="flex-1 min-w-0 overflow-hidden bg-[#0a1e2a]">
          {renderMain()}
        </main>
        <Inspector open={inspectorOpen} onClose={() => setInspectorOpen(false)} />
      </div>

      <IntelligenceBar />
    </div>
  )
}
