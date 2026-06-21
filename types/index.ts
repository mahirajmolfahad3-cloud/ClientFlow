// types/index.ts

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  company: string | null
  phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  client_id: string | null
  name: string
  description: string | null
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  deadline: string | null
  created_at: string
  updated_at: string
  clients?: Pick<Client, 'id' | 'name' | 'company'> | null
}

export interface Task {
  id: string
  user_id: string
  project_id: string | null
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  created_at: string
  updated_at: string
  projects?: Pick<Project, 'id' | 'name'> | null
}

export interface ProjectFile {
  id: string
  user_id: string
  project_id: string
  name: string
  size: number | null
  mime_type: string | null
  storage_path: string
  created_at: string
}

export type ProjectStatus = Project['status']
export type TaskStatus = Task['status']
export type TaskPriority = Task['priority']
