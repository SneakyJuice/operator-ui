import { useState, useEffect, useRef, useCallback } from 'react'
import { RefreshCw, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MirrorMessage {
  id: number
  from: string
  fromId: number | null
  text: string
  date: number
  isBot: boolean
}

interface Props {
  chatId: string
  channelName: string
  channelEmoji: string
  pollIntervalMs?: number
}

function formatTime(unixSec: number) {
  return new Date(unixSec * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/New_York',
  })
}

function formatDate(unixSec: number) {
  const d = new Date(unixSec * 1000)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Group messages by date
function groupByDate(messages: MirrorMessage[]) {
  const groups: { date: string; messages: MirrorMessage[] }[] = []
  for (const msg of messages) {
    const label = formatDate(msg.date)
    const last = groups[groups.length - 1]
    if (last && last.date === label) {
      last.messages.push(msg)
    } else {
      groups.push({ date: label, messages: [msg] })
    }
  }
  return groups
}

// Detect bot senders
const BOT_NAMES = ['Zion', 'Atlas', 'Ark', 'Zion_Sealey_Bot', 'Atlas_Sealey_Bot', 'Ark_Sealey_Bot']
function isBotSender(from: string, isBot: boolean) {
  return isBot || BOT_NAMES.some(b => from.toLowerCase().includes(b.toLowerCase()))
}

export default function ChannelMirrorView({ chatId, channelName, channelEmoji, pollIntervalMs = 10000 }: Props) {
  const [messages, setMessages] = useState<MirrorMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [live, setLive] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const seenIds = useRef<Set<number>>(new Set())

  const fetchMessages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch(`/api/telegram-mirror?chatId=${encodeURIComponent(chatId)}`)
      const data = await res.json() as { messages: MirrorMessage[]; error?: string }
      if (data.error && data.error !== 'Bot token not configured') {
        setError(data.error)
      } else if (data.error === 'Bot token not configured') {
        setError('TELEGRAM_BOT_TOKEN not set on Vercel — add it in project env vars')
      } else {
        // Merge: only add new messages (by id)
        setMessages(prev => {
          const merged = [...prev]
          let added = false
          for (const m of data.messages) {
            if (!seenIds.current.has(m.id)) {
              seenIds.current.add(m.id)
              merged.push(m)
              added = true
            }
          }
          if (added) merged.sort((a, b) => a.date - b.date)
          return added ? merged.slice(-100) : prev
        })
        setError(null)
        setLive(true)
        setLastFetch(new Date())
      }
    } catch (e) {
      setError('Fetch failed: ' + String(e))
    } finally {
      setLoading(false)
    }
  }, [chatId])

  // Initial load
  useEffect(() => {
    seenIds.current = new Set()
    setMessages([])
    setLive(false)
    fetchMessages(false)
  }, [chatId, fetchMessages])

  // Poll
  useEffect(() => {
    const t = setInterval(() => fetchMessages(true), pollIntervalMs)
    return () => clearInterval(t)
  }, [fetchMessages, pollIntervalMs])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const groups = groupByDate(messages)

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1a1a2a] bg-[#0d0d18] shrink-0">
        <span className="text-xl">{channelEmoji}</span>
        <div>
          <div className="text-sm font-semibold text-[#e8e8e8]">{channelName}</div>
          <div className="text-[10px] text-[#555]">Live mirror · read-only · EST</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {live && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 font-mono">LIVE</span>
            </div>
          )}
          {lastFetch && (
            <span className="text-[9px] text-[#444] font-mono">
              {lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} EST
            </span>
          )}
          <button
            onClick={() => fetchMessages(false)}
            className="text-[#444] hover:text-[#aaa] transition-colors"
            title="Refresh"
          >
            <RefreshCw size={13} className={cn(loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
        {loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-32 gap-2 text-[#444] text-sm">
            <Radio size={14} className="animate-pulse" />
            <span>Connecting to {channelName}…</span>
          </div>
        )}

        {error && (
          <div className="mx-auto mt-8 max-w-sm rounded-lg bg-red-950/30 border border-red-900/40 px-4 py-3 text-xs text-red-400">
            <div className="font-semibold mb-1">Mirror Error</div>
            <div className="opacity-80">{error}</div>
            <div className="mt-2 opacity-60">Check that TELEGRAM_BOT_TOKEN is set in Vercel env vars.</div>
          </div>
        )}

        {!error && !loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-[#444] text-sm">
            <Radio size={18} />
            <span>No recent messages in {channelName}</span>
            <span className="text-[10px] text-[#333]">Messages will appear here as they arrive</span>
          </div>
        )}

        {groups.map(group => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#1a1a2a]" />
              <span className="text-[9px] text-[#444] uppercase tracking-wider px-2">{group.date}</span>
              <div className="flex-1 h-px bg-[#1a1a2a]" />
            </div>

            {group.messages.map((msg, i) => {
              const isBot = isBotSender(msg.from, msg.isBot)
              const prevMsg = group.messages[i - 1]
              const showSender = !prevMsg || prevMsg.from !== msg.from || msg.date - prevMsg.date > 120

              return (
                <div key={msg.id} className={cn('flex gap-2.5', showSender ? 'mt-3' : 'mt-0.5')}>
                  {/* Avatar */}
                  <div className="shrink-0 w-7 mt-0.5">
                    {showSender && (
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold',
                        isBot
                          ? 'bg-violet-900/60 text-violet-300 border border-violet-800/40'
                          : 'bg-[#1a2a3a] text-[#6a9ab0] border border-[#1e3a4a]'
                      )}>
                        {msg.from.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className="flex-1 min-w-0">
                    {showSender && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={cn(
                          'text-[11px] font-semibold',
                          isBot ? 'text-violet-400' : 'text-[#7ab0c8]'
                        )}>
                          {msg.from}
                          {isBot && <span className="ml-1 text-[9px] text-violet-600/70 font-normal">BOT</span>}
                        </span>
                        <span className="text-[9px] text-[#444]">{formatTime(msg.date)}</span>
                      </div>
                    )}
                    <div className="text-[13px] text-[#c8c8c8] leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Footer: read-only indicator */}
      <div className="px-5 py-2.5 border-t border-[#1a1a2a] bg-[#0d0d18] shrink-0">
        <div className="flex items-center gap-2 rounded-lg bg-[#111120] border border-[#1e1e2e] px-3 py-2">
          <Radio size={11} className="text-[#444]" />
          <span className="text-[11px] text-[#444]">Read-only mirror · Polls every {pollIntervalMs / 1000}s · To send messages use Telegram directly</span>
        </div>
      </div>
    </div>
  )
}
