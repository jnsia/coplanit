import { TextInput, Text, View, StyleSheet } from 'react-native'
import { spacing, radius, fontSize } from '@/shared/constants/tokens'
import { useTheme } from '@/shared/lib/ThemeProvider'

type InputProps = Readonly<{
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  label?: string
  multiline?: boolean
  numberOfLines?: number
}>

export default function Input({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
  numberOfLines = 1,
}: InputProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background.tertiary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          },
          multiline && { height: numberOfLines * 24 + spacing.size12 * 2 },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.size8,
  },
  label: {
    fontSize: fontSize.sm,
  },
  input: {
    paddingVertical: spacing.size12,
    paddingHorizontal: spacing.size16,
    borderRadius: radius.md,
    borderWidth: 1,
    fontSize: fontSize.base,
  },
})
