'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Project, Task, ProjectFile } from '@/types'
import { PageLoader, ProjectStatusBadge, PriorityBadge, Button, Badge } from '@/components/ui'
import { ArrowLeft, Calendar, Upload, Trash2, FileText, Download, CheckSquare, Clock } from 'lucide-react'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function load() {
    const [{ data: p }, { data: t }, { data: f }] = await Promise.all([
      supabase.from('projects').select('*, clients(name, company)').eq('id', id).single(),
      supabase.from('tasks').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      supabase.from('files').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    ])
    if (!p) { router.push('/projects'); return }
    setProject(p)
    setTasks(t ?? [])
    setFiles(f ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const path = `${session!.user.id}/${id}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('project-files').upload(path, file)
    if (!error) {
      await supabase.from('files').insert({
        user_id: session!.user.id,
        project_id: id,
        name: file.name,
        size: file.size,
        mime_type: file.type,
        storage_path: path,
      })
      await load()
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDeleteFile(file: ProjectFile) {
    await supabase.storage.from('project-files').remove([file.storage_path])
    await supabase.from('files').delete().eq('id', file.id)
    setFiles(prev => prev.filter(f => f.id !== file.id))
  }

  async function handleDownload(file: ProjectFile) {
    const { data } = await supabase.storage.from('project-files').createSignedUrl(file.storage_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  if (loading) return <PageLoader />
  if (!project) return null

  const client = project.clients as any
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const progress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <Link href="/projects"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" />Projects</Button></Link>

      {/* Project header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold text-gray-900">{project.name}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            {client && <p className="text-sm text-gray-500">{client.name}{client.company ? ` · ${client.company}` : ''}</p>}
          </div>
        </div>
        {project.description && <p className="text-sm text-gray-600 mb-4">{project.description}</p>}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {project.deadline && (
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" />
              Due {new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          <span className="flex items-center gap-1.5"><CheckSquare className="w-4 h-4 text-gray-400" />{doneTasks}/{tasks.length} tasks done</span>
        </div>
        {tasks.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span>{progress}%</span></div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-gray-400" />Tasks ({tasks.length})</h2>
            <Link href="/tasks"><Button size="sm" variant="secondary">Manage tasks</Button></Link>
          </div>
          {tasks.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No tasks for this project.</div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'done' ? 'bg-green-500' : task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                  <span className={`text-sm flex-1 truncate ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</span>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" />Files ({files.length})</h2>
            <div>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
              <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} loading={uploading}>
                <Upload className="w-3.5 h-3.5" />Upload
              </Button>
            </div>
          </div>
          {files.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No files yet. Upload project assets.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {files.map(file => (
                <div key={file.id} className="flex items-center gap-3 px-5 py-3">
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    {file.size && <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDownload(file)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Download className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteFile(file)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
