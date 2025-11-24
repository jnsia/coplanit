import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/constants/theme'
import { fonts } from '@/constants/fonts'

type SubmitButtonProps = Readonly<{
  text: string
  onPress: () => void
}>

export default function SubmitButton({ text, onPress }: SubmitButtonProps) {
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
    backgroundColor: theme.colors.button,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.default,
  },
})
