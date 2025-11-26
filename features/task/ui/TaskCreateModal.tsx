import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useState } from 'react'
import Modal from '@/components/molecules/Modal'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import { spacing, fontSize, radius } from '@/shared/constants/tokens'
import { colors as tokenColors } from '@/shared/constants/tokens'
import { useTheme } from '@/lib/ThemeProvider'
import type { TaskAssignedTo } from '@/entities/task/model/task'

type TaskCreateModalProps = Readonly<{
  visible: boolean
  onClose: () => void
  onCreate: (data: {
    title: string
    description: string
    due_date: string
    assigned_to: TaskAssignedTo
  }) => void
}>

const assignedToOptions: { value: TaskAssignedTo; label: string }[] = [
  { value: 'me', label: '나' },
  { value: 'partner', label: '상대방' },
  { value: 'both', label: '함께' },
]

export default function TaskCreateModal({ visible, onClose, onCreate }: TaskCreateModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState<TaskAssignedTo>('me')

  const { colors } = useTheme()

  const handleCreate = () => {
    if (!title.trim()) return

    onCreate({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      assigned_to: assignedTo,
    })

    // Reset form
    setTitle('')
    setDescription('')
    setDueDate('')
    setAssignedTo('me')
  }

  return (
    <Modal visible={visible} onClose={onClose} title='할일 추가'>
      <ScrollView>
        <View style={styles.container}>
          <Input
            label='제목 *'
            value={title}
            onChangeText={setTitle}
            placeholder='할일 제목을 입력하세요'
          />

          <Input
            label='설명 (선택)'
            value={description}
            onChangeText={setDescription}
            placeholder='상세 설명을 입력하세요'
            multiline
            numberOfLines={3}
          />

          <Input
            label='기한 (선택)'
            value={dueDate}
            onChangeText={setDueDate}
            placeholder='YYYY-MM-DD'
          />

          <View>
            <Text style={[styles.label, { color: colors.text.secondary }]}>담당자 *</Text>
            <View style={styles.options}>
              {assignedToOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.option,
                    { borderColor: colors.border.primary },
                    assignedTo === option.value && {
                      backgroundColor: tokenColors.assignment[option.value],
                      borderColor: tokenColors.assignment[option.value],
                    },
                  ]}
                  onPress={() => setAssignedTo(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text.primary },
                      assignedTo === option.value && { color: '#FFFFFF' },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Button
            title='추가'
            onPress={handleCreate}
            variant='primary'
            size='lg'
            fullWidth
            disabled={!title.trim()}
          />
        </View>
      </ScrollView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.size16,
  },
  label: {
    fontSize: fontSize.sm,
    marginBottom: spacing.size8,
  },
  options: {
    flexDirection: 'row',
    gap: spacing.size8,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.size12,
    paddingHorizontal: spacing.size16,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
})
