import { useState } from 'react'

// ── Section: Hero ──────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="dsr-hero">
      <div className="dsr-hero-bg" />
      <div className="dsr-hero-glow-left" />
      <div className="dsr-hero-glow-right" />
      <div className="dsr-hero-content">
        <div className="dsr-badge">
          <span className="dsr-badge-dot" />
          EXCLUSIVE PREVIEW · JUNE 18, 2026
        </div>
        <h1 className="dsr-hero-headline">
          Enterprise AI That Works<br />
          <span className="dsr-accent">While Your Team Sells.</span>
        </h1>
        <p className="dsr-hero-sub">
          Operator is an intelligent content and AI orchestration platform built for large sales organizations.
          Less tool-switching. More closed deals.
        </p>
        <div className="dsr-hero-actions">
          <a href="#overview" className="dsr-btn-primary">Explore the Platform</a>
          <a href="#capabilities" className="dsr-btn-ghost">See Capabilities →</a>
        </div>
        <div className="dsr-hero-stats">
          {[
            { val: '40%', label: 'Faster Rep Ramp Time' },
            { val: '3×', label: 'Content Engagement Lift' },
            { val: '62%', label: 'Reduction in Admin Work' },
          ].map(s => (
            <div key={s.label} className="dsr-stat">
              <div className="dsr-stat-val">{s.val}</div>
              <div className="dsr-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="dsr-hero-visual">
        <div className="dsr-mock-shell">
          <div className="dsr-mock-bar">
            <span className="dsr-mock-dot red" />
            <span className="dsr-mock-dot yellow" />
            <span className="dsr-mock-dot green" />
            <span className="dsr-mock-url">operator.sovereign-hq.com</span>
          </div>
          <div className="dsr-mock-body">
            <div className="dsr-mock-sidebar">
              {['Agents', 'Content', 'Analytics', 'Coaching', 'Settings'].map(l => (
                <div key={l} className={`dsr-mock-nav-item${l === 'Content' ? ' active' : ''}`}>{l}</div>
              ))}
            </div>
            <div className="dsr-mock-main">
              <div className="dsr-mock-header-row">
                <div className="dsr-mock-title-block" />
                <div className="dsr-mock-badge-chip" />
              </div>
              <div className="dsr-mock-cards">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="dsr-mock-card">
                    <div className="dsr-mock-card-icon" style={{ opacity: 0.6 + i * 0.15 }} />
                    <div className="dsr-mock-card-lines">
                      <div className="dsr-mock-line long" />
                      <div className="dsr-mock-line short" />
                    </div>
                    <div className="dsr-mock-card-bar">
                      <div className="dsr-mock-progress" style={{ width: `${40 + i * 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="dsr-mock-chart">
                {[60, 80, 55, 90, 70, 95, 75].map((h, i) => (
                  <div key={i} className="dsr-mock-bar-wrap">
                    <div className="dsr-mock-bar-el" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="dsr-hero-visual-glow" />
      </div>
    </section>
  )
}

// ── Section: Problem ───────────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: '📂',
    title: 'Content Lives Everywhere',
    desc: 'Reps waste hours hunting for the right slide, case study, or compliance doc — and often use outdated materials.',
  },
  {
    icon: '🤖',
    title: 'AI Tools Don\'t Talk to Each Other',
    desc: 'Disconnected point solutions create more friction, not less. Teams pay for AI but still move manually.',
  },
  {
    icon: '📊',
    title: 'No Visibility Into What Moves Deals',
    desc: 'Leaders can\'t see what content is working, which reps are struggling, or where deals stall in the buyer journey.',
  },
]

function Problems() {
  return (
    <section className="dsr-section dsr-problems" id="overview">
      <div className="dsr-section-inner">
        <div className="dsr-section-label">THE CHALLENGE</div>
        <h2 className="dsr-section-title">Enterprise sales teams are drowning in complexity.</h2>
        <p className="dsr-section-sub">
          The tools exist. The talent exists. But the integration layer — the intelligent connective tissue — is missing.
        </p>
        <div className="dsr-problem-grid">
          {PROBLEMS.map(p => (
            <div key={p.title} className="dsr-problem-card">
              <div className="dsr-problem-icon">{p.icon}</div>
              <h3 className="dsr-problem-title">{p.title}</h3>
              <p className="dsr-problem-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Capabilities ──────────────────────────────────────────────────
const CAPS = [
  {
    icon: '🧠',
    title: 'Content Intelligence',
    desc: 'AI-powered content routing surfaces the right asset at the right moment in every deal cycle. Compliance-aware.',
    tags: ['Auto-tagging', 'Version Control', 'Role-Based Access'],
  },
  {
    icon: '⚡',
    title: 'AI Agent Orchestration',
    desc: 'Deploy specialized agents that handle research, outreach drafts, follow-ups, and data entry — autonomously.',
    tags: ['Multi-Agent', 'No-Code Triggers', 'Audit Trail'],
  },
  {
    icon: '🎯',
    title: 'Rep Coaching Engine',
    desc: 'Real-time coaching prompts during calls and async feedback loops that accelerate rep ramp by 40%.',
    tags: ['Call Analysis', 'Skills Gaps', 'Manager Dashboards'],
  },
  {
    icon: '📈',
    title: 'Deal & Engagement Analytics',
    desc: 'Track exactly what buyers engage with, when, and for how long — so you know what\'s working before the call.',
    tags: ['Buyer Intent', 'Content Scoring', 'Pipeline Signals'],
  },
]

function Capabilities() {
  const [active, setActive] = useState(0)
  const cap = CAPS[active]

  return (
    <section className="dsr-section dsr-caps" id="capabilities">
      <div className="dsr-section-inner">
        <div className="dsr-section-label">PLATFORM CAPABILITIES</div>
        <h2 className="dsr-section-title">One platform. Every layer of the sales motion.</h2>
        <div className="dsr-caps-layout">
          <div className="dsr-caps-tabs">
            {CAPS.map((c, i) => (
              <button
                key={c.title}
                className={`dsr-cap-tab${active === i ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="dsr-cap-tab-icon">{c.icon}</span>
                <span>{c.title}</span>
              </button>
            ))}
          </div>
          <div className="dsr-caps-detail">
            <div className="dsr-caps-detail-icon">{cap.icon}</div>
            <h3 className="dsr-caps-detail-title">{cap.title}</h3>
            <p className="dsr-caps-detail-desc">{cap.desc}</p>
            <div className="dsr-caps-tags">
              {cap.tags.map(t => (
                <span key={t} className="dsr-tag">{t}</span>
              ))}
            </div>
            <div className="dsr-caps-preview">
              <div className="dsr-preview-label">LIVE PREVIEW — JUNE 18</div>
              <div className="dsr-preview-placeholder">
                <div className="dsr-preview-lines">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="dsr-preview-line" style={{ width: `${85 - i * 10}%`, opacity: 1 - i * 0.15 }} />
                  ))}
                </div>
                <div className="dsr-preview-chart-mini">
                  {[50, 70, 45, 90, 65, 80].map((h, i) => (
                    <div key={i} className="dsr-preview-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: How It Works ─────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Connect Your Stack', desc: 'Operator integrates with your CRM, content library, communication tools, and HR systems in days — not months.' },
  { num: '02', title: 'Deploy AI Agents', desc: 'Configure purpose-built agents for each workflow: content routing, rep coaching, deal tracking, and more.' },
  { num: '03', title: 'Measure & Optimize', desc: 'Real-time dashboards surface what\'s working. AI continuously learns and improves from every interaction.' },
]

function HowItWorks() {
  return (
    <section className="dsr-section dsr-how" style={{ background: 'rgba(14,56,70,0.12)' }}>
      <div className="dsr-section-inner">
        <div className="dsr-section-label">HOW IT WORKS</div>
        <h2 className="dsr-section-title">Operational from day one.</h2>
        <div className="dsr-steps">
          {STEPS.map((s, i) => (
            <div key={s.num} className="dsr-step">
              <div className="dsr-step-num">{s.num}</div>
              {i < STEPS.length - 1 && <div className="dsr-step-line" />}
              <h3 className="dsr-step-title">{s.title}</h3>
              <p className="dsr-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: About ────────────────────────────────────────────────────────
function About() {
  return (
    <section className="dsr-section dsr-about">
      <div className="dsr-section-inner dsr-about-inner">
        <div className="dsr-about-text">
          <div className="dsr-section-label">ABOUT SOVEREIGN HQ</div>
          <h2 className="dsr-section-title" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>
            We build AI infrastructure for enterprise sales teams.
          </h2>
          <p className="dsr-about-desc">
            Sovereign HQ is an AI enablement and automation firm specializing in agentic platforms for Fortune 500 sales and operations teams. We don't sell software — we deliver outcomes.
          </p>
          <div className="dsr-about-person">
            <img src="https://media.licdn.com/dms/image/v2/D4E03AQGnLAP0T_pxvQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1712775549079?e=1753315200&v=beta&t=wL1I8pPNxLkaDgELAQA5k3HNQVFbkzq1EsA5bJz5jyM" alt="Anthony Sealey" className="dsr-headshot" />
            <div>
              <div className="dsr-person-name">Anthony Sealey</div>
              <div className="dsr-person-title">Founder & CEO, Sovereign HQ</div>
              <div className="dsr-person-sub">19+ years enterprise sales & AI enablement</div>
            </div>
          </div>
        </div>
        <div className="dsr-about-pillars">
          {[
            { icon: '🔒', label: 'Enterprise-Grade Security' },
            { icon: '🔗', label: 'Native Integrations' },
            { icon: '📋', label: 'Compliance-Ready' },
            { icon: '🚀', label: 'Fast Deployment' },
          ].map(p => (
            <div key={p.label} className="dsr-pillar">
              <span className="dsr-pillar-icon">{p.icon}</span>
              <span className="dsr-pillar-label">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Demo Teaser ──────────────────────────────────────────────────
function DemoTeaser() {
  return (
    <section className="dsr-section dsr-teaser">
      <div className="dsr-teaser-inner">
        <div className="dsr-teaser-glow" />
        <div className="dsr-section-label" style={{ color: 'rgba(236,171,35,0.7)', marginBottom: 16 }}>LIVE DEMO</div>
        <h2 className="dsr-section-title" style={{ color: '#fff', marginBottom: 12 }}>
          See Operator in action — June 18, 2026.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, maxWidth: 480, margin: '0 auto 32px' }}>
          A full walkthrough of the platform, live with your data and your workflows. Spots are limited.
        </p>
        <div className="dsr-teaser-date">
          <span className="dsr-teaser-cal-icon">📅</span>
          <span>June 18, 2026 &nbsp;·&nbsp; Live Demo Session</span>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="dsr-footer">
      <div className="dsr-footer-inner">
        <div className="dsr-footer-brand">
          <div className="dsr-footer-logo">
            <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
              <circle cx="16" cy="16" r="7" fill="#ECAB23" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
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
          <span className="dsr-footer-name">SOVEREIGN HQ</span>
        </div>
        <div className="dsr-footer-copy">© 2026 Sovereign HQ. Confidential preview.</div>
      </div>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────
export default function SalesRoom() {
  return (
    <div className="dsr-root">
      <nav className="dsr-nav">
        <div className="dsr-nav-logo">
          <svg viewBox="0 0 32 32" width="18" height="18" fill="none">
            <circle cx="16" cy="16" r="7" fill="#ECAB23" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
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
          <span className="dsr-nav-name">Sovereign HQ</span>
          <span className="dsr-nav-product">Operator</span>
        </div>
        <div className="dsr-nav-links">
          <a href="#overview" className="dsr-nav-link">Overview</a>
          <a href="#capabilities" className="dsr-nav-link">Capabilities</a>
          <div className="dsr-nav-pill">Preview · June 18</div>
        </div>
      </nav>
      <Hero />
      <Problems />
      <Capabilities />
      <HowItWorks />
      <About />
      <DemoTeaser />
      <Footer />
    </div>
  )
}
