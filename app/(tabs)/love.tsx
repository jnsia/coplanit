import { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { Calendar, DateData } from 'react-native-calendars'
import { useCurrentUser } from '@/features/auth/model/use-current-user'
import { useTheme } from '@/lib/ThemeProvider'
import { spacing, fontSize, radius, colors as tokenColors } from '@/constants/tokens'
import TaskCard from '@/components/molecules/TaskCard'
import TaskDetailModal from '@/features/task/ui/TaskDetailModal'
import TaskCreateModal from '@/features/task/ui/TaskCreateModal'
import type { Task } from '@/entities/task/model/task'
import { getTasks, createTask, completeTask, cancelTask } from '@/entities/task/api/task'
import { getUserById } from '@/entities/user/api/user.api'
import type { user } from '@/entities/user/model/user'

type ViewMode = 'list' | 'calendar'

export default function AllTasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [partner, setPartner] = useState<user | null>(null)

  const { user } = useCurrentUser()
  const { colors } = useTheme()

  const fetchPartner = async () => {
    if (!user?.partner_id) return

    try {
      const partnerData = await getUserById(user.partner_id)
      setPartner(partnerData)
    } catch (error) {
      console.error('Failed to fetch partner:', error)
    }
  }

  const fetchTasks = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const data = await getTasks()
      // 나와 상대방의 pending 상태 작업만 필터링하고 createdAt으로 정렬
      const filteredTasks = data
        .filter(
          (task) =>
            task.status === 'pending' &&
            (task.assigned_to === 'me' || task.assigned_to === 'partner'),
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setTasks(filteredTasks)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task)
    setIsDetailModalVisible(true)
  }

  const handleCreate = async (data: {
    title: string
    description: string
    due_date: string
    assigned_to: 'me' | 'partner' | 'both'
  }) => {
    if (!user?.id) return

    try {
      await createTask({
        ...data,
        created_by: user.id,
      })
      await fetchTasks()
      setIsCreateModalVisible(false)
      Alert.alert('성공', '할일이 추가되었습니다.')
    } catch (error) {
      console.error('Failed to create task:', error)
      Alert.alert('오류', '할일 추가에 실패했습니다.')
    }
  }

  const handleComplete = async (taskId: number) => {
    if (!user?.id) return

    try {
      await completeTask(taskId, user.id)
      await fetchTasks()
    } catch (error) {
      console.error('Failed to complete task:', error)
      Alert.alert('오류', '할일 완료에 실패했습니다.')
    }
  }

  const handleCancel = async (taskId: number) => {
    try {
      await cancelTask(taskId)
      await fetchTasks()
    } catch (error) {
      console.error('Failed to cancel task:', error)
      Alert.alert('오류', '할일 취소에 실패했습니다.')
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!user) return
      fetchPartner()
      fetchTasks()
    }, [user]),
  )

  // 날짜별 작업 그룹화
  const markedDates = tasks.reduce((acc, task) => {
    if (task.due_date) {
      const dateKey = task.due_date.split('T')[0]
      acc[dateKey] = { marked: true, dotColor: tokenColors.foundation.primary }
    }
    return acc
  }, {} as Record<string, { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string }>)

  // 선택된 날짜 표시
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: tokenColors.foundation.primary,
    }
  }

  // 선택된 날짜의 작업 필터링
  const filteredTasksByDate = selectedDate
    ? tasks.filter((task) => task.due_date && task.due_date.startsWith(selectedDate))
    : []

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      {/* View Mode Toggle */}
      <View style={[styles.toggleContainer, { backgroundColor: colors.background.primary }]}>
        <Pressable
          style={[
            styles.toggleButton,
            viewMode === 'list' && { backgroundColor: tokenColors.foundation.primary },
          ]}
          onPress={() => setViewMode('list')}
        >
          <FontAwesome
            name='list'
            size={18}
            color={viewMode === 'list' ? '#FFFFFF' : colors.text.tertiary}
          />
        </Pressable>
        <Pressable
          style={[
            styles.toggleButton,
            viewMode === 'calendar' && { backgroundColor: tokenColors.foundation.primary },
          ]}
          onPress={() => setViewMode('calendar')}
        >
          <FontAwesome
            name='calendar'
            size={18}
            color={viewMode === 'calendar' ? '#FFFFFF' : colors.text.tertiary}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View>
      ) : viewMode === 'list' ? (
        <ScrollView contentContainerStyle={styles.list}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                dueDate={task.due_date}
                assignedTo={task.assigned_to}
                status={task.status}
                onPress={() => handleTaskPress(task)}
                myName={user?.nickname || '나'}
                partnerName={partner?.nickname || '상대방'}
              />
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                할일이 없습니다
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day: DateData) => {
              setSelectedDate(day.dateString)
            }}
            theme={{
              backgroundColor: colors.background.primary,
              calendarBackground: colors.background.primary,
              textSectionTitleColor: colors.text.secondary,
              selectedDayBackgroundColor: tokenColors.foundation.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: tokenColors.foundation.primary,
              dayTextColor: colors.text.primary,
              textDisabledColor: colors.text.tertiary,
              dotColor: tokenColors.foundation.primary,
              selectedDotColor: '#FFFFFF',
              arrowColor: tokenColors.foundation.primary,
              monthTextColor: colors.text.primary,
            }}
          />

          {/* 선택된 날짜의 작업 목록 */}
          <ScrollView
            style={styles.calendarTaskList}
            contentContainerStyle={styles.calendarTaskListContent}
          >
            {selectedDate && (
              <Text style={[styles.calendarDateTitle, { color: colors.text.primary }]}>
                {selectedDate}의 할일
              </Text>
            )}
            {filteredTasksByDate.length > 0 ? (
              filteredTasksByDate.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  dueDate={task.due_date}
                  assignedTo={task.assigned_to}
                  status={task.status}
                  onPress={() => handleTaskPress(task)}
                  myName={user?.nickname || '나'}
                  partnerName={partner?.nickname || '상대방'}
                />
              ))
            ) : selectedDate ? (
              <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                  이 날짜에 할일이 없습니다
                </Text>
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                  날짜를 선택하세요
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* FAB */}
      <Pressable
        style={[styles.fab, { backgroundColor: tokenColors.foundation.primary }]}
        onPress={() => setIsCreateModalVisible(true)}
      >
        <FontAwesome name='plus' size={24} color='#FFFFFF' />
      </Pressable>

      <TaskDetailModal
        visible={isDetailModalVisible}
        task={selectedTask}
        onClose={() => setIsDetailModalVisible(false)}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />

      <TaskCreateModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: spacing.size8,
    gap: spacing.size8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.size8,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.size16,
    gap: spacing.size12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.size64,
  },
  emptyText: {
    fontSize: fontSize.lg,
  },
  calendarContainer: {
    flex: 1,
  },
  calendarTaskList: {
    flex: 1,
  },
  calendarTaskListContent: {
    padding: spacing.size16,
    gap: spacing.size12,
  },
  calendarDateTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.size8,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.size24,
    right: spacing.size24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
})
