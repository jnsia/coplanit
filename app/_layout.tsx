import { Stack, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'
import { QueryClientProvider } from '@tanstack/react-query'
import { StatusBar, StyleSheet } from 'react-native'
import theme from '@/shared/constants/theme'
import { setCustomText } from 'react-native-global-props'
import { useUserByEmail } from '@/features/auth/model/auth-queries'
import { checkAutoLogin } from '@/features/auth/api/auth.api'
import { setNotificationListeners } from '@/shared/lib/pushNotification'
import { ThemeProvider } from '@/shared/lib/ThemeProvider'
import { queryClient } from '@/shared/lib/query-client'

function RootLayoutContent() {
  const [autoLoginEmail, setAutoLoginEmail] = useState<string | null>(null)
  const { data: user } = useUserByEmail(autoLoginEmail || undefined)

  const router = useRouter()

  useEffect(() => {
    setNotificationListeners()
  }, [])

  // const [loaded, error] = useFonts({
  //   pretendard: require('@/assets/fonts/Pretendard-Regular.ttf'),
  //   pretendardBold: require('@/assets/fonts/Pretendard-Bold.ttf'),
  // })

  // 자동 로그인 체크
  useEffect(() => {
    const checkLogin = async () => {
      const email = await checkAutoLogin()
      setAutoLoginEmail(email)
    }
    checkLogin()
  }, [])

  // 로그인 상태에 따른 라우팅
  useEffect(() => {
    // if (!loaded) return

    if (autoLoginEmail && user) {
      if (user.loveId == null) {
        router.replace('/auth/connect')
      } else {
        router.replace('/(tabs)/(index)')
      }
    } else if (autoLoginEmail === null || !user) {
      router.replace('/auth')
    }

    // if (loaded || error) {
    //   SplashScreen.hideAsync()
    // }
  }, [user, autoLoginEmail])

  // 리워드 광고 설정
  useEffect(() => {
    if (user) {
      // setRewardAdvertisement(user, async (email: string) => {
      //   // 사용자 정보 갱신은 React Query가 자동으로 처리
      //   return user
      // })
    }
  }, [user])

  // if (!loaded && !error) {
  //   return null
  // }

  const customTextProps = {
    style: {
      fontFamily: 'pretendard',
    },
  }

  setCustomText(customTextProps)

  return (
    <ThemeProvider>
      <StatusBar
        barStyle='light-content' // 상태바 아이콘을 밝게 표시
        translucent={true} // 상태바를 투명하게 설정
        backgroundColor='transparent' // 상태바의 배경을 투명하게 설정
      />
      <Stack screenOptions={{ headerShown: false, contentStyle: styles.container }}>
        <Stack.Screen name='auth' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='+not-found' />
      </Stack>
      {/* <BannerAdvertisement /> */}
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight, // 상태바 높이만큼 패딩 추가 (모든 화면에 적용)
    backgroundColor: theme.colors.background,
  },
})

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
