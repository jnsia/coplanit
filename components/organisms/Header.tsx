import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import theme from '@/constants/theme'
import { colors } from '@/constants/colors'
import { FontAwesome5 } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { fonts } from '@/constants/fonts'
import { rewarded } from '@/lib/advertisement'
import { useUserByEmail } from '@/features/auth/model/auth-queries'
import { checkAutoLogin } from '@/features/auth/api/auth.api'
import { useQueryClient } from '@tanstack/react-query'
import { userKeys } from '@/features/auth/model/auth-queries'

export default function Header() {
  const [loginEmail, setLoginEmail] = useState<string | null>(null)
  const { data: user, refetch } = useUserByEmail(loginEmail || undefined)
  const queryClient = useQueryClient()

  useEffect(() => {
    const getEmail = async () => {
      const email = await checkAutoLogin()
      setLoginEmail(email)
    }
    getEmail()
  }, [])

  const handleAdsShow = () => {
    try {
      rewarded.show()
    } catch (error) {
      Alert.alert('리워드 광고', '준비된 광고가 없습니다.')
    }
  }

  const handleCoinPress = () => {
    Alert.alert(
      '리워드 광고',
      '광고를 시청하고 100Coin을 획득하시겠습니까?',
      [
        {
          text: '아니요',
        },
        {
          text: '네!',
          onPress: handleAdsShow,
        },
      ],
      { cancelable: false },
    )
  }

  useFocusEffect(
    useCallback(() => {
      if (user) {
        // 화면 포커스 시 사용자 정보 refetch
        refetch()
      }
    }, [user, refetch]),
  )

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.userCoinContainer} onPress={handleCoinPress}>
        <View>
          <View style={styles.coinIcon}>
            <FontAwesome5 name="coins" size={20} color={colors.accent} />
          </View>
          <View style={styles.plusIcon}>
            <FontAwesome5 name="plus" size={12} color={colors.accent} />
          </View>
        </View>
        {user && <Text style={styles.userCoin}>{user.coin} Coin</Text>}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background,
    padding: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 60,
  },
  userCoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 8,
  },
  coinIcon: {
    position: 'relative',
    right: 10,
    top: 5,
  },
  plusIcon: {
    position: 'relative',
    left: 10,
    bottom: 5,
  },
  userCoin: {
    minWidth: 36,
    textAlign: 'right',
    color: colors.accent,
    fontSize: fonts.size.body,
    fontFamily: fonts.defaultBold,
  },
})
