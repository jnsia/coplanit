import { View, Pressable, StyleSheet } from 'react-native'
import { spacing, radius, shadow } from '@/constants/tokens'
import { useTheme } from '@/lib/ThemeProvider'
import type { ReactNode } from 'react'

type CardProps = Readonly<{
  children: ReactNode
  onPress?: () => void
  padding?: keyof typeof spacing
  noPadding?: boolean
}>

export default function Card({ children, onPress, padding = 'size16', noPadding = false }: CardProps) {
  const { colors } = useTheme()

  const cardStyles = [
    styles.base,
    { backgroundColor: colors.background.primary },
    { borderColor: colors.border.primary },
    !noPadding && { padding: spacing[padding] },
  ]

  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [...cardStyles, pressed && styles.pressed]} onPress={onPress}>
        {children}
      </Pressable>
    )
  }

  return <View style={cardStyles}>{children}</View>
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    ...shadow.md,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
})
