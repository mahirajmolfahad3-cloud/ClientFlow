// app/(marketing)/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Users, FolderKanban, CheckSquare, BarChart3, Bell,
  Shield, Zap, ArrowRight, Check, Star, Menu, X,
  ChevronRight, Globe, Clock, TrendingUp,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'


// ─── Design tokens — Sage + Slate ─────────────────────────────────────────────
const C = {
  // Sage greens
  sage:        '#7c9e8f',       // primary accent
  sageDark:    '#5a7d6e',       // hover / active
  sageDeep:    '#3d5c50',       // dark variant
  sageLight:   '#eef4f1',       // tinted backgrounds
  sageMid:     '#c2d9d0',       // borders / dividers

  // Slate neutrals
  slate950:    '#0c1117',       // near-black headings
  slate900:    '#111827',
  slate800:    '#1f2937',
  slate700:    '#374151',
  slate600:    '#4b5563',
  slate500:    '#6b7280',
  slate400:    '#9ca3af',
  slate300:    '#d1d5db',
  slate200:    '#e5e7eb',
  slate100:    '#f3f4f6',
  slate50:     '#f9fafb',

  white:       '#ffffff',

  // Supporting
  amber:       '#d97706',
  amberLight:  '#fef3c7',
  green:       '#059669',
  greenLight:  '#d1fae5',
  greenDark:   '#064e3b',
  teal:        '#0f766e',
}

