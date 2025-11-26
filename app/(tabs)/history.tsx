import { useCallback, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useCurrentUser } from '@/features/auth/model/use-current-user'
import { useTheme } from '@/lib/ThemeProvider'
import { spacing, fontSize } from '@/shared/constants/tokens'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import { getTasks } from '@/entities/task/api/task'
import type { Task } from '@/entities/task/model/task'

const actionLabels = {
  completed: '완료됨',
  cancelled: '취소됨',
}

export default function HistoryScreen() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [cancelledTasks, setCancelledTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useCurrentUser()
  const { colors } = useTheme()

  const fetchHistory = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const data = await getTasks()

      const completed = data.filter((task) => task.status === 'completed')
      const cancelled = data.filter((task) => task.status === 'cancelled')

      setCompletedTasks(completed)
      setCancelledTasks(cancelled)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!user) return
      fetchHistory()
    }, [user]),
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {/* 완료된 할일 */}
          {completedTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>완료된 할일</Text>
              {completedTasks.map((task) => (
                <Card key={task.id}>
                  <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
                      {task.title}
                    </Text>
                    <Badge label={actionLabels.completed} variant='completed' />
                  </View>
                  {task.completed_at && (
                    <Text style={[styles.date, { color: colors.text.tertiary }]}>
                      {new Date(task.completed_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  )}
                </Card>
              ))}
            </View>
          )}

          {/* 취소된 할일 */}
          {cancelledTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>취소된 할일</Text>
              {cancelledTasks.map((task) => (
                <Card key={task.id}>
                  <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
                      {task.title}
                    </Text>
                    <Badge label={actionLabels.cancelled} variant='cancelled' />
                  </View>
                  <Text style={[styles.date, { color: colors.text.tertiary }]}>
                    {new Date(task.updated_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Card>
              ))}
            </View>
          )}

          {completedTasks.length === 0 && cancelledTasks.length === 0 && (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                이력이 없습니다
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.size16,
    gap: spacing.size16,
  },
  section: {
    gap: spacing.size12,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.size8,
  },
  title: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginRight: spacing.size8,
  },
  date: {
    fontSize: fontSize.xs,
  },
  empty: {
    paddingVertical: spacing.size64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.lg,
  },
})
