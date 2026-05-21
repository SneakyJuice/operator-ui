import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { RefreshCw, ExternalLink, Clock, User, AlertCircle, CheckSquare } from 'lucide-react'

interface ClickUpTask {
  id: string
  name: string
  status: { status: string; color: string; type: string }
  priority: { priority: string; color: string } | null
  assignees: Array<{ username: string; profilePicture?: string }>
  date_updated: string
  url: string
  description?: string
  tags: Array<{ name: string; tag_fg: string; tag_bg: string }>
}

function priorityBadge(priority: string) {
  const map: Record<string, string> = {
    urgent: 'bg-red-900/40 text-red-400',
    high:   'bg-orange-900/40 text-orange-400',
    normal: 'bg-[#ECAB23]/10 text-[#ECAB23]',
    low:    'bg-[#0a2535] text-[#4a7a94]',
  }
  return (
    <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-mono uppercase', map[priority] || 'bg-[#0a2535] text-[#4a7a94]')}>
      {priority}
    </span>
  )
}

function statusBadge(status: string, color: string) {
  return (
    <span
      className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase"
      style={{ background: color + '20', color, border: `1px solid ${color}30` }}
    >
      {status}
    </span>
  )
}

function timeAgo(ms: string) {
  const diff = Date.now() - parseInt(ms)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const MOCK_TASKS: ClickUpTask[] = [
  {
    id: '1', name: 'P1 — Live gateway WebSocket, real agent data',
    status: { status: 'in progress', color: '#f59e0b', type: 'custom' },
    priority: { priority: 'high', color: '#f97316' },
    assignees: [{ username: 'zion' }],
    date_updated: (Date.now() - 3600000).toString(),
    url: 'https://app.clickup.com/9017933951',
    tags: [{ name: 'operator-ui', tag_fg: '#ECAB23', tag_bg: '#0E3846' }],
  },
  {
    id: '2', name: 'P2 — Mobile responsive + Sun Life brand theme',
    status: { status: 'in progress', color: '#f59e0b', type: 'custom' },
    priority: { priority: 'high', color: '#f97316' },
    assignees: [{ username: 'zion' }],
    date_updated: Date.now().toString(),
    url: 'https://app.clickup.com/9017933951',
    tags: [{ name: 'operator-ui', tag_fg: '#ECAB23', tag_bg: '#0E3846' }],
  },
  {
    id: '3', name: 'P3 — Projects view + ClickUp integration panel',
    status: { status: 'complete', color: '#10b981', type: 'custom' },
    priority: { priority: 'normal', color: '#3b82f6' },
    assignees: [{ username: 'zion' }],
    date_updated: Date.now().toString(),
    url: 'https://app.clickup.com/9017933951',
    tags: [{ name: 'operator-ui', tag_fg: '#ECAB23', tag_bg: '#0E3846' }],
  },
  {
    id: '4', name: 'Supabase clinic_providers table — staff schema + scraper',
    status: { status: 'to do', color: '#4a7a94', type: 'custom' },
    priority: { priority: 'normal', color: '#3b82f6' },
    assignees: [{ username: 'zion' }],
    date_updated: (Date.now() - 86400000).toString(),
    url: 'https://app.clickup.com/9017933951',
    tags: [{ name: 'glowroute', tag_fg: '#10b981', tag_bg: '#0a2535' }],
  },
  {
    id: '5', name: 'Vercel git fix — add anthonysealey@gmail.com as verified email',
    status: { status: 'to do', color: '#4a7a94', type: 'custom' },
    priority: { priority: 'low', color: '#6b7280' },
    assignees: [{ username: 'zion' }],
    date_updated: (Date.now() - 172800000).toString(),
    url: 'https://app.clickup.com/9017933951',
    tags: [{ name: 'infra', tag_fg: '#8aacbc', tag_bg: '#0a2535' }],
  },
]

export default function BuildTasksView() {
  const [tasks, setTasks] = useState<ClickUpTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/clickup?endpoint=tasks')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data.tasks) {
        setTasks(data.tasks)
        setLastFetch(new Date())
      } else {
        throw new Error('No tasks in response')
      }
    } catch {
      setError('Live API unavailable — showing cached tasks')
      setTasks(MOCK_TASKS)
      setLastFetch(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const activeTasks = tasks.filter(t => t.status.status !== 'complete' && t.status.status !== 'closed')
  const doneTasks   = tasks.filter(t => t.status.status === 'complete' || t.status.status === 'closed')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a4a62] bg-[#081c28] shrink-0">
        <div className="flex items-center gap-3">
          <CheckSquare size={16} className="text-[#ECAB23]" />
          <div>
            <h2 className="text-sm font-semibold text-[#f0f0f0]">Build Tasks</h2>
            <p className="text-[10px] text-[#4a7a94] mt-0.5">Gateway Ops · ClickUp</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastFetch && (
            <span className="text-[10px] text-[#4a7a94] hidden sm:block">
              {lastFetch.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          )}
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ECAB23]/10 text-[#ECAB23] border border-[#ECAB23]/20 text-xs hover:bg-[#ECAB23]/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-5 py-2 bg-[#ECAB23]/5 border-b border-[#ECAB23]/20 text-[#ECAB23] text-xs">
          <AlertCircle size={11} />
          {error}
        </div>
      )}

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {loading && tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw size={16} className="animate-spin text-[#4a7a94]" />
          </div>
        ) : (
          <>
            {/* Active tasks */}
            {activeTasks.length > 0 && (
              <div>
                <div className="px-5 py-2 bg-[#0a1e2a] border-b border-[#1a4a62] sticky top-0">
                  <span className="text-[10px] font-semibold text-[#4a7a94] uppercase tracking-wider">
                    Active · {activeTasks.length}
                  </span>
                </div>
                <div className="divide-y divide-[#0f3248]">
                  {activeTasks.map(task => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* Done tasks */}
            {doneTasks.length > 0 && (
              <div>
                <div className="px-5 py-2 bg-[#0a1e2a] border-b border-[#1a4a62] sticky top-0">
                  <span className="text-[10px] font-semibold text-[#4a7a94] uppercase tracking-wider">
                    Completed · {doneTasks.length}
                  </span>
                </div>
                <div className="divide-y divide-[#0f3248] opacity-60">
                  {doneTasks.map(task => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-[#4a7a94]">
                <span className="text-2xl mb-2">✅</span>
                <span className="text-sm">No active tasks</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-[#1a4a62] bg-[#071820] shrink-0">
        <div className="flex items-center justify-between text-[10px] text-[#4a7a94]">
          <span>{activeTasks.length} active · {doneTasks.length} done</span>
          <a
            href="https://app.clickup.com/9017933951"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ECAB23] transition-colors flex items-center gap-1"
          >
            Open ClickUp <ExternalLink size={9} />
          </a>
        </div>
      </div>
    </div>
  )
}

function TaskRow({ task }: { task: ClickUpTask }) {
  return (
    <div className="px-5 py-4 hover:bg-[#0a2535] transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {statusBadge(task.status.status, task.status.color)}
            {task.priority && priorityBadge(task.priority.priority)}
            {task.tags?.map(tag => (
              <span
                key={tag.name}
                className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: tag.tag_bg, color: tag.tag_fg, opacity: 0.8 }}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="text-sm text-[#f0f0f0] leading-snug mb-1.5">{task.name}</div>
          <div className="flex items-center gap-3 text-[10px] text-[#4a7a94]">
            <div className="flex items-center gap-1">
              <Clock size={9} />
              {timeAgo(task.date_updated)}
            </div>
            {task.assignees?.length > 0 && (
              <div className="flex items-center gap-1">
                <User size={9} />
                {task.assignees.map(a => a.username).join(', ')}
              </div>
            )}
          </div>
        </div>
        <a
          href={task.url}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#4a7a94] hover:text-[#ECAB23] shrink-0 mt-1"
          title="Open in ClickUp"
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}