const font = `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif`

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: ${font}; background: #fff; color: ${C.slate700}; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .6; transform: scale(1.5); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }

  .nav-link {
    font-size: 14px; color: ${C.slate600}; text-decoration: none;
    font-weight: 500; transition: color .15s; padding: 4px 0;
  }
  .nav-link:hover { color: ${C.slate900}; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${C.sage}; color: #fff; font-weight: 600;
    border-radius: 10px; text-decoration: none; transition: all .18s;
    border: none; cursor: pointer; font-family: ${font};
  }
  .btn-primary:hover {
    background: ${C.sageDark};
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(124,158,143,.35);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: ${C.slate700}; font-weight: 600;
    border-radius: 10px; text-decoration: none; transition: all .18s;
    border: 1.5px solid ${C.slate300}; cursor: pointer; font-family: ${font};
  }
  .btn-ghost:hover { background: ${C.slate50}; border-color: ${C.slate400}; }

  .feature-card {
    background: #fff; border: 1px solid ${C.slate200}; border-radius: 14px;
    padding: 24px; transition: all .22s; cursor: default;
  }
  .feature-card:hover {
    border-color: ${C.sage};
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(124,158,143,.12);
  }

  .plan-card {
    background: #fff; border-radius: 18px; padding: 28px;
    display: flex; flex-direction: column;
    transition: transform .22s, box-shadow .22s;
  }
  .plan-card:hover { transform: translateY(-4px); }

  .testimonial-card {
    background: ${C.slate50}; border: 1px solid ${C.slate200}; border-radius: 14px;
    padding: 24px; transition: box-shadow .2s;
  }
  .testimonial-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.07); }

  .footer-link {
    font-size: 14px; color: ${C.slate400}; text-decoration: none; transition: color .15s;
  }
  .footer-link:hover { color: #fff; }

  /* ── Mobile ─────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .md-hide { display: none !important; }
    .md-show { display: flex !important; }
    .grid-3 { grid-template-columns: 1fr !important; gap: 14px !important; }
    .grid-2 { grid-template-columns: 1fr 1fr !important; }
    .grid-footer { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 0 !important; }
    .stats-cell { border-right: none !important; border-bottom: 1px solid ${C.slate200}; }
    .stats-cell:nth-child(odd) { border-right: 1px solid ${C.slate200} !important; }
    .stats-cell:last-child { border-bottom: none !important; }
    .hero-btns { flex-direction: column !important; align-items: stretch !important; }
    .hero-btns a, .hero-btns button { width: 100% !important; justify-content: center !important; }
    .hero-heading { font-size: 36px !important; }
    .section-heading { font-size: 28px !important; }
    .mock-sidebar { display: none !important; }
    .mock-layout { height: auto !important; }
    .mock-main { padding: 14px !important; }
    .cta-section { padding: 64px 20px !important; }
    .nav-cta { display: none !important; }
    .billing-toggle { flex-direction: column !important; gap: 4px !important; }
  }

  @media (max-width: 480px) {
    .grid-2 { grid-template-columns: 1fr !important; }
    .grid-footer { grid-template-columns: 1fr !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
`

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  { icon: Users,        label: 'Client management',  desc: 'Keep every client, contact, and conversation in one organised place. No more lost emails.' },
  { icon: FolderKanban, label: 'Project tracking',   desc: "See every project's status at a glance. Kanban boards that actually fit how you work." },
  { icon: CheckSquare,  label: 'Task management',    desc: 'Assign tasks, set deadlines, and track progress without switching apps.' },
  { icon: BarChart3,    label: 'Revenue insights',   desc: 'Know which clients and projects are most profitable. Make decisions with real data.' },
  { icon: Bell,         label: 'Smart reminders',    desc: "Never miss a follow-up or deadline again. Reminders that know your schedule." },
  { icon: Shield,       label: 'Secure file storage', desc: 'Share files with clients safely. Permissions, versioning, and 256-bit encryption built in.' },
]

const plans = [
  {
    name: 'Starter', price: 0, annual: 0, annualTotal: 0,
    desc: 'For freelancers just getting started.',
    features: ['Up to 5 clients', '3 active projects', 'Kanban task board', '1 GB file storage'],
    cta: 'Get started free', href: '/signup', featured: false,
  },
  {
    name: 'Pro', price: 19, annual: 15, annualTotal: 180,
    desc: 'For growing freelancers and small agencies.',
    features: ['Unlimited clients', 'Unlimited projects', 'Kanban + list views', '50 GB file storage', 'Revenue insights', 'Priority support'],
    cta: 'Start free trial', href: '/signup', featured: true,
  },
  {
    name: 'Agency', price: 49, annual: 39, annualTotal: 468,
    desc: 'For teams managing clients at scale.',
    features: ['Everything in Pro', 'Up to 10 team members', 'White-label client portal', '500 GB storage', 'Custom branding', 'Dedicated account manager'],
    cta: 'Contact sales', href: '/contact', featured: false,
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',     role: 'Brand designer',        avatar: 'SC',
    quote: 'I went from three spreadsheets and a sticky-note system to having everything in one place. ClientFlow paid for itself in the first week.',
    stars: 5,
  },
  {
    name: 'Marcus Webb',    role: 'Digital agency founder', avatar: 'MW',
    quote: 'Our team finally knows what everyone is working on. We onboard new clients in half the time we used to.',
    stars: 5,
  },
  {
    name: 'Priya Nambiar',  role: 'Freelance developer',   avatar: 'PN',
    quote: 'The revenue insights alone are worth it. I finally know which clients are actually profitable and which ones are costing me time.',
    stars: 5,
  },
]

const stats = [
  { value: '1,234+', label: 'Freelancers & agencies' },
  { value: '$5k',    label: 'Client revenue managed' },
  { value: '98%',    label: 'Customer satisfaction' },
  { value: '2 min',  label: 'Average setup time' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} fill={C.amber} color={C.amber} />
      ))}
    </div>
  )
}

function Avatar({ initials, color = C.sage }: { initials: string; color?: string }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#fff', fontWeight: 700,
      fontSize: 13, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [isAnnual, setIsAnnual]       = useState(false)
  const [mobileNav, setMobileNav]     = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) router.replace('/dashboard')
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  async function handleDemoLogin() {
    setDemoLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: 'demo@clientflow.com',
      password: '2939189mahirajmol',
    })
    if (error) {
      console.error(error)
      setDemoLoading(false)
      return
    }
    window.location.href = '/dashboard'
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div style={{ minHeight: '100vh', background: C.white }}>

        {/* ── NAV ─────────────────────────────────────────────────────── */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${scrolled ? C.slate200 : 'transparent'}`,
          transition: 'all .25s',
        }}>
          <div style={{
            maxWidth: 1120, margin: '0 auto', padding: '0 20px',
            height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32, background: C.sage, borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: '-.02em' }}>CF</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: C.slate900, letterSpacing: '-.03em' }}>
                ClientFlow
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="md-hide" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {['Features', 'Pricing', 'Testimonials'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
              ))}
            </div>

            <div className="nav-cta md-hide" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link href="/login" className="nav-link">Sign in</Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '8px 16px', fontSize: 14 }}>
                Get started free
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md-show"
              onClick={() => setMobileNav(!mobileNav)}
              style={{
                display: 'none', background: 'none', border: 'none',
                cursor: 'pointer', color: C.slate700, padding: 4,
              }}
            >
              {mobileNav ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileNav && (
            <div style={{
              background: '#fff', borderTop: `1px solid ${C.slate200}`,
              padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4,
              animation: 'slideDown .2s ease',
            }}>
              {['features', 'pricing', 'testimonials'].map(s => (
                <a
                  key={s}
                  href={`#${s}`}
                  onClick={() => setMobileNav(false)}
                  style={{
                    padding: '11px 0', fontSize: 15, fontWeight: 500,
                    color: C.slate700, textDecoration: 'none', textTransform: 'capitalize',
                    borderBottom: `1px solid ${C.slate100}`,
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </a>
              ))}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/login"  className="btn-ghost"   style={{ padding: '11px 16px', fontSize: 14, justifyContent: 'center' }}>Sign in</Link>
                <Link href="/signup" className="btn-primary" style={{ padding: '11px 16px', fontSize: 14, justifyContent: 'center' }}>Get started free</Link>
              </div>
            </div>
          )}
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{
          paddingTop: 130, paddingBottom: 72, paddingLeft: 20, paddingRight: 20,
          background: `linear-gradient(160deg, ${C.sageLight} 0%, ${C.white} 55%)`,
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>

            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.sageLight, border: `1px solid ${C.sageMid}`,
              borderRadius: 99, padding: '5px 14px', marginBottom: 26,
              animation: 'fadeUp .5s ease both',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: C.sage,
                animation: 'pulse-dot 2s ease infinite', flexShrink: 0,
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.sageDeep }}>
                Built for freelancers &amp; agencies
              </span>
            </div>

            <h1
              className="hero-heading"
              style={{
                fontSize: 'clamp(36px, 6vw, 60px)',
                fontWeight: 800, color: C.slate950,
                lineHeight: 1.08, letterSpacing: '-.04em',
                marginBottom: 22,
                animation: 'fadeUp .55s ease .08s both',
              }}
            >
              Manage your clients<br />
              <span style={{ color: C.sage }}>without the chaos</span>
            </h1>

            <p style={{
              fontSize: 18, color: C.slate600, lineHeight: 1.7,
              maxWidth: 520, margin: '0 auto 36px',
              animation: 'fadeUp .55s ease .16s both',
            }}>
              ClientFlow gives you a single dashboard for clients, projects, and tasks.
              Stop juggling spreadsheets and scattered notes.
            </p>

            <div
              className="hero-btns"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 12, flexWrap: 'wrap',
                animation: 'fadeUp .55s ease .24s both',
              }}
            >
              <Link href="/signup" className="btn-primary" style={{ padding: '13px 26px', fontSize: 15 }}>
                Start for free <ArrowRight size={16} />
              </Link>

              <button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: C.white, color: C.slate700, fontWeight: 600,
                  border: `1.5px solid ${C.slate300}`, borderRadius: 10,
                  padding: '13px 26px', fontSize: 15, cursor: 'pointer',
                  fontFamily: font, transition: 'all .18s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = C.sage
                  ;(e.currentTarget as HTMLButtonElement).style.color = C.sage
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = C.slate300
                  ;(e.currentTarget as HTMLButtonElement).style.color = C.slate700
                }}
              >
                {demoLoading ? 'Opening demo…' : 'Try demo mode'}
              </button>
            </div>

            <p style={{
              marginTop: 16, fontSize: 12, color: C.slate400,
              animation: 'fadeUp .55s ease .30s both',
            }}>
              No credit card required &nbsp;·&nbsp; Free plan available &nbsp;·&nbsp; Setup in 2 minutes
            </p>
          </div>

          {/* Dashboard mockup */}
          <div style={{
            maxWidth: 940, margin: '52px auto 0',
            animation: 'fadeUp .7s ease .35s both',
          }}>
            <div style={{
              background: C.white, borderRadius: 18,
              border: `1px solid ${C.slate200}`,
              boxShadow: '0 28px 72px rgba(15,23,42,.11), 0 0 0 1px rgba(124,158,143,.08)',
              overflow: 'hidden',
            }}>
              {/* Window chrome */}
              <div style={{
                background: C.slate50, borderBottom: `1px solid ${C.slate200}`,
                padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#f87171','#fbbf24','#34d399'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{
                  flex: 1, background: C.white, border: `1px solid ${C.slate200}`,
                  borderRadius: 7, padding: '3px 10px', textAlign: 'center',
                  fontSize: 11, color: C.slate400,
                }}>
                  clientflow.app/dashboard
                </div>
              </div>

              {/* App layout */}
              <div className="mock-layout" style={{ display: 'flex', height: 300 }}>
                {/* Sidebar */}
                <div className="mock-sidebar" style={{
                  width: 190, background: C.slate950, padding: '18px 10px',
                  display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0,
                }}>
                  <div style={{
                    color: C.white, fontWeight: 800, fontSize: 13,
                    padding: '0 8px', marginBottom: 14, letterSpacing: '-.02em',
                  }}>
                    ClientFlow
                  </div>
                  {[
                    { label: 'Dashboard', icon: BarChart3,   active: true  },
                    { label: 'Clients',   icon: Users,        active: false },
                    { label: 'Projects',  icon: FolderKanban, active: false },
                    { label: 'Tasks',     icon: CheckSquare,  active: false },
                  ].map(({ label, icon: Icon, active }) => (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '8px 10px', borderRadius: 7, cursor: 'default',
                      background: active ? C.sage : 'transparent',
                      color: active ? C.white : C.slate400, fontSize: 13, fontWeight: 500,
                    }}>
                      <Icon size={14} />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="mock-main" style={{ flex: 1, background: C.slate50, padding: '18px', overflowY: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
                    {[
                      { n: '12', label: 'Active Clients', color: C.sage },
                      { n: '5',  label: 'Projects',       color: C.teal },
                      { n: '24', label: 'Open Tasks',     color: C.green },
                    ].map(({ n, label, color }) => (
                      <div key={label} style={{
                        background: C.white, borderRadius: 10,
                        border: `1px solid ${C.slate200}`, padding: '12px 14px',
                      }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: C.slate900, lineHeight: 1 }}>{n}</div>
                        <div style={{ fontSize: 10, color: C.slate500, marginTop: 3 }}>{label}</div>
                        <div style={{ marginTop: 8, height: 3, borderRadius: 99, background: color, width: '55%', opacity: .75 }} />
                      </div>
                    ))}
                  </div>

                  <div style={{
                    background: C.white, borderRadius: 10,
                    border: `1px solid ${C.slate200}`, padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.slate700, marginBottom: 9 }}>Recent Projects</div>
                    {[
                      { name: 'Website Redesign', status: 'In Progress', color: C.amberLight,  text: '#92400e'    },
                      { name: 'Brand Identity',   status: 'Planning',    color: C.sageLight,   text: C.sageDeep   },
                      { name: 'SEO Audit',        status: 'Completed',   color: C.greenLight,  text: C.greenDark  },
                    ].map(({ name, status, color, text }) => (
                      <div key={name} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 0', borderBottom: `1px solid ${C.slate100}`,
                      }}>
                        <span style={{ fontSize: 11, color: C.slate700 }}>{name}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 9px',
                          borderRadius: 99, background: color, color: text,
                        }}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <section style={{
          padding: '48px 20px',
          background: C.white,
          borderTop: `1px solid ${C.slate100}`,
          borderBottom: `1px solid ${C.slate100}`,
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div
              className="stats-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}
            >
              {stats.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="stats-cell"
                  style={{
                    textAlign: 'center', padding: '12px 16px',
                    borderRight: i < 3 ? `1px solid ${C.slate200}` : 'none',
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 800, color: C.slate900, letterSpacing: '-.03em' }}>{value}</div>
                  <div style={{ fontSize: 12, color: C.slate500, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────── */}
        <section id="features" style={{ padding: '88px 20px', background: C.white }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700,
                letterSpacing: '.1em', textTransform: 'uppercase',
                color: C.sageDeep, background: C.sageLight,
                padding: '4px 14px', borderRadius: 99, marginBottom: 16,
              }}>
                Features
              </span>
              <h2
                className="section-heading"
                style={{
                  fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800,
                  color: C.slate900, letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: 12,
                }}
              >
                Everything you need.<br />Nothing you don't.
              </h2>
              <p style={{ fontSize: 16, color: C.slate600, maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
                ClientFlow is focused on what freelancers actually need — not bloated with features you'll never use.
              </p>
            </div>

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {features.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="feature-card">
                  <div style={{
                    width: 42, height: 42, borderRadius: 11,
                    background: C.sageLight, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                  }}>
                    <Icon size={19} color={C.sage} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.slate900, marginBottom: 7 }}>{label}</div>
                  <div style={{ fontSize: 13, color: C.slate600, lineHeight: 1.65 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <section id="pricing" style={{
          padding: '88px 20px',
          background: C.slate50,
          borderTop: `1px solid ${C.slate100}`,
          borderBottom: `1px solid ${C.slate100}`,
        }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700,
                letterSpacing: '.1em', textTransform: 'uppercase',
                color: C.sageDeep, background: C.sageLight,
                padding: '4px 14px', borderRadius: 99, marginBottom: 16,
              }}>
                Pricing
              </span>
              <h2
                className="section-heading"
                style={{
                  fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800,
                  color: C.slate900, letterSpacing: '-.03em', marginBottom: 12,
                }}
              >
                Simple, transparent pricing
              </h2>
              <p style={{ fontSize: 16, color: C.slate600, marginBottom: 32 }}>
                Start free. Upgrade as you grow. Cancel anytime.
              </p>

              {/* Billing toggle */}
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: C.slate200, borderRadius: 99, padding: 4, gap: 2,
              }}>
                {[
                  { label: 'Monthly', value: false },
                  { label: 'Annual',  value: true  },
                ].map(({ label, value }) => (
                  <button
                    key={label}
                    onClick={() => setIsAnnual(value)}
                    style={{
                      padding: '7px 18px', borderRadius: 99, border: 'none',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      fontFamily: font, transition: 'all .15s',
                      background: isAnnual === value ? C.white : 'transparent',
                      color: isAnnual === value ? C.slate900 : C.slate500,
                      boxShadow: isAnnual === value ? '0 1px 4px rgba(0,0,0,.10)' : 'none',
                      display: 'flex', alignItems: 'center', gap: 7,
                    }}
                  >
                    {label}
                    {value && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: C.greenDark,
                        background: C.greenLight, padding: '2px 7px', borderRadius: 99,
                      }}>
                        Save 20%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, alignItems: 'stretch' }}>
              {plans.map((plan) => {
                const price  = isAnnual ? plan.annual : plan.price
                const saving = (plan.price - plan.annual) * 12
                return (
                  <div
                    key={plan.name}
                    className="plan-card"
                    style={{
                      border: plan.featured ? `2px solid ${C.sage}` : `1px solid ${C.slate200}`,
                      boxShadow: plan.featured
                        ? `0 12px 36px rgba(124,158,143,.18)`
                        : '0 2px 8px rgba(0,0,0,.04)',
                      position: 'relative',
                    }}
                  >
                    {plan.featured && (
                      <div style={{
                        position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                        background: C.sage,
                        color: C.white, fontSize: 11, fontWeight: 700,
                        padding: '5px 16px', borderRadius: 99, whiteSpace: 'nowrap',
                        display: 'flex', alignItems: 'center', gap: 5,
                        boxShadow: '0 4px 14px rgba(124,158,143,.4)',
                      }}>
                        <Zap size={11} fill="#fff" strokeWidth={0} /> Most popular
                      </div>
                    )}

                    <div style={{ marginBottom: 18, paddingTop: plan.featured ? 8 : 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.slate900, marginBottom: 4 }}>{plan.name}</div>
                      <div style={{ fontSize: 13, color: C.slate500, lineHeight: 1.5 }}>{plan.desc}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 42, fontWeight: 800, color: C.slate900, letterSpacing: '-.04em', lineHeight: 1 }}>
                        {price === 0 ? 'Free' : `$${price}`}
                      </span>
                      {price > 0 && <span style={{ fontSize: 13, color: C.slate400 }}>/mo</span>}
                    </div>

                    <div style={{ fontSize: 12, color: C.slate400, marginBottom: 22, minHeight: 18 }}>
                      {isAnnual && plan.price > 0
                        ? `Billed $${plan.annualTotal}/yr · saves $${saving}`
                        : price > 0 ? 'Billed monthly · cancel anytime'
                        : 'No credit card required'}
                    </div>

                    <div style={{ height: 1, background: C.slate100, marginBottom: 22 }} />

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 24 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: C.slate700 }}>
                          <span style={{
                            width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
                            background: plan.featured ? C.sageLight : C.slate100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                          }}>
                            <Check size={9} strokeWidth={3} color={plan.featured ? C.sage : C.slate500} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.href}
                      className={plan.featured ? 'btn-primary' : 'btn-ghost'}
                      style={{
                        padding: '12px 18px', fontSize: 14, justifyContent: 'center',
                        ...(plan.featured ? { boxShadow: `0 4px 16px rgba(124,158,143,.3)` } : {}),
                      }}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        <section id="testimonials" style={{ padding: '88px 20px', background: C.white }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{
                display: 'inline-block', fontSize: 11, fontWeight: 700,
                letterSpacing: '.1em', textTransform: 'uppercase',
                color: C.sageDeep, background: C.sageLight,
                padding: '4px 14px', borderRadius: 99, marginBottom: 16,
              }}>
                Testimonials
              </span>
              <h2
                className="section-heading"
                style={{
                  fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800,
                  color: C.slate900, letterSpacing: '-.03em', marginBottom: 12,
                }}
              >
                Loved by freelancers worldwide
              </h2>
              <p style={{ fontSize: 16, color: C.slate600 }}>
                Join 12,000+ freelancers who got their work life organised.
              </p>
            </div>

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {testimonials.map(({ name, role, avatar, quote, stars }) => (
                <div key={name} className="testimonial-card">
                  <StarRow count={stars} />
                  <p style={{ fontSize: 14, color: C.slate700, lineHeight: 1.7, margin: '14px 0 18px', fontStyle: 'italic' }}>
                    "{quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Avatar initials={avatar} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.slate900 }}>{name}</div>
                      <div style={{ fontSize: 12, color: C.slate500 }}>{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────────────── */}
        <section
          className="cta-section"
          style={{
            padding: '88px 20px',
            background: C.sageDeep,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* bg decorations */}
          <div style={{
            position: 'absolute', top: -80, right: -80, width: 300, height: 300,
            background: 'rgba(255,255,255,.05)', borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -60, left: -60, width: 220, height: 220,
            background: 'rgba(255,255,255,.04)', borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800,
              color: C.white, letterSpacing: '-.03em', marginBottom: 14,
            }}>
              Ready to get organised?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.72)', marginBottom: 34, lineHeight: 1.65 }}>
              Join ClientFlow today. It's free to start and takes two minutes to set up.
            </p>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: C.white, color: C.sageDeep,
                padding: '14px 30px', borderRadius: 12,
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(0,0,0,.18)',
                transition: 'all .18s',
              }}
            >
              Create your free account <ArrowRight size={16} />
            </Link>
            <p style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,.45)' }}>
              No credit card required
            </p>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer style={{ background: C.slate950, padding: '52px 20px 28px' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div
              className="grid-footer"
              style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 36, marginBottom: 44 }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                  <div style={{
                    width: 30, height: 30, background: C.sage, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 11 }}>CF</span>
                  </div>
                  <span style={{ color: C.white, fontWeight: 800, fontSize: 15, letterSpacing: '-.02em' }}>ClientFlow</span>
                </div>
                <p style={{ fontSize: 13, color: C.slate400, lineHeight: 1.7, maxWidth: 210 }}>
                  Client management software built for freelancers and small agencies.
                </p>
              </div>

              {[
                { heading: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
                { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
                { heading: 'Legal',   links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: C.slate300,
                    marginBottom: 14, letterSpacing: '.08em', textTransform: 'uppercase',
                  }}>
                    {heading}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {links.map(l => (
                      <a key={l} href="#" className="footer-link">{l}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: `1px solid rgba(255,255,255,.07)`,
              paddingTop: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 10,
            }}>
              <p style={{ fontSize: 12, color: C.slate400 }}>
                © {new Date().getFullYear()} ClientFlow. Built for freelancers.
              </p>
              <div style={{ display: 'flex', gap: 18 }}>
                {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                  <a key={s} href="#" className="footer-link">{s}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
