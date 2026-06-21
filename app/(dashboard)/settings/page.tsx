'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Button, Card } from '@/components/ui'
import { User as UserIcon, Mail, Shield, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      setUser(session.user)
      setName(session.user.user_metadata?.full_name ?? '')
    })
  }, [])

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.auth.updateUser({ data: { full_name: name } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const joined = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card className="p-6 space-y-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><UserIcon className="w-5 h-5 text-gray-400" />Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xl">{initials}</div>
          <div>
            <p className="font-semibold text-gray-900">{name || 'Your name'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">Member since {joined}</p>
          </div>
        </div>
        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name" disabled={saving}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" loading={saving} size="md">Save changes</Button>
            {saved && <span className="text-sm text-green-600 font-medium">✓ Saved!</span>}
          </div>
        </form>
      </Card>

      {/* Account */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Mail className="w-5 h-5 text-gray-400" />Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-700">Email address</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Verified</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">User ID</p>
              <p className="text-xs text-gray-400 font-mono">{user?.id}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Shield className="w-5 h-5 text-gray-400" />Security</h2>
        <p className="text-sm text-gray-500">Password changes are handled securely through Supabase authentication.</p>
        <Button variant="secondary" size="md" onClick={async () => {
          if (!user?.email) return
          await supabase.auth.resetPasswordForEmail(user.email)
          alert('Password reset email sent!')
        }}>
          Send password reset email
        </Button>
      </Card>

      {/* Sign out */}
      <Card className="p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-3"><LogOut className="w-5 h-5 text-gray-400" />Session</h2>
        <p className="text-sm text-gray-500 mb-4">Sign out of your ClientFlow account on this device.</p>
        <Button variant="danger" onClick={handleSignOut}><LogOut className="w-4 h-4" />Sign out</Button>
      </Card>
    </div>
  )
}
