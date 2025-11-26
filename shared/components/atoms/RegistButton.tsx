import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/theme'
import { fonts } from '@/shared/constants/fonts'

export default function RegistButton({ text, onPress }: { text: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    backgroundColor: theme.colors.button,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: fonts.size.body,

    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.default,
  },
})
