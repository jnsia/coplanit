import MissionInfoModal from '@/features/mission/ui/MissionInfoModal'
import theme from '@/shared/constants/theme'
import { useCurrentUser } from '@/features/auth/model/use-current-user'
import { useLoveFcmToken } from '@/features/auth/model/auth-queries'
import { mission } from '@/entities/mission/model/mission'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { fonts } from '@/shared/constants/fonts'
import { colors } from '@/shared/constants/colors'
import ScheduledMissionRegistModal from '@/features/mission/ui/ScheduledMissionRegistModal'
import ScheduledMissionInfoModal from '@/features/mission/ui/ScheduledMissionInfoModal'
import { supabase } from '@/shared/lib/supabase'
import RegistButton from '@/shared/components/atoms/RegistButton'
import CloseButton from '@/shared/components/atoms/CloseButton'

export default function ScheduleScreen() {
  const [missions, setMissions] = useState<mission[]>([])
  const [completedMissions, setCompletedMissions] = useState<mission[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isMissionInfoVisible, setIsMissionInfoVisible] = useState(false)
  const [selctedMissionId, setSelctedMissionId] = useState(0)

  const { user } = useCurrentUser()
  const { data: loveFcmToken } = useLoveFcmToken(user?.loveId)

  const getMissions = async () => {
    if (!user?.loveId) return

    const { data, error } = await supabase
      .from('scheduledMissions')
      .select()
      .eq('userId', user.loveId)

    if (error) {
      console.error('Error fetching missions:', error.message)
      return
    }

    const missions: mission[] = []
    const completedMissions: mission[] = []

    data.forEach((mission: mission) => {
      if (mission.completed) {
        completedMissions.push(mission)
      } else {
        missions.push(mission)
      }
    })

    setMissions(missions)
    setCompletedMissions(completedMissions)
  }

  const handleMissionPress = (mission: mission) => {
    setSelctedMissionId(mission.id)
    setIsMissionInfoVisible(true)
  }

  const closeMissionInfoModal = () => {
    setIsMissionInfoVisible(false)
  }

  const openModal = () => {
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  useFocusEffect(
    useCallback(() => {
      getMissions()
    }, []),
  )

  if (!user) {
    return null
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {completedMissions.map((mission: mission) => (
          <View key={mission.id}>
            <TouchableOpacity
              style={styles.completedItem}
              onPress={() => handleMissionPress(mission)}
            >
              <View style={styles.badge}>
                <Text style={styles.badgeText}>쿠폰</Text>
              </View>
              <Text style={styles.completedItemText} numberOfLines={1}>
                {mission.title}
              </Text>
            </TouchableOpacity>
            {selctedMissionId == mission.id && (
              <MissionInfoModal
                getMissions={getMissions}
                closeMissionInfoModal={closeMissionInfoModal}
                isMissionInfoVisible={isMissionInfoVisible}
                mission={mission}
              />
            )}
          </View>
        ))}
        {missions.map((mission) => (
          <View key={mission.id}>
            <TouchableOpacity style={styles.item} onPress={() => handleMissionPress(mission)}>
              <Text style={styles.itemText} numberOfLines={1}>
                {mission.title}
              </Text>
            </TouchableOpacity>
            {selctedMissionId == mission.id && (
              <ScheduledMissionInfoModal
                getMissions={getMissions}
                closeMissionInfoModal={closeMissionInfoModal}
                isMissionInfoVisible={isMissionInfoVisible}
                mission={mission}
              />
            )}
          </View>
        ))}
      </ScrollView>
      <ScheduledMissionRegistModal
        getMissions={getMissions}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
      />
      <View style={{ marginBottom: 10 }}>
        <RegistButton text='일일 미션 예약하기' onPress={openModal} />
        <CloseButton text='닫기' onPress={() => router.back()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6347',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
  },
  couponItem: {
    padding: 16,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    gap: 8,
  },
  itemText: {
    fontSize: fonts.size.body,

    flex: 1,
    color: theme.colors.text,
    fontFamily: fonts.default,
  },
  couponItemText: {
    fontSize: fonts.size.body,

    flex: 1,
    fontFamily: fonts.defaultBold,
    color: theme.colors.text,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'green',
    marginBottom: 10,
  },
  warningItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.accent,
    marginBottom: 10,
  },
  completedItemText: {
    fontSize: fonts.size.body,

    color: 'white',
    fontFamily: fonts.default,
  },
  badge: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: fonts.default,
    fontSize: 10,
    color: theme.colors.text,
  },
})
