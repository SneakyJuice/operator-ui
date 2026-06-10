import { useState } from 'react'
import { AGENTS, CHANNELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Send, Bot, Hash, Zap, Clock } from 'lucide-react'
import ChannelMirrorView from './ChannelMirrorView'

type Tab = { id: string; name: string; emoji: string; type: 'agent' | 'channel'; subtitle: string; chatId?: string }

const tabs: Tab[] = [
  ...AGENTS.map(a => ({ id: a.id, name: a.name, emoji: a.emoji, type: 'agent' as const, subtitle: a.role })),
  ...CHANNELS.map(c => ({ id: c.id, name: c.name, emoji: c.emoji, type: 'channel' as const, subtitle: c.desc, chatId: c.chatId })),
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  timestamp: string
  cost?: string
}

const demoMessages: Record<string, Message[]> = {
  zion: [
    { id: '1', role: 'assistant', content: 'Zion online. ⚡ Ready for instructions.', model: 'claude-sonnet-4-6', timestamp: '20:15', cost: '$0.001' },
  ],
  atlas: [
    { id: '1', role: 'assistant', content: 'Atlas standing by. Default executor ready.', model: 'qwen3-235b', timestamp: '20:14', cost: '$0.000' },
  ],
  ark: [
    { id: '1', role: 'assistant', content: 'Ark offline. Start gateway to connect.', timestamp: '—' },
  ],
  hq: [
    { id: '1', role: 'assistant', content: '👑 HQ channel — deliverables land here.', timestamp: '20:10' },
  ],
  buildroom: [
    { id: '1', role: 'assistant', content: '🏗️ Build Room — task lifecycle audit trail.', timestamp: '20:00' },
    { id: '2', role: 'assistant', content: '🆕 PROJECT INITIATED — Sovereign HQ Operator Platform\n\nP0 · P1 · P2 · P3 created in ClickUp.\nAwaiting GitHub green light from Anthony.', timestamp: '20:21' },
  ],
  botops: [
    { id: '1', role: 'assistant', content: '🤖 Bot Ops — system channel.', timestamp: '19:50' },
  ],
  glowroute: [
    { id: '1', role: 'assistant', content: '✨ GlowRoute Ops — sprint tracking.', timestamp: '19:00' },
  ],
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function AgentsView() {
  const [activeTab, setActiveTab] = useState<string>('zion')
  const [messages, setMessages] = useState<Record<string, Message[]>>(demoMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const current = tabs.find(t => t.id === activeTab)!
  const currentMessages = messages[activeTab] || []

  const handleSend = async () => {
    if (!input.trim() || sending) return
    const text = input.trim()
    const tabAtSend = activeTab
    const msg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: nowTime(),
    }
    setMessages(prev => ({ ...prev, [tabAtSend]: [...(prev[tabAtSend] || []), msg] }))
    setInput('')

    // Live wire — only Zion responds for now
    if (tabAtSend !== 'zion') {
      setMessages(prev => ({
        ...prev,
        [tabAtSend]: [...(prev[tabAtSend] || []), {
          id: Date.now().toString() + '-r',
          role: 'assistant' as const,
          content: tabAtSend === 'atlas' || tabAtSend === 'ark'
            ? `${tabAtSend.charAt(0).toUpperCase() + tabAtSend.slice(1)} is on a private Tailscale network — not wired for live chat yet. Message Zion instead.`
            : 'Channels are read-only mirrors — send via Telegram.',
          timestamp: nowTime(),
        }],
      }))
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, agentId: 'zion' }),
      })
      const data = await res.json() as { reply?: string; model?: string; error?: string }
      const reply: Message = {
        id: Date.now().toString() + '-r',
        role: 'assistant',
        content: data.reply || `⚠️ ${data.error || 'No response from gateway'}`,
        model: data.model?.split('/').pop(),
        timestamp: nowTime(),
      }
      setMessages(prev => ({ ...prev, [tabAtSend]: [...(prev[tabAtSend] || []), reply] }))
    } catch (e) {
      setMessages(prev => ({
        ...prev,
        [tabAtSend]: [...(prev[tabAtSend] || []), {
          id: Date.now().toString() + '-e',
          role: 'assistant' as const,
          content: `⚠️ Connection failed: ${String(e).slice(0, 120)}`,
          timestamp: nowTime(),
        }],
      }))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#1e1e1e] bg-[#0f0f0f] overflow-x-auto shrink-0">
        <div className="flex items-center px-2 gap-0.5">
          <span className="text-[9px] text-[#444] uppercase tracking-wider px-2 shrink-0">Agents</span>
          {tabs.filter(t => t.type === 'agent').map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap transition-colors border-b-2',
                activeTab === tab.id
                  ? 'text-violet-400 border-violet-500 bg-[#1a1a2e]'
                  : 'text-[#666] border-transparent hover:text-[#aaa] hover:bg-[#161616]'
              )}
            >
              <span>{tab.emoji}</span>
              <span>{tab.name}</span>
            </button>
          ))}
          <div className="w-px h-4 bg-[#2a2a2a] mx-2" />
          <span className="text-[9px] text-[#444] uppercase tracking-wider px-2 shrink-0">Channels</span>
          {tabs.filter(t => t.type === 'channel').map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap transition-colors border-b-2',
                activeTab === tab.id
                  ? 'text-violet-400 border-violet-500 bg-[#1a1a2e]'
                  : 'text-[#666] border-transparent hover:text-[#aaa] hover:bg-[#161616]'
              )}
            >
              <Hash size={11} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Channel mirror — renders full view and returns early */}
      {current.type === 'channel' && current.chatId && (
        <ChannelMirrorView
          chatId={current.chatId}
          channelName={current.name}
          channelEmoji={current.emoji}
          pollIntervalMs={10000}
        />
      )}
      {current.type === 'channel' && !current.chatId && (
        <div className="flex-1 flex items-center justify-center text-[#444] text-sm">No chatId configured for {current.name}</div>
      )}
      {current.type === 'channel' ? null : (
      <>
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1a1a1a] bg-[#0f0f0f] shrink-0">
        <span className="text-xl">{current.emoji}</span>
        <div>
          <div className="text-sm font-semibold text-[#e8e8e8]">{current.name}</div>
          <div className="text-[10px] text-[#555]">{current.subtitle}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {current.type === 'agent' && (
            <div className={cn(
              'text-[9px] px-2 py-0.5 rounded-full font-mono',
              current.id === 'zion' ? 'bg-emerald-900/40 text-emerald-400' :
              current.id === 'atlas' ? 'bg-yellow-900/40 text-yellow-400' :
              'bg-[#222] text-[#555]'
            )}>
              {current.id === 'zion' ? '● ONLINE' : current.id === 'atlas' ? '● IDLE' : '○ OFFLINE'}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {currentMessages.map(msg => (
          <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[80%] rounded-xl px-4 py-3',
              msg.role === 'user'
                ? 'bg-violet-900/50 text-[#e8e8e8] border border-violet-800/30'
                : 'bg-[#161616] text-[#d0d0d0] border border-[#222]'
            )}>
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] text-[#444]">{msg.timestamp}</span>
                {msg.model && <span className="text-[9px] text-[#444] font-mono">{msg.model}</span>}
                {msg.cost && <span className="text-[9px] text-[#444]">{msg.cost}</span>}
              </div>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-[#161616] text-[#888] border border-[#222] rounded-xl px-4 py-3 text-sm">
              <span className="animate-pulse">⚡ Zion is thinking…</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-[#1a1a1a] bg-[#0f0f0f] shrink-0">
        <div className="flex items-center gap-3 bg-[#161616] border border-[#252525] rounded-xl px-4 py-2.5 focus-within:border-violet-800/60 transition-colors">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={`Message ${current.name}...`}
            className="flex-1 bg-transparent text-sm text-[#e8e8e8] placeholder-[#444] outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="text-violet-500 hover:text-violet-400 disabled:text-[#333] transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1.5 px-1">
          <Zap size={9} className="text-[#444]" />
          <span className="text-[9px] text-[#444]">{current.id === 'zion' ? 'Live — wired to OpenClaw gateway · gemini-2.5-flash · Enter to send' : 'Demo mode — only Zion is wired for live chat'}</span>
        </div>
      </div>
      </>
      )}
    </div>
  )
}
