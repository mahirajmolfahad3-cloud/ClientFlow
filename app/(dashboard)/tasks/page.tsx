'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, type TaskFormData } from '@/lib/validations'
import type { Task } from '@/types'
import { Button, Input, Textarea, Select, Modal, PageLoader, ConfirmDialog, PriorityBadge } from '@/components/ui'
import { Plus, Pencil, Trash2, Calendar, ChevronRight } from 'lucide-react'

type ProjectOption = {
  id: string
  name: string
}

const COLUMNS: { key: Task['status']; label: string; color: string; dot: string }[] = [
  { key: 'todo', label: 'To Do', color: 'bg-gray-50 border-gray-200', dot: 'bg-gray-400' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  { key: 'done', label: 'Done', color: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
]

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

function TaskForm({ initial, projects, onSave, onCancel, loading }: {
  initial?: Partial<Task>
  projects: ProjectOption[]
  onSave: (data: TaskFormData) => void
  onCancel: () => void
  loading: boolean
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      project_id: initial?.project_id ?? '',
      status: initial?.status ?? 'todo',
      priority: initial?.priority ?? 'medium',
      due_date: initial?.due_date ?? '',
    },
  })

  const projectOptions = [
    { value: '', label: 'No project' },
    ...projects.map(p => ({ value: p.id, label: p.name })),
  ]

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Input label="Task title *" placeholder="Write homepage copy" error={errors.title?.message} {...register('title')} />
      <Textarea label="Description" placeholder="What needs to be done?" error={errors.description?.message} {...register('description')} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
        <Select label="Priority" options={PRIORITY_OPTIONS} error={errors.priority?.message} {...register('priority')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Project" options={projectOptions} error={errors.project_id?.message} {...register('project_id')} />
        <Input label="Due date" type="date" error={errors.due_date?.message} {...register('due_date')} />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial?.id ? 'Save changes' : 'Create task'}</Button>
      </div>
    </form>
  )
}

function TaskCard({ task, onEdit, onDelete, onMove }: {
  task: Task
  onEdit: (t: Task) => void
  onDelete: (t: Task) => void
  onMove: (t: Task, status: Task['status']) => void
}) {
  const nextStatus: Record<Task['status'], Task['status'] | null> = {
    todo: 'in_progress',
    in_progress: 'done',
    done: null,
  }
  const next = nextStatus[task.status]
  const nextLabel: Record<string, string> = { in_progress: 'Start', done: 'Complete' }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`text-sm font-semibold text-gray-900 leading-snug ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button onClick={() => onEdit(task)} className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={() => onDelete(task)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      {task.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>}
      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={task.priority} />
        {task.due_date && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      {next && (
        <button onClick={() => onMove(task, next)}
          className="mt-3 w-full text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-100">
          {nextLabel[next]} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [defaultStatus, setDefaultStatus] = useState<Task['status']>('todo')
  const [editing, setEditing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const [{ data: t }, { data: p }] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name').order('name'),
    ])
    setTasks(t ?? [])
    setProjects(p ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  

  async function handleAdd(data: TaskFormData) {
    setSaving(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return

      const { error } = await supabase.from('tasks').insert({
        ...data,
        user_id: session.user.id,
        project_id: data.project_id || null,
        due_date: data.due_date || null,
      })

      if (error) {
        console.error(error)
        return
      }

      await load()
      setShowAdd(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(data: TaskFormData) {
    if (!editing) return

    setSaving(true)

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...data,
          project_id: data.project_id || null,
          due_date: data.due_date || null,
        })
        .eq('id', editing.id)

      if (error) {
        console.error(error)
        return
      }

      await load()
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleting) return

    setSaving(true)

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', deleting.id)

      if (error) {
        console.error(error)
        return
      }

      await load()
      setDeleting(null)
    } finally {
      setSaving(false)
    }
  }




  async function handleMove(task: Task, status: Task['status']) {
    await supabase.from('tasks').update({ status }).eq('id', task.id)
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status } : t))
  }

  function openAdd(status: Task['status']) {
    setDefaultStatus(status)
    setShowAdd(true)
  }

  if (loading) return <PageLoader />

  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'done').length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1 text-sm">{doneTasks}/{totalTasks} tasks completed</p>
        </div>
        <Button onClick={() => openAdd('todo')}><Plus className="w-4 h-4" />New task</Button>
      </div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Overall progress</span>
            <span className="font-semibold text-indigo-600">{Math.round((doneTasks / totalTasks) * 100)}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(doneTasks / totalTasks) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key)
          return (
            <div key={col.key} className={`rounded-xl border p-4 ${col.color} kanban-col`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <h3 className="font-semibold text-gray-800 text-sm">{col.label}</h3>
                  <span className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <button onClick={() => openAdd(col.key)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    No tasks here.<br />
                    <button onClick={() => openAdd(col.key)} className="text-indigo-500 hover:underline mt-1 inline-block">Add one</button>
                  </div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={setEditing} onDelete={setDeleting} onMove={handleMove} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New task">
        <TaskForm
          initial={{ status: defaultStatus }}
          projects={projects}
          onSave={handleAdd}
          onCancel={() => setShowAdd(false)}
          loading={saving}
        />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit task">
        {editing && (
          <TaskForm initial={editing} projects={projects} onSave={handleEdit} onCancel={() => setEditing(null)} loading={saving} />
        )}
      </Modal>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete task" message={`Delete "${deleting?.title}"?`} loading={saving} />
    </div>
  )
}
