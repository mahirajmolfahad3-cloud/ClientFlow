'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientSchema, type ClientFormData } from '@/lib/validations'
import type { Client } from '@/types'
import { Button, Input, Textarea, Modal, EmptyState, PageLoader, ConfirmDialog, Card } from '@/components/ui'
import { Users, Plus, Search, Mail, Phone, Building2, Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

function ClientForm({ initial, onSave, onCancel, loading }: {
  initial?: Partial<Client>
  onSave: (data: ClientFormData) => void
  onCancel: () => void
  loading: boolean
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
      company: initial?.company ?? '',
      phone: initial?.phone ?? '',
      notes: initial?.notes ?? '',
    },
  })
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Input label="Full name *" placeholder="Jane Smith" error={errors.name?.message} {...register('name')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Email" type="email" placeholder="jane@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" placeholder="+1 555 000 0000" error={errors.phone?.message} {...register('phone')} />
      </div>
      <Input label="Company" placeholder="Acme Inc." error={errors.company?.message} {...register('company')} />
      <Textarea label="Notes" placeholder="Any notes about this client…" error={errors.notes?.message} {...register('notes')} />
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial?.id ? 'Save changes' : 'Add client'}</Button>
      </div>
    </form>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [deleting, setDeleting] = useState<Client | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    setClients(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(data: ClientFormData) {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('clients').insert({ ...data, user_id: session!.user.id })
    await load()
    setShowAdd(false)
    setSaving(false)
  }

  async function handleEdit(data: ClientFormData) {
    if (!editing) return
    setSaving(true)
    await supabase.from('clients').update(data).eq('id', editing.id)
    await load()
    setEditing(null)
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleting) return
    setSaving(true)
    await supabase.from('clients').delete().eq('id', deleting.id)
    await load()
    setDeleting(null)
    setSaving(false)
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1 text-sm">{clients.length} total client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowAdd(true)} size="md">
          <Plus className="w-4 h-4" /> Add client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search clients…"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10" />}
          title={search ? 'No clients found' : 'No clients yet'}
          description={search ? 'Try a different search term.' : 'Add your first client to get started.'}
          action={!search ? <Button onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" />Add your first client</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => (
            <Card key={client.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{client.name}</p>
                    {client.company && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3" />{client.company}</p>}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                {client.email && <p className="text-xs text-gray-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{client.email}</p>}
                {client.phone && <p className="text-xs text-gray-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{client.phone}</p>}
              </div>
              {client.notes && <p className="text-xs text-gray-400 mb-4 line-clamp-2 border-t border-gray-50 pt-3">{client.notes}</p>}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Link href={`/clients/${client.id}`}>
                  <Button variant="ghost" size="sm"><Eye className="w-3.5 h-3.5" />View</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setEditing(client)}><Pencil className="w-3.5 h-3.5" />Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleting(client)} className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add new client">
        <ClientForm onSave={handleAdd} onCancel={() => setShowAdd(false)} loading={saving} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit client">
        {editing && <ClientForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} loading={saving} />}
      </Modal>
      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete client" message={`Delete "${deleting?.name}"? This cannot be undone.`} loading={saving}
      />
    </div>
  )
}
