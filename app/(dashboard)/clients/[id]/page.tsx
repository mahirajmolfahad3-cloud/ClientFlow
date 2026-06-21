'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Client, Project } from '@/types'
import { PageLoader, ProjectStatusBadge, Button } from '@/components/ui'
import { ArrowLeft, Mail, Phone, Building2, StickyNote, FolderOpen, Calendar } from 'lucide-react'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from('clients').select('*').eq('id', id).single(),
        supabase.from('projects').select('*').eq('client_id', id).order('created_at', { ascending: false }),
      ])
      if (!c) { router.push('/clients'); return }
      setClient(c)
      setProjects(p ?? [])
      setLoading(false)
    }
    load()
  }, [id, router])

  if (loading) return <PageLoader />
  if (!client) return null

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/clients"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" />Clients</Button></Link>
      </div>

      {/* Client header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xl">
            {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{client.name}</h1>
            {client.company && <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><Building2 className="w-4 h-4" />{client.company}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
              <Mail className="w-4 h-4 text-gray-400" />{client.email}
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
              <Phone className="w-4 h-4 text-gray-400" />{client.phone}
            </div>
          )}
          {client.notes && (
            <div className="sm:col-span-2 flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
              <StickyNote className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />{client.notes}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-4">Client since {new Date(client.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><FolderOpen className="w-5 h-5 text-gray-400" />Projects ({projects.length})</h2>
          <Link href="/projects"><Button size="sm" variant="secondary">New project</Button></Link>
        </div>
        {projects.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No projects for this client yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {projects.map(p => (
              <Link key={p.id} href={`/projects/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.description}</p>}
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {p.deadline && (
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(p.deadline).toLocaleDateString()}</span>
                  )}
                  <ProjectStatusBadge status={p.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
