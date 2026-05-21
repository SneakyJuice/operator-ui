import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')

  const dailySpent   = parseFloat(process.env.DAILY_COST_SPENT   || '0') || 0
  const monthlySpent = parseFloat(process.env.MONTHLY_COST_SPENT || '0') || 0
  const lastUpdated  = process.env.COST_LAST_UPDATED || null

  return res.status(200).json({
    daily:   { spent: dailySpent,   limit: 10.00 },
    monthly: { spent: monthlySpent, limit: 300.00 },
    lastUpdated,
    note: dailySpent === 0 ? 'live_pending' : 'live',
  })
}
