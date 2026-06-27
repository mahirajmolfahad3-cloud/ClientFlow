'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import {
  LayoutDashboard, Users, FolderOpen, CheckSquare,
  Settings, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients',   label: 'Clients',   icon: Users },
  { href: '/projects',  label: 'Projects',  icon: FolderOpen },
  { href: '/tasks',     label: 'Tasks',     icon: CheckSquare },
  { href: '/settings',  label: 'Settings',  icon: Settings },
]

// ─── Sage + Slate tokens (mirrors landing page) ───────────────────────────────
const sage      = '#7c9e8f'
const sageLight = '#eef4f1'
const sageMid   = '#c2d9d0'
const sageDeep  = '#3d5c50'
const slate950  = '#0c1117'
const slate900  = '#111827'
const slate800  = '#1f2937'
const slate700  = '#374151'
const slate600  = '#4b5563'
const slate500  = '#6b7280'
const slate400  = '#9ca3af'
const slate300  = '#d1d5db'
const slate200  = '#e5e7eb'
const slate100  = '#f3f4f6'
const slate50   = '#f9fafb'

function Sidebar({
  user,
  onClose,
  mobile,
}: {
  user: User | null
  mobile?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const name     = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'User'
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: slate950,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px',
        borderBottom: `1px solid rgba(255,255,255,.07)`,
      }}>
        <Link href="/dashboard" style={{
          display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none',
        }}>
          <div style={{
            width: 30, height: 30, background: sage, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 11 }}>CF</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '-.02em' }}>
            ClientFlow
          </span>
        </Link>

        {mobile && (
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: slate400, padding: 4, display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: '12px 10px',
        display: 'flex', flexDirection: 'column', gap: 2,
        overflowY: 'auto',
      }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                fontSize: 13, fontWeight: 500, textDecoration: 'none',
                transition: 'all .15s',
                background: active ? sage : 'transparent',
                color: active ? '#fff' : slate400,
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,.06)'
                  ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLAnchorElement).style.color = slate400
                }
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={13} style={{ opacity: 0.6 }} />}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div style={{
        padding: '10px 10px 14px',
        borderTop: `1px solid rgba(255,255,255,.07)`,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        {/* User info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `${sage}33`,
            color: sage,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              color: '#fff', fontSize: 13, fontWeight: 600,
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {name}
            </p>
            <p style={{
              color: slate500, fontSize: 11, margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8,
            fontSize: 13, fontWeight: 500,
            color: slate400, background: 'none', border: 'none',
            cursor: 'pointer', width: '100%', textAlign: 'left',
            transition: 'all .15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,.06)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none'
            ;(e.currentTarget as HTMLButtonElement).style.color = slate400
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser]           = useState<User | null>(null)
  const [loading, setLoading]     = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.href = '/auth/login'; return }
      setUser(session.user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: slate50,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 28, height: 28,
            border: `2px solid ${sage}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin .75s linear infinite',
            margin: '0 auto 12px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 13, color: slate500 }}>Loading ClientFlow…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: slate100, overflow: 'hidden',
    }}>
      {/* Desktop sidebar */}
      <div style={{
        width: 224, flexShrink: 0,
        display: 'none',
      }}
        className="cf-sidebar-desktop"
      >
        <Sidebar user={user} />
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .cf-sidebar-desktop { display: flex !important; flex-direction: column; }
          .cf-mobile-topbar { display: none !important; }
        }
        @media (max-width: 1023px) {
          .cf-sidebar-desktop { display: none !important; }
          .cf-mobile-topbar { display: flex !important; }
        }
      `}</style>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(0,0,0,.55)',
            }}
          />
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: 224, zIndex: 50,
          }}>
            <Sidebar user={user} mobile onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* Main area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        minWidth: 0, overflow: 'hidden',
      }}>
        {/* Mobile topbar */}
        <div
          className="cf-mobile-topbar"
          style={{
            alignItems: 'center', gap: 14,
            padding: '10px 16px',
            background: '#fff',
            borderBottom: `1px solid ${slate200}`,
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: slate600, padding: 4, display: 'flex',
            }}
          >
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, background: sage, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 10 }}>CF</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: slate900, letterSpacing: '-.02em' }}>
              ClientFlow
            </span>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
