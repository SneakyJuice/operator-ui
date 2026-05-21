export const GATEWAY_WS_URL = import.meta.env.VITE_GATEWAY_WS_URL || 'ws://165.245.136.97:18789'
export const GATEWAY_HTTP_URL = import.meta.env.VITE_GATEWAY_HTTP_URL || 'http://165.245.136.97:18789'

export const AGENTS = [
  { id: 'zion', name: 'Zion', emoji: '⚡', role: 'Orchestrator', ip: '100.89.96.32' },
  { id: 'atlas', name: 'Atlas', emoji: '🔵', role: 'Primary Executor', ip: '100.78.163.113' },
  { id: 'ark', name: 'Ark', emoji: '🟣', role: 'Secondary Executor', ip: '100.124.40.44' },
]

export const CHANNELS = [
  { id: 'hq', name: 'HQ', emoji: '👑', chatId: '-5103878099', desc: 'Executive — deliverables' },
  { id: 'buildroom', name: 'Build Room', emoji: '🏗️', chatId: '-1003772945765', desc: 'Agent ops lifecycle' },
  { id: 'botops', name: 'Bot Ops', emoji: '🤖', chatId: '-5175426005', desc: 'System channel' },
  { id: 'glowroute', name: 'GlowRoute Ops', emoji: '✨', chatId: '-1003968264060', desc: 'Sprint tracking' },
]

export const MODELS = [
  {
    id: 'claude-opus-4-7',
    name: 'Claude Opus 4.7',
    provider: 'Anthropic',
    tier: 'Premium',
    tierColor: '#a855f7',
    costIn: 5.00,
    costOut: 25.00,
    bestFor: 'Complex reasoning, design',
    speed: 'Slow',
    modelKey: 'anthropic/claude-opus-4-7',
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic / OR',
    tier: 'High',
    tierColor: '#3b82f6',
    costIn: 3.00,
    costOut: 15.00,
    bestFor: 'Orchestration, quality work',
    speed: 'Medium',
    modelKey: 'openrouter/anthropic/claude-sonnet-4-6',
  },
  {
    id: 'qwen3-235b',
    name: 'Qwen3-235b',
    provider: 'OpenRouter',
    tier: 'Mid',
    tierColor: '#10b981',
    costIn: 0.07,
    costOut: 0.10,
    bestFor: 'Agent execution, coding',
    speed: 'Fast',
    modelKey: 'openrouter/qwen/qwen3-235b-a22b-2507',
  },
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google / OR',
    tier: 'Fast',
    tierColor: '#f59e0b',
    costIn: 0.30,
    costOut: 2.50,
    bestFor: 'Bulk, summarization',
    speed: 'Fastest',
    modelKey: 'openrouter/google/gemini-2.5-flash',
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    tier: 'Micro',
    tierColor: '#6b7280',
    costIn: 1.00,
    costOut: 5.00,
    bestFor: 'Heartbeat, lightweight tasks',
    speed: 'Fast',
    modelKey: 'anthropic/claude-haiku-4-5',
  },
]

export const BUDGET = {
  dailyLimit: 10.00,
  monthlyLimit: 300.00,
  dailySpent: 4.20,   // TODO: pull live from gateway
  monthlySpent: 112.00,
}
