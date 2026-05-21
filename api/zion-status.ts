import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')

  async function checkHealth(url: string, timeoutMs = 3000): Promise<'online' | 'offline'> {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      const r = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)
      const d = await r.json() as { ok?: boolean }
      return d.ok ? 'online' : 'offline'
    } catch {
      return 'offline'
    }
  }

  const [zionStatus, atlasStatus, arkStatus] = await Promise.all([
    checkHealth('http://165.245.136.97:18789/health'),
    checkHealth('http://100.78.163.113:18789/health'),
    checkHealth('http://100.124.40.44:18790/health'),
  ])

  return res.status(200).json({
    zion:  { status: zionStatus,  ip: '165.245.136.97', role: 'Orchestrator' },
    atlas: { status: atlasStatus, ip: '100.78.163.113',  role: 'Primary Executor' },
    ark:   { status: arkStatus,   ip: '100.124.40.44',   role: 'Secondary Executor' },
    ts: new Date().toISOString(),
  })
}
