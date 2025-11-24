import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCurrentUser } from '@/features/auth/model/use-current-user'
import { useSignOut } from '@/features/auth/model/auth-queries'
import { useTheme } from '@/lib/ThemeProvider'
import { spacing, fontSize, radius, colors as tokenColors } from '@/constants/tokens'
import Card from '@/components/atoms/Card'
import EditNameModal from '@/features/user/ui/EditNameModal'

export default function SettingScreen() {
  const { user, refetch } = useCurrentUser()
  const { mutate: signOut } = useSignOut()
  const { theme, colors, toggleTheme } = useTheme()
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false)

  const handleLogout = () => {
    if (!user?.id) return

    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => signOut(user.id),
      },
    ])
  }

  if (!user) return null

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info */}
        <Card onPress={() => setIsEditNameModalVisible(true)}>
          <View style={styles.userInfo}>
            <FontAwesome name="user-circle" size={48} color={colors.text.tertiary} />
            <Text style={[styles.userName, { color: colors.text.primary }]}>{user.nickname || '사용자'}</Text>
            <Text style={[styles.userEmail, { color: colors.text.tertiary }]}>{user.email}</Text>
            <Text style={[styles.editHint, { color: colors.text.tertiary }]}>탭하여 이름 변경</Text>
          </View>
        </Card>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>설정</Text>

          {/* Theme Toggle */}
          <Pressable
            style={[styles.settingItem, { backgroundColor: colors.background.primary, borderColor: colors.border.primary }]}
            onPress={toggleTheme}
          >
            <View style={styles.settingLeft}>
              <FontAwesome name={theme === 'light' ? 'sun-o' : 'moon-o'} size={20} color={colors.text.primary} />
              <Text style={[styles.settingText, { color: colors.text.primary }]}>
                {theme === 'light' ? '라이트 모드' : '다크 모드'}
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={colors.text.tertiary} />
          </Pressable>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>계정</Text>

          <Pressable
            style={[styles.settingItem, { backgroundColor: colors.background.primary, borderColor: colors.border.primary }]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <FontAwesome name="sign-out" size={20} color={tokenColors.semantic.error} />
              <Text style={[styles.settingText, { color: tokenColors.semantic.error }]}>로그아웃</Text>
            </View>
          </Pressable>
        </View>

        {/* App Info */}
        <View style={[styles.appInfo, { borderTopColor: colors.border.primary }]}>
          <Text style={[styles.appInfoText, { color: colors.text.tertiary }]}>CoPlanIt v1.0.0</Text>
        </View>
      </ScrollView>

      <EditNameModal
        visible={isEditNameModalVisible}
        currentName={user.nickname || ''}
        userId={user.id}
        onClose={() => setIsEditNameModalVisible(false)}
        onSuccess={() => refetch()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.size16,
    gap: spacing.size24,
  },
  userInfo: {
    alignItems: 'center',
    gap: spacing.size8,
    paddingVertical: spacing.size16,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: fontSize.sm,
  },
  editHint: {
    fontSize: fontSize.xs,
    marginTop: spacing.size4,
  },
  section: {
    gap: spacing.size12,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    paddingHorizontal: spacing.size4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.size16,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.size12,
  },
  settingText: {
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  appInfo: {
    paddingTop: spacing.size24,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: fontSize.xs,
  },
})
