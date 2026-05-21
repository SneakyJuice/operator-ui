import { ExternalLink, GitBranch, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'

type Project = {
  name: string
  emoji: string
  status: 'LIVE' | 'IN PROGRESS' | 'PLANNED'
  description: string
  url?: string
  repo?: string
  stack: string[]
  updated: string
}

const projects: Project[] = [
  {
    name: 'Sovereign HQ Operator UI',
    emoji: '⚡',
    status: 'LIVE',
    description: 'VS Code-style multi-agent control plane for the Sovereign HQ network.',
    url: 'https://operator.sovereign-hq.com',
    repo: 'https://github.com/SneakyJuice/operator-ui',
    stack: ['React', 'TypeScript', 'Tailwind', 'Vercel'],
    updated: 'May 21, 2026',
  },
  {
    name: 'GlowRoute',
    emoji: '📈',
    status: 'LIVE',
    description: 'AI-powered local SEO visibility platform for medical spas.',
    url: 'https://glowroute.io',
    repo: 'https://github.com/SneakyJuice/glowroute',
    stack: ['Next.js', 'Supabase', 'Vercel'],
    updated: 'May 2026',
  },
  {
    name: 'Sovereign HQ Platform',
    emoji: '🏢',
    status: 'LIVE',
    description: 'Business holding company site & AI enablement agency.',
    url: 'https://sovereign-hq.com',
    stack: ['Next.js', 'Vercel'],
    updated: 'Apr 2026',
  },
  {
    name: 'sealey.ai',
    emoji: '👤',
    status: 'LIVE',
    description: "Anthony Sealey personal brand & portfolio.",
    url: 'https://sealey.ai',
    stack: ['Next.js', 'Vercel'],
    updated: 'Feb 2026',
  },
  {
    name: 'Healthcare Navigation AI',
    emoji: '⚕️',
    status: 'IN PROGRESS',
    description: 'AI concierge for healthcare navigation & benefits optimization.',
    stack: ['TBD'],
    updated: '2026',
  },
  {
    name: 'Keeper',
    emoji: '🔐',
    status: 'PLANNED',
    description: 'Personal AI Infrastructure — Your AI Life Operating System.',
    stack: ['TBD'],
    updated: 'Roadmap 2026',
  },
]

const statusStyles = {
  LIVE:          'bg-emerald-900/40 text-emerald-400 border border-emerald-900/60',
  'IN PROGRESS': 'bg-yellow-900/40 text-yellow-400 border border-yellow-900/60',
  PLANNED:       'bg-[#0a2535] text-[#4a7a94] border border-[#1a4a62]',
}

export default function ProjectsView() {
  const liveCount = projects.filter(p => p.status === 'LIVE').length

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FolderKanban size={18} className="text-[#ECAB23]" />
            <div>
              <h1 className="text-base font-semibold text-[#f0f0f0]">Projects</h1>
              <p className="text-[10px] text-[#4a7a94] mt-0.5">{liveCount} live · {projects.length} total</p>
            </div>
          </div>
          <button className="text-xs px-3 py-1.5 bg-[#0a2535] text-[#8aacbc] border border-[#1a4a62] rounded-lg hover:bg-[#123347] hover:text-[#f0f0f0] transition-colors">
            + Add Project
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <div
              key={i}
              className="bg-[#0E3846] border border-[#1a4a62] rounded-xl p-5 hover:border-[#ECAB23]/30 hover:bg-[#123347] transition-all group"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl leading-none">{project.emoji}</span>
                  <h3 className="text-sm font-semibold text-[#f0f0f0] leading-snug">{project.name}</h3>
                </div>
                <span className={cn('text-[9px] px-2 py-0.5 rounded font-mono uppercase shrink-0 ml-2', statusStyles[project.status])}>
                  {project.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#8aacbc] mb-4 leading-relaxed">{project.description}</p>

              {/* Stack tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.stack.map((tech, j) => (
                  <span key={j} className="text-[9px] px-2 py-0.5 bg-[#0a2535] text-[#4a7a94] border border-[#1a4a62] rounded font-mono">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action links */}
              <div className="flex items-center gap-2">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ECAB23]/10 text-[#ECAB23] border border-[#ECAB23]/20 text-xs hover:bg-[#ECAB23]/20 transition-colors font-medium"
                  >
                    <ExternalLink size={11} /> Live Site
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a2535] text-[#2a4a5a] border border-[#1a4a62] text-xs cursor-default">
                    <ExternalLink size={11} /> Coming Soon
                  </span>
                )}

                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a2535] text-[#8aacbc] border border-[#1a4a62] text-xs hover:bg-[#123347] hover:text-[#f0f0f0] transition-colors"
                  >
                    <GitBranch size={11} /> Repo
                  </a>
                ) : null}
              </div>

              {/* Updated */}
              <div className="mt-3 text-[10px] text-[#2a4a5a]">
                Updated: {project.updated}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
