export type TaskAssignedTo = 'me' | 'partner' | 'both'
export type TaskStatus = 'pending' | 'completed' | 'cancelled'

export type Task = {
  id: number
  title: string
  description: string | null
  due_date: string | null
  assigned_to: TaskAssignedTo
  created_by: number
  status: TaskStatus
  completed_at: string | null
  completed_by: number | null
  created_at: string
  updated_at: string
}

export type CreateTaskInput = {
  title: string
  description?: string
  due_date?: string
  assigned_to: TaskAssignedTo
  created_by: number
}

export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
