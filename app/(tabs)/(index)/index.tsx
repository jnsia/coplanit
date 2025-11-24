import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native'
import { useCallback, useState } from 'react'
import { useCurrentUser } from '@/features/auth/model/use-current-user'
import { useFocusEffect } from 'expo-router'
import { useTheme } from '@/lib/ThemeProvider'
import { spacing, fontSize } from '@/constants/tokens'
import TaskCard from '@/components/molecules/TaskCard'
import TaskDetailModal from '@/features/task/ui/TaskDetailModal'
import type { Task } from '@/entities/task/model/task'
import { getMyTasks, completeTask, cancelTask } from '@/entities/task/api/task'
import { getUserById } from '@/entities/user/api/user.api'
import type { user as UserType } from '@/entities/user/model/user'

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [partner, setPartner] = useState<UserType | null>(null)

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
      const data = await getMyTasks(user.id)
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task)
    setIsModalVisible(true)
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

      const backAction = () => {
        Alert.alert('앱을 종료하시겠습니까?', '', [
          { text: '아니요', onPress: () => null, style: 'cancel' },
          { text: '예', onPress: () => BackHandler.exitApp() },
        ])
        return true
      }

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
      return () => backHandler.remove()
    }, [user]),
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View>
      ) : tasks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>할일이 없습니다</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {tasks.map((task) => (
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
          ))}
        </ScrollView>
      )}

      <TaskDetailModal
        visible={isModalVisible}
        task={selectedTask}
        onClose={() => setIsModalVisible(false)}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.lg,
  },
  list: {
    padding: spacing.size16,
    gap: spacing.size12,
  },
})
