import { supabase } from '@/shared/lib/supabase'
import { user } from '../model/user'

export async function getCurrentUser(): Promise<user | null> {
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser()

  if (error || !authUser) {
    console.error('Error fetching user:', error?.message)
    return null
  }

  // Auth user에서 이메일을 가져와 실제 user 정보 조회
  if (authUser.email) {
    return getUserByEmail(authUser.email)
  }

  return null
}

export async function getUserById(userId: number): Promise<user | null> {
  const { data, error } = await supabase.from('users').select().eq('id', userId).single()

  if (error) {
    console.error('Error fetching user:', error.message)
    return null
  }

  return data
}

export async function getUserByEmail(email: string): Promise<user | null> {
  const { data, error } = await supabase.from('users').select().eq('email', email).single()

  if (error) {
    console.error('Error fetching user:', error.message)
    return null
  }

  return data
}

export async function updateUserFcmToken(userId: number, token: string | null): Promise<void> {
  const { error } = await supabase.from('users').update({ fcmToken: token }).eq('id', userId)

  if (error) {
    console.error('Error updating FCM token:', error.message)
    throw error
  }
}

export async function getLoveFcmToken(loveId: number): Promise<string | null> {
  const { data, error } = await supabase.from('users').select('fcmToken').eq('id', loveId).single()

  if (error) {
    console.error('Error fetching love FCM token:', error.message)
    return null
  }

  return data?.fcmToken || null
}

export async function updateUserNickname(userId: number, nickname: string): Promise<void> {
  const { error } = await supabase.from('users').update({ nickname }).eq('id', userId)

  if (error) {
    console.error('Error updating nickname:', error.message)
    throw error
  }
}
