import type { VercelRequest, VercelResponse } from '@vercel/node'

// Proxy to Zion's OpenClaw gateway — OpenAI-compatible chat completions.
// Gateway password stays server-side (Vercel env), never exposed to browser.

const GATEWAY_URL = process.env.ZION_GATEWAY_URL || 'http://165.245.136.97:18789'
const GATEWAY_PASSWORD = process.env.OPENCLAW_GATEWAY_PASSWORD || ''

// Cheap model for demo chat — keeps cost near zero
const DEMO_MODEL = 'openrouter/google/gemini-2.5-flash'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  if (!GATEWAY_PASSWORD) return res.status(503).json({ error: 'OPENCLAW_GATEWAY_PASSWORD not configured on Vercel' })

  const { message, agentId } = req.body as { message?: string; agentId?: string }
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'message required' })
  if (message.length > 2000) return res.status(400).json({ error: 'message too long (2000 char max)' })

  // Only Zion is wired (Atlas/Ark are separate gateways on Tailscale — not publicly reachable)
  if (agentId && agentId !== 'zion') {
    return res.status(400).json({ error: `${agentId} not wired — only Zion accepts live messages for now` })
  }

  try {
    const resp = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_PASSWORD}`,
        // Dedicated demo session — isolated from Zion's main sessions
        'x-openclaw-session-key': 'operator-ui-demo',
        // Cheap model override for demo traffic
        'x-openclaw-model': DEMO_MODEL,
      },
      body: JSON.stringify({
        model: 'openclaw',
        messages: [{ role: 'user', content: message }],
        stream: false,
      }),
      signal: AbortSignal.timeout(60000),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return res.status(502).json({ error: `Gateway ${resp.status}: ${text.slice(0, 200)}` })
    }

    const data = await resp.json() as {
      choices?: Array<{ message?: { content?: string } }>
      model?: string
      usage?: { total_tokens?: number }
    }

    const reply = data.choices?.[0]?.message?.content || '(no response)'
    return res.status(200).json({
      reply,
      model: data.model || DEMO_MODEL,
      tokens: data.usage?.total_tokens || null,
    })
  } catch (e) {
    const msg = String(e)
    if (msg.includes('timeout') || msg.includes('abort')) {
      return res.status(504).json({ error: 'Gateway timed out (60s) — agent may be busy' })
    }
    return res.status(500).json({ error: msg.slice(0, 200) })
  }
}
