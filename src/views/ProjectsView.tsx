import { ExternalLink, Github } from 'lucide-react'

// Define project interface
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

// Projects data
class="text-xs text-[#888]">
    const projects: Project[] = [
      {
        name: 'Sovereign HQ Operator UI',
        emoji: '⚡',
        status: 'LIVE',
        description: 'VS Code-style multi-agent control plane',
        url: 'https://operator.sovereign-hq.com',
        repo: 'https://github.com/SneakyJuice/operator-ui',
        stack: ['React', 'TypeScript', 'Tailwind', 'Vercel'],
        updated: 'May 21, 2026'
      },
      {
        name: 'GlowRoute',
        emoji: '📈',
        status: 'LIVE',
        description: 'AI-powered local SEO visibility platform for medical spas',
        url: 'https://glowroute.io',
        repo: 'https://github.com/SneakyJuice/glowroute',
        stack: ['Next.js', 'Supabase', 'Vercel'],
        updated: 'May 2026'
      },
      {
        name: 'Sovereign HQ Platform',
        emoji: '🏢',
        status: 'LIVE',
        description: 'Business holding company site & AI enablement agency',
        url: 'https://sovereign-hq.com',
        stack: ['Next.js', 'Vercel'],
        updated: 'Apr 2026'
      },
      {
        name: 'sealey.ai',
        emoji: '👤',
        status: 'LIVE',
        description: 'Anthony Sealey personal brand & portfolio',
        url: 'https://sealey.ai',
        stack: ['Next.js', 'Vercel'],
        updated: 'Feb 2026'
      },
      {
        name: 'Healthcare Navigation AI',
        emoji: '⚕️',
        status: 'IN PROGRESS',
        description: 'AI concierge for healthcare navigation & benefits optimization',
        repo: undefined,
        stack: ['TBD'],
        updated: '2026'
      },
      {
        name: 'Keeper',
        emoji: '🔐',
        status: 'PLANNED',
        description: 'Personal AI Infrastructure — Your AI Life Operating System',
        url: undefined,
        repo: undefined,
        stack: ['TBD'],
        updated: 'Roadmap 2026'
      }
    ]
    
    // Status badge color map
    const statusColors = {
      LIVE: 'bg-emerald-900/40 text-emerald-400',
      'IN PROGRESS': 'bg-yellow-900/40 text-yellow-400',
      PLANNED: 'bg-[#222] text-[#666]'
    }
  
    return (
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Projects
            <span className="text-sm bg-[#1a1a1a] text-[#666] px-2.5 py-1 rounded-full">{projects.length}</span>
          </h1>
          <button className="text-xs px-3 py-1.5 bg-[#1a1a1a] text-[#888] border border-[#222] rounded hover:bg-[#222] hover:text-[#ccc] transition-colors">
            Add Project
          </button>
        </div>
  
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <div 
              key={i}
              className="bg-[#161616] border border-[#222] rounded-lg p-5 hover:bg-[#1a1a1a] hover:border-[#333] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-label={project.name}>{project.emoji}</span>
                  <h3 className="font-semibold text-white">{project.name}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-mono ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
  
              <p className="text-sm text-[#888] mb-4">{project.description}</p>
  
              <div className="flex flex-wrap gap-3 mb-4">
                {project.stack.map((tech, j) => (
                  <span 
                    key={j}
                    className="text-[10px] px-2 py-0.5 bg-[#0d0d0d] text-[#555] border border-[#1a1a1a] rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
  
              <div className="flex items-center gap-2">
                {/* Deliverable link */}
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ECAB23]/10 text-[#ECAB23] border border-[#ECAB23]/20 text-xs hover:bg-[#ECAB23]/20 transition-colors"
                  >
                    <ExternalLink size={11} /> Live Site
                  </a>
                )}
                
                {/* Repo link */}
                {project.repo && (
                  <a 
                    href={project.repo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161616] text-[#888] border border-[#222] text-xs hover:bg-[#1e1e1e] hover:text-[#ccc]"
                  >
                    <Github size={11} /> Repo
                  </a>
                )}
              </div>
  
              <div className="mt-4 text-[11px] text-[#444]">
                Updated: {project.updated}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }