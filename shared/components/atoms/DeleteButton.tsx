import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/theme'
import { colors } from '@/shared/constants/colors'
import { fonts } from '@/shared/constants/fonts'

export default function DeleteButton({ text, onPress }: { text: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: colors.accent,
  },
  buttonText: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.accent,
  },
})
