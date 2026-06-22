'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Users, FolderOpen, CheckSquare, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { PageLoader, ProjectStatusBadge, PriorityBadge } from '@/components/ui'
import type { Client, Project, Task } from '@/types'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')


  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.replace('/login')
      }
    }

    check()
  }, [router])

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUserName(session.user.user_metadata?.full_name?.split(' ')[0] ?? 'there')

      const [c, p, t] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*, clients(name, company)').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      ])
      setClients(c.data ?? [])
      setProjects(p.data ?? [])
      setTasks(t.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <PageLoader />

  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const openTasks = tasks.filter(t => t.status !== 'done').length
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done')
  const recentProjects = projects.slice(0, 5)
  const upcomingDeadlines = projects
    .filter(p => p.deadline && p.status !== 'completed')
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3)

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'bg-blue-50 text-blue-600', change: '+2 this month' },
    { label: 'Active Projects', value: activeProjects, icon: FolderOpen, color: 'bg-indigo-50 text-indigo-600', change: `${projects.length} total` },
    { label: 'Open Tasks', value: openTasks, icon: CheckSquare, color: 'bg-purple-50 text-purple-600', change: `${tasks.filter(t => t.status === 'done').length} completed` },
    { label: 'High Priority', value: highPriorityTasks.length, icon: AlertCircle, color: 'bg-red-50 text-red-600', change: 'needs attention' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Good morning, {userName} 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your business today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <div className={`p-2 rounded-lg ${color}`}><Icon className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />{change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="p-8 text-center">
              <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No projects yet.</p>
              <Link href="/projects" className="text-sm text-indigo-600 font-medium mt-1 inline-block">Create your first project →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentProjects.map(project => (
                <Link key={project.id} href={`/projects/${project.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{project.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(project.clients as any)?.name ?? 'No client'}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {project.deadline && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <ProjectStatusBadge status={project.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming deadlines */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Upcoming Deadlines</h2>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <div className="p-5 text-center text-sm text-gray-400">No upcoming deadlines</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {upcomingDeadlines.map(p => {
                  const daysLeft = Math.ceil((new Date(p.deadline!).getTime() - Date.now()) / 86400000)
                  return (
                    <div key={p.id} className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className={`text-xs mt-0.5 font-medium ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-yellow-600' : 'text-gray-400'}`}>
                        {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* High priority tasks */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">High Priority Tasks</h2>
            </div>
            {highPriorityTasks.length === 0 ? (
              <div className="p-5 text-center text-sm text-gray-400">All clear! 🎉</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {highPriorityTasks.slice(0, 4).map(task => (
                  <div key={task.id} className="px-5 py-3.5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <p className="text-sm text-gray-700 truncate flex-1">{task.title}</p>
                    <PriorityBadge priority={task.priority} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 space-y-2">
            <h2 className="font-semibold text-indigo-900 text-sm">Quick Actions</h2>
            {[
              { href: '/clients', label: '+ Add a client' },
              { href: '/projects', label: '+ New project' },
              { href: '/tasks', label: '+ Create a task' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="block text-sm text-indigo-700 hover:text-indigo-900 font-medium py-1 hover:underline transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
