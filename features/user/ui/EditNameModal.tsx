import { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native'
import Modal from '@/shared/components/molecules/Modal'
import Button from '@/shared/components/atoms/Button'
import { spacing, fontSize } from '@/shared/constants/tokens'
import { useTheme } from '@/shared/lib/ThemeProvider'
import { updateUserNickname } from '@/entities/user/api/user.api'

type EditNameModalProps = Readonly<{
  visible: boolean
  currentName: string
  userId: number
  onClose: () => void
  onSuccess: () => void
}>

export default function EditNameModal({
  visible,
  currentName,
  userId,
  onClose,
  onSuccess,
}: EditNameModalProps) {
  const [name, setName] = useState(currentName)
  const [isLoading, setIsLoading] = useState(false)
  const { colors } = useTheme()

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('오류', '이름을 입력하세요')
      return
    }

    try {
      setIsLoading(true)
      await updateUserNickname(userId, name.trim())
      Alert.alert('성공', '이름이 변경되었습니다')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to update name:', error)
      Alert.alert('오류', '이름 변경에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal visible={visible} onClose={onClose} title='이름 변경'>
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.text.secondary }]}>새 이름</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background.secondary,
              color: colors.text.primary,
              borderColor: colors.border.primary,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder='이름을 입력하세요'
          placeholderTextColor={colors.text.tertiary}
          autoFocus
        />

        <View style={styles.buttons}>
          <Button title='취소' variant='outline' onPress={onClose} />
          <Button title='저장' onPress={handleSave} disabled={isLoading} loading={isLoading} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.size16,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  input: {
    padding: spacing.size12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: fontSize.base,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.size12,
    marginTop: spacing.size8,
  },
})
