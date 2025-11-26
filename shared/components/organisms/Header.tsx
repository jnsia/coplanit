import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import theme from '@/shared/constants/theme'
import { colors } from '@/shared/constants/colors'
import { FontAwesome5 } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { fonts } from '@/shared/constants/fonts'
import { useUserByEmail } from '@/features/auth/model/auth-queries'
import { checkAutoLogin } from '@/features/auth/api/auth.api'

export default function Header() {
  const [loginEmail, setLoginEmail] = useState<string | null>(null)
  const { data: user, refetch } = useUserByEmail(loginEmail || undefined)

  useEffect(() => {
    const getEmail = async () => {
      const email = await checkAutoLogin()
      setLoginEmail(email)
    }
    getEmail()
  }, [])

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
      <TouchableOpacity style={styles.userCoinContainer}>
        <View>
          <View style={styles.coinIcon}>
            <FontAwesome5 name='coins' size={20} color={colors.accent} />
          </View>
          <View style={styles.plusIcon}>
            <FontAwesome5 name='plus' size={12} color={colors.accent} />
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
