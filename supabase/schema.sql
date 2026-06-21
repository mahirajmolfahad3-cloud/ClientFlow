-- ============================================================
-- ClientFlow Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- CLIENTS
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  company text,
  phone text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.clients enable row level security;
create policy "users manage own clients" on public.clients
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- PROJECTS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'planning' check (status in ('planning','in_progress','completed','on_hold')),
  deadline date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.projects enable row level security;
create policy "users manage own projects" on public.projects
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TASKS
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.tasks enable row level security;
create policy "users manage own tasks" on public.tasks
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- FILES
create table public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  size bigint,
  mime_type text,
  storage_path text not null,
  created_at timestamptz default now() not null
);
alter table public.files enable row level security;
create policy "users manage own files" on public.files
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- STORAGE BUCKET for project files
insert into storage.buckets (id, name, public) values ('project-files', 'project-files', false)
on conflict (id) do nothing;

create policy "users upload own files" on storage.objects
  for insert with check (bucket_id = 'project-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users read own files" on storage.objects
  for select using (bucket_id = 'project-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users delete own files" on storage.objects
  for delete using (bucket_id = 'project-files' and auth.uid()::text = (storage.foldername(name))[1]);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger clients_updated_at before update on public.clients
  for each row execute function public.handle_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute function public.handle_updated_at();
create trigger tasks_updated_at before update on public.tasks
  for each row execute function public.handle_updated_at();
