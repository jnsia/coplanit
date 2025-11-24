import { FontAwesome } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { StatusBar } from 'react-native'
import { useTheme } from '@/lib/ThemeProvider'
import { colors as tokenColors } from '@/constants/tokens'

export default function HomeLayout() {
  const { theme, colors } = useTheme()

  return (
    <>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background.primary}
      />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = ''

            if (route.name === '(index)') {
              iconName = 'check-square-o'
            } else if (route.name === 'love') {
              iconName = 'list'
            } else if (route.name === 'history') {
              iconName = 'history'
            } else if (route.name === '(setting)') {
              iconName = 'cog'
            }
            // @ts-expect-error
            return <FontAwesome name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: tokenColors.foundation.primary,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarStyle: {
            backgroundColor: colors.background.primary,
            borderTopColor: colors.border.primary,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
        })}
      >
        <Tabs.Screen
          name="(index)"
          options={{
            title: '내 할일',
          }}
        />
        <Tabs.Screen
          name="love"
          options={{
            title: '전체',
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: '이력',
          }}
        />
        <Tabs.Screen
          name="(setting)"
          options={{
            title: '설정',
          }}
        />
      </Tabs>
    </>
  )
}