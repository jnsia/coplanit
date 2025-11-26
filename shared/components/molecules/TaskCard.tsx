import { View, Text, StyleSheet } from 'react-native'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import { spacing, fontSize, fontWeight } from '@/shared/constants/tokens'
import { useTheme } from '@/lib/ThemeProvider'

type TaskCardProps = Readonly<{
  title: string
  description?: string | null
  dueDate?: string | null
  assignedTo: 'me' | 'partner' | 'both'
  status: 'pending' | 'completed' | 'cancelled'
  onPress: () => void
  myName?: string
  partnerName?: string
}>

const statusLabels = {
  pending: '대기',
  completed: '완료',
  cancelled: '취소',
}

export default function TaskCard({
  title,
  description,
  dueDate,
  assignedTo,
  status,
  onPress,
  myName = '나',
  partnerName = '상대방',
}: TaskCardProps) {
  const { colors } = useTheme()

  const assignedToLabels = {
    me: myName,
    partner: partnerName,
    both: `${myName} & ${partnerName}`,
  }

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.badges}>
          <Badge label={assignedToLabels[assignedTo]} variant={assignedTo} />
          {status !== 'pending' && <Badge label={statusLabels[status]} variant={status} />}
        </View>
      </View>

      {description && (
        <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={2}>
          {description}
        </Text>
      )}

      {dueDate && (
        <Text style={[styles.dueDate, { color: colors.text.tertiary }]}>
          기한: {new Date(dueDate).toLocaleDateString('ko-KR')}
        </Text>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.size8,
  },
  title: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginRight: spacing.size8,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.size4,
  },
  description: {
    fontSize: fontSize.sm,
    marginBottom: spacing.size8,
    lineHeight: 20,
  },
  dueDate: {
    fontSize: fontSize.xs,
  },
})
