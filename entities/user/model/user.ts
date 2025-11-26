export interface user {
  id: number
  email: string
  nickname: string
  coin: number
  loveId: number
  partner_id: number | null
  fcmToken: string
  secret: string
}
