import { useEffect, useState } from 'react'

const TARGET_DATE = new Date('2026-06-18T09:00:00-05:00') // June 18, 9 AM EST

function getTimeLeft() {
  const now = new Date()
  const diff = TARGET_DATE.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Pad({ n }: { n: number }) {
  return String(n).padStart(2, '0')
}

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="coming-soon-root">
      {/* Ambient glow */}
      <div className="ambient-top" />
      <div className="ambient-bottom" />

      {/* Photo panel */}
      <div className="photo-panel">
        <img
          src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1400&q=85&auto=format&fit=crop"
          alt="Financial wellness"
          className="photo-img"
        />
        <div className="photo-overlay" />
      </div>

      {/* Content panel */}
      <div className="content-panel">
        {/* Badge */}
        <div className="badge">
          <span className="badge-dot" />
          EXCLUSIVE PREVIEW
        </div>

        {/* Headline */}
        <h1 className="headline">
          Intelligent<br />
          <span className="headline-accent">Workforce Operations</span><br />
          Reimagined.
        </h1>

        <p className="subhead">
          A next-generation platform for enterprise AI orchestration — built for teams who demand more from their technology.
        </p>

        {/* Countdown */}
        <div className="countdown-label">DEMO GOES LIVE IN</div>
        <div className="countdown">
          {[
            { val: timeLeft.days, unit: 'DAYS' },
            { val: timeLeft.hours, unit: 'HRS' },
            { val: timeLeft.minutes, unit: 'MIN' },
            { val: timeLeft.seconds, unit: 'SEC' },
          ].map(({ val, unit }, i) => (
            <div key={unit} className="countdown-block">
              <div className="countdown-num"><Pad n={val} /></div>
              <div className="countdown-unit">{unit}</div>
              {i < 3 && <div className="countdown-sep">:</div>}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-row">
          <div className="cta-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            June 18, 2026
          </div>
          <div className="divider-v" />
          <div className="cta-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Live Demo Session
          </div>
        </div>

        {/* Footer wordmark */}
        <div className="wordmark">
          <div className="wordmark-sun">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <circle cx="16" cy="16" r="7" fill="#ECAB23"/>
              {[0,45,90,135,180,225,270,315].map((deg, i) => (
                <line
                  key={i}
                  x1={16 + 9 * Math.cos((deg * Math.PI) / 180)}
                  y1={16 + 9 * Math.sin((deg * Math.PI) / 180)}
                  x2={16 + 13 * Math.cos((deg * Math.PI) / 180)}
                  y2={16 + 13 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#ECAB23"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
          <span className="wordmark-text">SOVEREIGN HQ</span>
        </div>
      </div>
    </div>
  )
}
