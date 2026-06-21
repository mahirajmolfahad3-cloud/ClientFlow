// lib/validations.ts
import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  client_id: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(['planning', 'in_progress', 'completed', 'on_hold']),
  deadline: z.string().optional().or(z.literal('')),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional().or(z.literal('')),
  project_id: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.string().optional().or(z.literal('')),
})

export type ClientFormData = z.infer<typeof clientSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type TaskFormData = z.infer<typeof taskSchema>
