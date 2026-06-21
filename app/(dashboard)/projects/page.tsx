'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validations'
import type { Client, Project } from '@/types'
import { Button, Input, Textarea, Select, Modal, EmptyState, PageLoader, ConfirmDialog, Card, ProjectStatusBadge } from '@/components/ui'
import { FolderOpen, Plus, Search, Calendar, Pencil, Trash2, Eye, Building2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
]

function ProjectForm({ initial, clients, onSave, onCancel, loading }: {
  initial?: Partial<Project>
  clients: Client[]
  onSave: (data: ProjectFormData) => void
  onCancel: () => void
  loading: boolean
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      client_id: initial?.client_id ?? '',
      status: initial?.status ?? 'planning',
      deadline: initial?.deadline ?? '',
    },
  })

  const clientOptions = [
    { value: '', label: 'No client' },
    ...clients.map(c => ({ value: c.id, label: `${c.name}${c.company ? ` — ${c.company}` : ''}` })),
  ]

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Input label="Project name *" placeholder="Website Redesign" error={errors.name?.message} {...register('name')} />
      <Textarea label="Description" placeholder="What is this project about?" error={errors.description?.message} {...register('description')} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Client" options={clientOptions} error={errors.client_id?.message} {...register('client_id')} />
        <Select label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
      </div>
      <Input label="Deadline" type="date" error={errors.deadline?.message} {...register('deadline')} />
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial?.id ? 'Save changes' : 'Create project'}</Button>
      </div>
    </form>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('projects').select('*, clients(id, name, company)').order('created_at', { ascending: false }),
      supabase.from('clients').select('*').order('name'),
    ])
    setProjects(p ?? [])
    setClients(c ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(data: ProjectFormData) {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('projects').insert({
      ...data,
      user_id: session!.user.id,
      client_id: data.client_id || null,
      deadline: data.deadline || null,
    })
    await load()
    setShowAdd(false)
    setSaving(false)
  }

  async function handleEdit(data: ProjectFormData) {
    if (!editing) return
    setSaving(true)
    await supabase.from('projects').update({
      ...data,
      client_id: data.client_id || null,
      deadline: data.deadline || null,
    }).eq('id', editing.id)
    await load()
    setEditing(null)
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleting) return
    setSaving(true)
    await supabase.from('projects').delete().eq('id', deleting.id)
    await load()
    setDeleting(null)
    setSaving(false)
  }

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.clients as any)?.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) return <PageLoader />

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1 text-sm">{projects.length} total project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" />New project</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FolderOpen className="w-10 h-10" />}
          title={search || statusFilter ? 'No projects found' : 'No projects yet'}
          description="Create your first project to start tracking work."
          action={<Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" />Create project</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => {
            const client = project.clients as any
            const daysLeft = project.deadline
              ? Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000)
              : null
            return (
              <Card key={project.id} className="p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{project.name}</p>
                    {client && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />{client.name}
                      </p>
                    )}
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </div>
                {project.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>}
                {project.deadline && (
                  <p className={`text-xs flex items-center gap-1 mb-4 font-medium ${daysLeft! < 0 ? 'text-red-500' : daysLeft! <= 7 ? 'text-yellow-600' : 'text-gray-400'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    {daysLeft! < 0 ? `Overdue by ${Math.abs(daysLeft!)}d` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                    {' · '}{new Date(project.deadline).toLocaleDateString()}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="ghost" size="sm"><Eye className="w-3.5 h-3.5" />View</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(project)}><Pencil className="w-3.5 h-3.5" />Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleting(project)} className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New project">
        <ProjectForm clients={clients} onSave={handleAdd} onCancel={() => setShowAdd(false)} loading={saving} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit project">
        {editing && <ProjectForm initial={editing} clients={clients} onSave={handleEdit} onCancel={() => setEditing(null)} loading={saving} />}
      </Modal>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete project" message={`Delete "${deleting?.name}"? All tasks and files will also be deleted.`} loading={saving} />
    </div>
  )
}
