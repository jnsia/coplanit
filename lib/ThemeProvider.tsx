import { createContext, useContext, useState, useEffect } from 'react'
import { colors as tokenColors } from '@/constants/tokens'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
type ThemeColors = typeof tokenColors.light

type ThemeContextValue = {
  theme: Theme
  colors: ThemeColors
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const colors = theme === 'light' ? tokenColors.light : tokenColors.dark

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const value: ThemeContextValue = {
    theme,
    colors,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
