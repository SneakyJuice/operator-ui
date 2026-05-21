import { useState, useEffect, useCallback } from 'react'

export type AgentLiveStatus = 'online' | 'offline' | 'degraded' | 'loading'

export interface AgentInfo {
  status: AgentLiveStatus
  ip: string
  role: string
}

export interface CostData {
  daily: { spent: number; limit: number }
  monthly: { spent: number; limit: number }
  lastUpdated: string | null
  note: string
}

export interface LiveData {
  agents: { zion: AgentInfo; atlas: AgentInfo; ark: AgentInfo }
  cost: CostData
  lastFetch: Date | null
  loading: boolean
  error: string | null
}

const DEFAULT: LiveData = {
  agents: {
    zion:  { status: 'loading', ip: '165.245.136.97', role: 'Orchestrator' },
    atlas: { status: 'loading', ip: '100.78.163.113',  role: 'Primary Executor' },
    ark:   { status: 'loading', ip: '100.124.40.44',   role: 'Secondary Executor' },
  },
  cost: {
    daily:   { spent: 0, limit: 10 },
    monthly: { spent: 0, limit: 300 },
    lastUpdated: null,
    note: 'loading',
  },
  lastFetch: null,
  loading: true,
  error: null,
}

export function useLiveData(pollIntervalMs = 30000): LiveData {
  const [data, setData] = useState<LiveData>(DEFAULT)

  const fetchAll = useCallback(async () => {
    try {
      const [statusRes, costRes] = await Promise.allSettled([
        fetch('/api/zion-status'),
        fetch('/api/cost-status'),
      ])

      if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
        const d = await statusRes.value.json()
        setData(prev => ({ ...prev, agents: d, lastFetch: new Date(), loading: false, error: null }))
      }

      if (costRes.status === 'fulfilled' && costRes.value.ok) {
        const d = await costRes.value.json()
        setData(prev => ({ ...prev, cost: d, lastFetch: new Date(), loading: false, error: null }))
      }
    } catch {
      setData(prev => ({ ...prev, loading: false, error: 'Live data unavailable' }))
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, pollIntervalMs)
    return () => clearInterval(interval)
  }, [fetchAll, pollIntervalMs])

  return data
}
