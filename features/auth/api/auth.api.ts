import { supabase } from '@/shared/lib/supabase'
import { registerForPushNotificationsAsync } from '@/shared/lib/pushNotification'
import { updateUserFcmToken } from '@/entities/user/api/user.api'
import { user } from '@/entities/user/model/user'
import AsyncStorage from '@react-native-async-storage/async-storage'

type SignInParams = {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInParams): Promise<user | null> {
  try {
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      console.error('Auth error:', authError.message)
      return null
    }

    const { data, error: userError } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single()

    if (userError || !data) {
      console.error('User fetch error:', userError?.message)
      return null
    }

    const fetchedUser: user = data

    await AsyncStorage.setItem('isLoggedInLoveMission', fetchedUser.email)

    // FCM 토큰 발급 및 저장
    const token = await registerForPushNotificationsAsync()

    if (token) {
      await updateUserFcmToken(fetchedUser.id, token)
      fetchedUser.fcmToken = token
    }

    return fetchedUser
  } catch (error: any) {
    console.error('로그인 중 에러:', error.message)
    return null
  }
}

export async function signOut(userId: number): Promise<void> {
  await AsyncStorage.removeItem('isLoggedInLoveMission')
  await updateUserFcmToken(userId, null)
  await supabase.auth.signOut()
}

export async function checkAutoLogin(): Promise<string | null> {
  return await AsyncStorage.getItem('isLoggedInLoveMission')
}
