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
          AI Infrastructure Built<br />
          <span className="dsr-accent">Independent of the Model.</span>
        </h1>
        <p className="dsr-hero-sub">
          Operator is a model-agnostic agentic infrastructure platform. It works across every major AI provider,
          every workflow, and every enterprise stack — without locking you into a single vendor's roadmap.
        </p>
        <div className="dsr-hero-actions">
          <a href="#overview" className="dsr-btn-primary">Explore the Platform</a>
          <a href="#capabilities" className="dsr-btn-ghost">See Capabilities →</a>
        </div>
        <div className="dsr-hero-stats">
          {[
            { val: '100%', label: 'Model Agnostic' },
            { val: '∞', label: 'Provider Portable' },
            { val: '62%', label: 'Reduction in Manual Work' },
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
    icon: '🔗',
    title: 'Vendor Lock-In Kills Optionality',
    desc: 'Most AI platforms tie your workflows to one model provider. When a better model drops, you\'re stuck — or rebuilding from scratch.',
  },
  {
    icon: '🧱',
    title: 'Point Solutions Don\'t Compound',
    desc: 'Disconnected AI tools create islands of automation. No shared context, no orchestration, no compound returns — just more tabs.',
  },
  {
    icon: '🔭',
    title: 'No Layer for Observation & Control',
    desc: 'Without a harness layer, you can\'t verify what agents did, enforce constraints, or learn from failures systematically.',
  },
]

function Problems() {
  return (
    <section className="dsr-section dsr-problems" id="overview">
      <div className="dsr-section-inner">
        <div className="dsr-section-label">THE CHALLENGE</div>
        <h2 className="dsr-section-title">The model is one chip on the board. Most teams are missing everything else.</h2>
        <p className="dsr-section-sub">
          The models exist. The APIs exist. But the infrastructure layer — context injection, orchestration, observability, enforcement — is still being built by hand at every org.
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
    icon: '⚙️',
    title: 'Harness Layer',
    desc: 'The orchestration and enforcement layer that sits between your teams and every AI model. Context injection, feedback loops, constraints — built once, applied everywhere.',
    tags: ['Model-Agnostic', 'Context Injection', 'Lifecycle Hooks'],
  },
  {
    icon: '🔁',
    title: 'Multi-Agent Orchestration',
    desc: 'Spawn, route, and coordinate specialized agents across tasks — with parallel execution, handoffs, and full audit trails. No manual stitching.',
    tags: ['Parallel Execution', 'Task Decomposition', 'Audit Trail'],
  },
  {
    icon: '🔍',
    title: 'Observe & Verify',
    desc: 'Close the self-verification loop. Agents check their own output against defined criteria before surfacing results. Errors become engineering inputs, not stories.',
    tags: ['Output Verification', 'Failure Signals', 'Ratchet Rules'],
  },
  {
    icon: '🔌',
    title: 'Provider-Portable Runtime',
    desc: 'Run on Claude, GPT, Gemini, or any open model — switch without rebuilding. The harness is yours. The model is a parameter.',
    tags: ['OpenAI', 'Anthropic', 'Gemini', 'Open Models'],
  },
]

function Capabilities() {
  const [active, setActive] = useState(0)
  const cap = CAPS[active]

  return (
    <section className="dsr-section dsr-caps" id="capabilities">
      <div className="dsr-section-inner">
        <div className="dsr-section-label">PLATFORM CAPABILITIES</div>
        <h2 className="dsr-section-title">One infrastructure layer. Every AI workflow in your org.</h2>
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
  { num: '01', title: 'Map Your Workflows', desc: 'We audit your existing AI usage, identify harness gaps, and define the orchestration architecture — model-agnostic from day one.' },
  { num: '02', title: 'Deploy the Infrastructure', desc: 'Operator ships the harness layer: context pipelines, agent runtimes, enforcement hooks, and observability — wired into your stack.' },
  { num: '03', title: 'Iterate Without Rebuilding', desc: 'Swap models, add agents, adjust rules — without touching the underlying infrastructure. The platform compounds as you use it.' },
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
            We build the infrastructure layer that makes AI actually work inside your organization.
          </h2>
          <p className="dsr-about-desc">
            Sovereign HQ is an independent AI infrastructure firm. We research, design, and deploy model-agnostic agentic systems for enterprise organizations — not tied to any vendor, not dependent on any single model. The harness is the product.
          </p>
          <div className="dsr-about-person">
            <img src="https://media.licdn.com/dms/image/v2/D4E03AQGnLAP0T_pxvQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1712775549079?e=1753315200&v=beta&t=wL1I8pPNxLkaDgELAQA5k3HNQVFbkzq1EsA5bJz5jyM" alt="Anthony Sealey" className="dsr-headshot" />
            <div>
              <div className="dsr-person-name">Anthony Sealey</div>
              <div className="dsr-person-title">Founder & CEO, Sovereign HQ</div>
              <div className="dsr-person-sub">19+ years enterprise operations & AI infrastructure</div>
            </div>
          </div>
        </div>
        <div className="dsr-about-pillars">
          {[
            { icon: '🔒', label: 'Enterprise-Grade Security' },
            { icon: '🔌', label: 'Model-Agnostic Runtime' },
            { icon: '🔭', label: 'Research-Grounded' },
            { icon: '⚡', label: 'Independent Infrastructure' },
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
          See the infrastructure in action — June 18, 2026.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, maxWidth: 480, margin: '0 auto 32px' }}>
          A live walkthrough of the harness layer — model-agnostic, fully observable, running real workflows. Spots are limited.
        </p>
        <div className="dsr-teaser-date">
          <span className="dsr-teaser-cal-icon">📅</span>
          <span>June 18, 2026 &nbsp;·&nbsp; Live Demo Session</span>
        </div>

        {/* Harness Engineering Post Card */}
        <a
          href="/harness-post.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 20,
            marginTop: 48,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(236,171,35,0.2)',
            borderRadius: 16,
            padding: '20px 24px',
            maxWidth: 620,
            width: '100%',
            margin: '48px auto 0',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(236,171,35,0.55)'
            ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(236,171,35,0.2)'
            ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'
          }}
        >
          <img
            src="/harness-thumbnail.png"
            alt="Harness Engineering"
            style={{ width: 100, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(236,171,35,0.75)', marginBottom: 6 }}>ENGINEERING POST</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', lineHeight: 1.4, marginBottom: 6 }}>
              The Other Half of AI That Actually Matters
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>
              The model is one chip on the board. Context injection, orchestration, observability, and enforcement — that's the harness layer most teams are still building by hand.
            </p>
            <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(236,171,35,0.6)' }}>Read the post →</div>
          </div>
        </a>
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
