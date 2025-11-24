import { View, Text, StyleSheet, Alert } from 'react-native'
import Modal from '@/components/molecules/Modal'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { spacing, fontSize } from '@/constants/tokens'
import { useTheme } from '@/lib/ThemeProvider'
import type { Task } from '@/entities/task/model/task'

type TaskDetailModalProps = Readonly<{
  visible: boolean
  task: Task | null
  onClose: () => void
  onComplete: (taskId: number) => void
  onCancel: (taskId: number) => void
}>

const assignedToLabels = {
  me: '나',
  partner: '상대방',
  both: '함께',
}

export default function TaskDetailModal({ visible, task, onClose, onComplete, onCancel }: TaskDetailModalProps) {
  const { colors } = useTheme()

  if (!task) return null

  const handleComplete = () => {
    Alert.alert('할일 완료', `"${task.title}"\n이 할일을 완료하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '완료',
        onPress: () => {
          onComplete(task.id)
          onClose()
        },
      },
    ])
  }

  const handleCancel = () => {
    Alert.alert('할일 취소', `"${task.title}"\n이 할일을 취소하시겠습니까?`, [
      { text: '돌아가기', style: 'cancel' },
      {
        text: '취소',
        style: 'destructive',
        onPress: () => {
          onCancel(task.id)
          onClose()
        },
      },
    ])
  }

  return (
    <Modal visible={visible} onClose={onClose} title={task.title}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Badge label={assignedToLabels[task.assigned_to]} variant={task.assigned_to} />
        </View>

        {task.description && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>설명</Text>
            <Text style={[styles.value, { color: colors.text.primary }]}>{task.description}</Text>
          </View>
        )}

        {task.due_date && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>기한</Text>
            <Text style={[styles.value, { color: colors.text.primary }]}>
              {new Date(task.due_date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        )}

        {task.status === 'pending' && (
          <View style={styles.actions}>
            <Button title="완료" onPress={handleComplete} variant="primary" size="lg" fullWidth />
            <Button title="취소" onPress={handleCancel} variant="outline" size="lg" fullWidth />
          </View>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.size16,
  },
  section: {
    gap: spacing.size8,
  },
  label: {
    fontSize: fontSize.sm,
  },
  value: {
    fontSize: fontSize.base,
  },
  actions: {
    marginTop: spacing.size8,
    gap: spacing.size12,
  },
})
