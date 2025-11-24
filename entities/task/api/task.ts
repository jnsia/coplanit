import { supabase } from '@/lib/supabase'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../model/task'

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getTasksByUserId(userId: number): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .or(`created_by.eq.${userId},assigned_to.eq.me,assigned_to.eq.both`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getMyTasks(userId: number): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'pending')
    .or(`assigned_to.eq.me,assigned_to.eq.both`)
    .eq('created_by', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getTaskById(taskId: number): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (error) throw error
  return data
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(taskId: number, input: UpdateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(taskId: number): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error
}

export async function completeTask(taskId: number, userId: number): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      completed_by: userId,
    })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function cancelTask(taskId: number): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status: 'cancelled' })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}
