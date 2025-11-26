import { Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import {
  colors as tokenColors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  shadow,
} from '@/shared/constants/tokens'
import { useTheme } from '@/shared/lib/ThemeProvider'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = Readonly<{
  title: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}>

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme()

  const buttonStyles = [
    styles.base,
    size === 'sm' && styles.sm,
    size === 'md' && styles.md,
    size === 'lg' && styles.lg,
    variant === 'primary' && { backgroundColor: tokenColors.foundation.primary },
    variant === 'secondary' && { backgroundColor: colors.background.tertiary },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
  ]

  const textStyles = [
    styles.text,
    size === 'sm' && styles.textSm,
    size === 'md' && styles.textMd,
    size === 'lg' && styles.textLg,
    variant === 'primary' && { color: '#FFFFFF' },
    variant === 'secondary' && { color: colors.text.primary },
    variant === 'outline' && { color: colors.text.primary },
    variant === 'ghost' && { color: tokenColors.foundation.primary },
    disabled && { color: colors.text.tertiary },
  ]

  return (
    <Pressable
      style={({ pressed }) => [...buttonStyles, pressed && !disabled && styles.pressed]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          size='small'
          color={variant === 'primary' ? '#FFFFFF' : tokenColors.foundation.primary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    ...shadow.sm,
  },
  sm: {
    paddingVertical: spacing.size8,
    paddingHorizontal: spacing.size16,
  },
  md: {
    paddingVertical: spacing.size12,
    paddingHorizontal: spacing.size20,
  },
  lg: {
    paddingVertical: spacing.size16,
    paddingHorizontal: spacing.size24,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: fontWeight.semibold,
  },
  textSm: {
    fontSize: fontSize.sm,
  },
  textMd: {
    fontSize: fontSize.base,
  },
  textLg: {
    fontSize: fontSize.lg,
  },
})
