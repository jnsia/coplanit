import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/constants/theme'
import { mission } from '@/entities/mission/model/mission'
import Badge from '@/components/atoms/Badge'
import { colors } from '@/constants/colors'
import { fonts } from '@/constants/fonts'

const typeLabels: Record<string, string> = {
  special: '특별',
  daily: '일일',
  emergency: '긴급',
}

export default function MissionButton({
  mission,
  clickMission,
}: {
  mission: mission
  clickMission: (mission: mission) => void
}) {
  const badgeLabel = typeLabels[mission.type] || mission.type
  const badgeVariant = mission.completed ? 'completed' : 'pending'

  return (
    <TouchableOpacity
      style={mission.completed ? styles.completedItem : styles.item}
      onPress={() => clickMission(mission)}
    >
      <Badge label={badgeLabel} variant={badgeVariant as 'completed' | 'pending'} />
      <Text
        style={mission.completed ? styles.completedItemText : styles.itemText}
        numberOfLines={1}
      >
        {mission.title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    flex: 1,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    marginBottom: 8,
  },
  completedItemText: {
    fontSize: 14,
    color: 'white',
    fontFamily: fonts.default,
  },
})
