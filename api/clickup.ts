import type { VercelRequest, VercelResponse } from '@vercel/node'

const CLICKUP_TOKEN = process.env.CLICKUP_API_TOKEN || 'pk_198065325_VF5VQJW7PTXRXMTF1F7FZMYQC5JIRBYJ'
const LIST_ID = '901711268618'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { endpoint } = req.query

  if (endpoint === 'tasks') {
    const url = `https://api.clickup.com/api/v2/list/${LIST_ID}/task?order_by=updated&reverse=true&subtasks=false&page=0`

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: CLICKUP_TOKEN,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const text = await response.text()
        return res.status(response.status).json({ error: `ClickUp API error: ${response.status}`, detail: text })
      }

      const data = await response.json()
      return res.status(200).json(data)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to reach ClickUp API', detail: String(err) })
    }
  }

  return res.status(400).json({ error: 'Unknown endpoint. Use ?endpoint=tasks' })
}
