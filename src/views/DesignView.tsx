import { cn } from '@/lib/utils';
import { Palette, ExternalLink, Link, X } from 'lucide-react';
import { useState } from 'react';

const tools = [
  {
    id: 'claude-design',
    emoji: '✦',
    name: 'Claude Design',
    subtitle: 'by Anthropic Labs',
    desc: 'AI-powered wireframes, interactive prototypes, slide decks, and marketing collateral. Powered by Claude Opus 4.7. The most capable AI design tool available.',
    features: ['Wireframes & mockups', 'Interactive prototypes', 'Slide decks (export PPTX)', 'Brand kit integration', 'Frontier code-powered prototypes'],
    cta: 'Open Claude Design',
    url: 'https://claude.ai/design',
    color: '#a855f7',
    badge: 'RECOMMENDED',
  },
  {
    id: 'miro',
    emoji: '🟡',
    name: 'Miro',
    subtitle: 'Collaborative Whiteboard',
    desc: 'Real-time collaborative whiteboard for sprint planning, architecture diagrams, and system design. Paste your board URL to embed it directly.',
    features: ['Sprint planning', 'Architecture diagrams', 'Real-time collaboration', 'Sticky notes & flows', 'Export PNG/PDF'],
    color: '#ECAB23',
    badge: 'EMBEDDED',
  },
  {
    id: 'canva',
    emoji: '🎨',
    name: 'Canva',
    subtitle: 'Brand Design & Presentations',
    desc: 'Professional presentation design, social media assets, and marketing collateral with drag-and-drop simplicity and a massive template library.',
    features: ['Presentation templates', 'Social media assets', 'Brand kit support', 'Export PDF/PPTX', 'Team collaboration'],
    cta: 'Open Canva',
    url: 'https://canva.com',
    color: '#00c4cc',
    badge: 'LINK-OUT',
  },
]

const MIRO_STORAGE_KEY = 'operator_miro_board_url'

export default function DesignView() {
  const [miroUrl, setMiroUrl] = useState<string>(
    () => localStorage.getItem(MIRO_STORAGE_KEY) || ''
  )
  const [miroInput, setMiroInput] = useState('')
  // Auto-open if a URL was already saved
  const [miroOpen, setMiroOpen] = useState<boolean>(
    () => !!localStorage.getItem(MIRO_STORAGE_KEY)
  )
  const [editingMiro, setEditingMiro] = useState(false)

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Design Center</h2>
        <p className="text-sm text-[#555] mt-1">Create wireframes, prototypes, slides, and visual assets</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-4xl">
        {tools.map(tool => (
          <div key={tool.id}
            className="group p-5 bg-[#111] border border-[#1e1e1e] rounded-2xl hover:border-[#2a2a2a] hover:bg-[#141414] transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: tool.color + '15', border: `1px solid ${tool.color}30` }}
              >
                {tool.emoji}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-base font-semibold text-[#e8e8e8]">{tool.name}</span>
                  <span className="text-[9px] text-[#555]">{tool.subtitle}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-mono ml-auto"
                    style={{ backgroundColor: tool.color + '20', color: tool.color }}
                  >
                    {tool.badge}
                  </span>
                </div>

                <p className="text-xs text-[#666] leading-relaxed mb-3">{tool.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tool.features.map(f => (
                    <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] text-[#666] border border-[#222]">
                      {f}
                    </span>
                  ))}
                </div>

                {tool.id === 'miro' ? (
                  <div className="space-y-3">
                    {/* URL input */}
                    {/* URL input row — always visible when editing or no URL */}
                    {(editingMiro || !miroUrl) ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={miroInput}
                          onChange={e => setMiroInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && miroInput.trim()) {
                              const url = miroInput.trim()
                              setMiroUrl(url)
                              localStorage.setItem(MIRO_STORAGE_KEY, url)
                              setMiroInput('')
                              setEditingMiro(false)
                              setMiroOpen(true)
                            }
                          }}
                          placeholder="Paste board URL and press Enter…"
                          className="flex-1 px-3 py-1.5 bg-[#071820] border border-[#1a4a62] rounded-lg text-xs text-[#e8e8e8] placeholder-[#4a7a94] focus:outline-none focus:border-[#ECAB23]"
                          autoFocus
                        />
                        {miroInput.trim() && (
                          <button
                            onClick={() => {
                              const url = miroInput.trim()
                              setMiroUrl(url)
                              localStorage.setItem(MIRO_STORAGE_KEY, url)
                              setMiroInput('')
                              setEditingMiro(false)
                              setMiroOpen(true)
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{ backgroundColor: '#ECAB23', color: '#071820' }}
                          >
                            Open
                          </button>
                        )}
                        {miroUrl && (
                          <button onClick={() => setEditingMiro(false)} className="text-[#4a7a94] hover:text-[#8aacbc]">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      /* URL is set — show Open/Close + change link */
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMiroOpen(v => !v)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                          style={{ backgroundColor: '#ECAB2315', color: '#ECAB23', border: '1px solid #ECAB2330' }}
                        >
                          <Link size={12} />
                          {miroOpen ? 'Close Board' : 'Open Board'}
                        </button>
                        <button
                          onClick={() => { setMiroInput(miroUrl); setEditingMiro(true) }}
                          className="text-[10px] text-[#4a7a94] hover:text-[#8aacbc] underline"
                        >
                          change URL
                        </button>
                      </div>
                    )}

                    {/* Embedded board */}
                    {miroOpen && miroUrl && (
                      <div className="rounded-xl overflow-hidden border border-[#1a4a62] mt-3" style={{ height: '600px' }}>
                        <iframe
                          src={miroUrl}
                          className="w-full h-full"
                          title="Miro Board"
                          allow="fullscreen; clipboard-read; clipboard-write"
                        />
                      </div>
                    )}
                  </div>
                ) : tool.url ? (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{ backgroundColor: tool.color + '15', color: tool.color, border: `1px solid ${tool.color}30` }}
                  >
                    <ExternalLink size={12} />
                    {tool.cta}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-6 p-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl max-w-4xl">
        <div className="flex items-start gap-2">
          <Palette size={13} className="text-violet-500 mt-0.5 shrink-0" />
          <div className="text-[11px] text-[#555] leading-relaxed">
            <span className="text-violet-400 font-medium">Recommended workflow:</span> Start in Claude Design for AI-generated wireframes → map architecture in Miro for system diagrams and sprint planning → finalize in Canva for brand-polished presentations. Claude Design can hand off directly to Claude Code for implementation.
          </div>
        </div>
      </div>
    </div>
  )
}
