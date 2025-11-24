import { Text, View, StyleSheet } from 'react-native'
import { colors as tokenColors, spacing, radius, fontSize } from '@/constants/tokens'

type BadgeVariant = 'me' | 'partner' | 'both' | 'pending' | 'completed' | 'cancelled'

type BadgeProps = Readonly<{
  label: string
  variant: BadgeVariant
}>

const badgeColors: Record<BadgeVariant, { bg: string; text: string }> = {
  me: { bg: tokenColors.assignment.me, text: '#FFFFFF' },
  partner: { bg: tokenColors.assignment.partner, text: '#FFFFFF' },
  both: { bg: tokenColors.assignment.both, text: '#FFFFFF' },
  pending: { bg: '#FEF3C7', text: '#92400E' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
}

export default function Badge({ label, variant }: BadgeProps) {
  const colorScheme = badgeColors[variant]

  return (
    <View style={[styles.badge, { backgroundColor: colorScheme.bg }]}>
      <Text style={[styles.text, { color: colorScheme.text }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing.size4,
    paddingHorizontal: spacing.size8,
    borderRadius: radius.xs,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
})
