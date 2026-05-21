import { useState } from 'react'
import { cn } from '@/lib/utils'
import { BookOpen, Search, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react'

const skills = [
  { id: 'weather', name: 'Weather', desc: 'Current weather and forecasts via wttr.in or Open-Meteo.', status: 'active', trigger: 'weather, temperature, forecast', lastUsed: '2h ago', category: 'Data' },
  { id: 'clickup', name: 'ClickUp', desc: 'Enterprise ClickUp project management with advanced reporting.', status: 'active', trigger: 'clickup, task, project', lastUsed: '20 min ago', category: 'Productivity' },
  { id: 'google-workspace', name: 'Google Workspace', desc: 'Gmail, Calendar, Drive, Docs, Sheets via OAuth.', status: 'active', trigger: 'email, calendar, drive, sheets', lastUsed: '1h ago', category: 'Productivity' },
  { id: 'mcporter', name: 'MCPorter', desc: 'Call MCP servers and tools directly.', status: 'active', trigger: 'mcp, mcporter', lastUsed: '3h ago', category: 'Dev' },
  { id: 'canvas-design', name: 'Canvas Design', desc: 'Create posters, art, and static designs as PNG/PDF.', status: 'active', trigger: 'design, poster, art', lastUsed: '1d ago', category: 'Design' },
  { id: 'frontend-design', name: 'Frontend Design', desc: 'Build production-grade web components and pages.', status: 'active', trigger: 'web, component, UI, page', lastUsed: '2d ago', category: 'Design' },
  { id: 'pdf', name: 'PDF Tools', desc: 'Read, merge, split, rotate, watermark PDFs.', status: 'active', trigger: '.pdf, PDF', lastUsed: '4d ago', category: 'Files' },
  { id: 'docx', name: 'Word/DOCX', desc: 'Create and edit .docx Word documents.', status: 'active', trigger: 'word, .docx, document', lastUsed: '5d ago', category: 'Files' },
  { id: 'xlsx', name: 'Excel/XLSX', desc: 'Create and edit Excel spreadsheets.', status: 'active', trigger: '.xlsx, spreadsheet, excel', lastUsed: '6d ago', category: 'Files' },
  { id: 'pptx', name: 'PowerPoint/PPTX', desc: 'Create and edit .pptx slide decks.', status: 'disabled', trigger: '.pptx, slides, presentation', lastUsed: 'Never', category: 'Files' },
  { id: 'mem0', name: 'Mem0', desc: 'Dynamic memory layer via Qdrant vector search.', status: 'active', trigger: 'remember, memory', lastUsed: '10 min ago', category: 'Memory' },
  { id: 'news-summary', name: 'News Summary', desc: 'Fetches news from RSS feeds, creates voice summaries.', status: 'active', trigger: 'news, briefing, headlines', lastUsed: '8h ago', category: 'Data' },
  { id: 'taskflow', name: 'TaskFlow', desc: 'Durable flow substrate for multi-step agent tasks.', status: 'active', trigger: 'flow, task, pipeline', lastUsed: '2d ago', category: 'Dev' },
  { id: 'clawhub', name: 'ClawHub', desc: 'Search, install, and publish skills from clawhub.com.', status: 'available', trigger: 'install skill, clawhub', lastUsed: 'Never', category: 'Dev' },
]

const categories = ['All', 'Productivity', 'Design', 'Files', 'Data', 'Memory', 'Dev']

export default function SkillsView() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(skills.map(s => [s.id, s.status === 'active']))
  )
  const [drawer, setDrawer] = useState<string | null>(null)

  const filtered = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || s.category === category
    return matchSearch && matchCat
  })

  const drawerSkill = drawer ? skills.find(s => s.id === drawer) : null

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-[#e8e8e8]">Skill Library</h2>
            <p className="text-sm text-[#555] mt-0.5">{skills.filter(s => s.status === 'active').length} active · {skills.length} installed</p>
          </div>
          <a href="https://clawhub.ai" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-violet-400 hover:text-violet-300 transition-colors">
            <ExternalLink size={12} /> Find more on ClawHub
          </a>
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-[#111] border border-[#222] rounded-lg px-3 py-2">
            <Search size={13} className="text-[#555]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder-[#444] outline-none"
            />
          </div>
          <div className="flex gap-1">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-2.5 py-1.5 text-[10px] rounded-lg transition-colors',
                  category === cat ? 'bg-violet-900/50 text-violet-400' : 'text-[#555] hover:text-[#999] hover:bg-[#161616]'
                )}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
            {filtered.map(skill => (
              <div key={skill.id}
                className={cn(
                  'flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all',
                  drawer === skill.id
                    ? 'bg-[#1a1a2e] border-violet-700/50'
                    : 'bg-[#111] border-[#1e1e1e] hover:border-[#2a2a2a] hover:bg-[#141414]'
                )}
                onClick={() => setDrawer(drawer === skill.id ? null : skill.id)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <BookOpen size={14} className="text-[#555] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#ccc]">{skill.name}</span>
                      <span className={cn(
                        'text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0',
                        skill.status === 'active' ? 'bg-emerald-900/40 text-emerald-400' :
                        skill.status === 'disabled' ? 'bg-[#222] text-[#555]' :
                        'bg-blue-900/40 text-blue-400'
                      )}>
                        {skill.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#555] mt-0.5 truncate">{skill.desc}</div>
                    <div className="text-[9px] text-[#444] mt-1">Last used: {skill.lastUsed}</div>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setEnabled(prev => ({ ...prev, [skill.id]: !prev[skill.id] })) }}
                  className="ml-3 shrink-0 text-[#555] hover:text-[#999] transition-colors"
                >
                  {enabled[skill.id]
                    ? <ToggleRight size={18} className="text-violet-500" />
                    : <ToggleLeft size={18} />
                  }
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerSkill && (
        <div className="w-[280px] border-l border-[#1e1e1e] bg-[#0f0f0f] p-5 shrink-0 overflow-y-auto">
          <div className="text-sm font-semibold text-[#e8e8e8] mb-1">{drawerSkill.name}</div>
          <span className={cn(
            'text-[9px] px-1.5 py-0.5 rounded font-mono',
            drawerSkill.status === 'active' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-[#222] text-[#555]'
          )}>{drawerSkill.status.toUpperCase()}</span>
          <div className="text-[11px] text-[#666] mt-3 leading-relaxed">{drawerSkill.desc}</div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-[9px] text-[#444] uppercase tracking-wider mb-1">Category</div>
              <div className="text-xs text-[#888]">{drawerSkill.category}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#444] uppercase tracking-wider mb-1">Triggers</div>
              <div className="text-xs text-[#888] font-mono">{drawerSkill.trigger}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#444] uppercase tracking-wider mb-1">Last Used</div>
              <div className="text-xs text-[#888]">{drawerSkill.lastUsed}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
