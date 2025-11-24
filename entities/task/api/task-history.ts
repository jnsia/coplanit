import { supabase } from '@/lib/supabase'

export type TaskHistory = {
  id: number
  task_id: number
  action: 'created' | 'completed' | 'cancelled' | 'updated'
  user_id: number
  metadata: Record<string, any> | null
  created_at: string
}

export async function getTaskHistories(userId: number): Promise<TaskHistory[]> {
  const { data, error } = await supabase
    .from('task_histories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getTaskHistoriesByTaskId(taskId: number): Promise<TaskHistory[]> {
  const { data, error } = await supabase
    .from('task_histories')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTaskHistory(
  taskId: number,
  action: TaskHistory['action'],
  userId: number,
  metadata?: Record<string, any>,
): Promise<TaskHistory> {
  const { data, error } = await supabase
    .from('task_histories')
    .insert({
      task_id: taskId,
      action,
      user_id: userId,
      metadata,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
