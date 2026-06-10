import type { VercelRequest, VercelResponse } from '@vercel/node'

// Telegram Bot API — read-only mirror of channel history
// Uses the Zion bot token to pull recent messages from a chat

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TG_API    = `https://api.telegram.org/bot${BOT_TOKEN}`

export interface TgMessage {
  id: number
  from: string
  fromId: number | null
  text: string
  date: number // unix timestamp
  isBot: boolean
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20')

  const chatId = req.query.chatId as string
  if (!chatId) return res.status(400).json({ error: 'chatId required' })
  if (!BOT_TOKEN) return res.status(503).json({ error: 'Bot token not configured', messages: [] })

  try {
    // getUpdates with negative offset to get recent messages from this chat
    // We use getChatHistory via forwardMessages workaround — but simplest is
    // to maintain a rolling buffer via updates. For MVP, pull last 50 updates
    // and filter by chatId.
    const url = `${TG_API}/getUpdates?limit=100&allowed_updates=["message","channel_post"]`
    const resp = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!resp.ok) return res.status(502).json({ error: 'Telegram API error', messages: [] })

    const data = await resp.json() as {
      ok: boolean
      result: Array<{
        update_id: number
        message?: {
          message_id: number
          from?: { id: number; first_name: string; last_name?: string; is_bot?: boolean; username?: string }
          chat: { id: number }
          text?: string
          date: number
        }
        channel_post?: {
          message_id: number
          chat: { id: number; title?: string }
          text?: string
          date: number
          sender_chat?: { id: number; title?: string }
        }
      }>
    }

    if (!data.ok) return res.status(502).json({ error: 'Telegram not ok', messages: [] })

    const targetId = parseInt(chatId, 10)
    const messages: TgMessage[] = []

    for (const update of data.result) {
      const msg = update.message || update.channel_post
      if (!msg) continue
      if (msg.chat.id !== targetId) continue
      if (!msg.text) continue

      const fromMsg = update.message?.from
      const senderChat = update.channel_post?.sender_chat

      messages.push({
        id: msg.message_id,
        from: fromMsg
          ? `${fromMsg.first_name}${fromMsg.last_name ? ' ' + fromMsg.last_name : ''}`
          : senderChat?.title || 'Channel',
        fromId: fromMsg?.id || null,
        text: msg.text,
        date: msg.date,
        isBot: fromMsg?.is_bot || false,
      })
    }

    // Sort ascending, newest last, cap at 50
    messages.sort((a, b) => a.date - b.date)
    const recent = messages.slice(-50)

    return res.status(200).json({ messages: recent, ts: Date.now() })
  } catch (e) {
    return res.status(500).json({ error: String(e), messages: [] })
  }
}
