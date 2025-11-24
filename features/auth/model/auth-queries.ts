import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { signIn, signOut } from '../api/auth.api'
import { getUserById, getUserByEmail, getLoveFcmToken } from '@/entities/user/api/user.api'
import { router } from 'expo-router'

// Query Keys
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  byId: (id: number) => [...userKeys.all, 'byId', id] as const,
  byEmail: (email: string) => [...userKeys.all, 'byEmail', email] as const,
  loveFcmToken: (loveId: number) => [...userKeys.all, 'loveFcmToken', loveId] as const,
}

// 현재 사용자 정보 조회
export function useCurrentUser(userId?: number) {
  return useQuery({
    queryKey: userKeys.byId(userId!),
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })
}

// 이메일로 사용자 조회
export function useUserByEmail(email?: string) {
  return useQuery({
    queryKey: userKeys.byEmail(email!),
    queryFn: () => getUserByEmail(email!),
    enabled: !!email,
  })
}

// 연인 FCM 토큰 조회
export function useLoveFcmToken(loveId?: number) {
  return useQuery({
    queryKey: userKeys.loveFcmToken(loveId!),
    queryFn: () => getLoveFcmToken(loveId!),
    enabled: !!loveId,
  })
}

// 로그인 mutation
export function useSignIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signIn,
    onSuccess: (user) => {
      if (user) {
        // 사용자 정보를 캐시에 저장
        queryClient.setQueryData(userKeys.byId(user.id), user)
        queryClient.setQueryData(userKeys.byEmail(user.email), user)
      }
    },
  })
}

// 로그아웃 mutation
export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // 모든 사용자 관련 캐시 제거
      queryClient.removeQueries({ queryKey: userKeys.all })
      router.replace('/auth/signIn')
    },
  })
}
