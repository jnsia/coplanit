import { View, Modal as RNModal, StyleSheet, Pressable, Text } from 'react-native'
import { spacing, radius, fontSize, fontWeight } from '@/shared/constants/tokens'
import type { ReactNode } from 'react'
import { useTheme } from '@/shared/lib/ThemeProvider'

type ModalProps = Readonly<{
  visible: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}>

export default function Modal({ visible, onClose, title, children }: ModalProps) {
  const { colors } = useTheme()

  return (
    <RNModal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.content, { backgroundColor: colors.background.primary }]}
          onPress={(e) => e.stopPropagation()}
        >
          {title && (
            <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
              <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
            </View>
          )}
          <View style={styles.body}>{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.size20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.size20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  body: {
    padding: spacing.size20,
  },
})
