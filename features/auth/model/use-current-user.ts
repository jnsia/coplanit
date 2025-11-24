import { useState, useEffect } from 'react'
import { useUserByEmail } from './auth-queries'
import { checkAutoLogin } from '../api/auth.api'

/**
 * 현재 로그인한 사용자 정보를 가져오는 훅
 * AsyncStorage에서 자동 로그인 이메일을 확인하고, 해당 사용자 정보를 React Query로 가져옵니다.
 */
export function useCurrentUser() {
  const [loginEmail, setLoginEmail] = useState<string | null>(null)
  const { data: user, isLoading, refetch } = useUserByEmail(loginEmail || undefined)

  useEffect(() => {
    const getEmail = async () => {
      const email = await checkAutoLogin()
      setLoginEmail(email)
    }
    getEmail()
  }, [])

  return {
    user: user || null,
    isLoading,
    refetch,
  }
}
