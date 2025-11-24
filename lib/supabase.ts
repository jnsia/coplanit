import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zuuyrkkfrnvvfvlpkyyv.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dXlya2tmcm52dmZ2bHBreXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzODA4OTMsImV4cCI6MjAzNzk1Njg5M30.75yxEQO7XVyDTiZYjOm4QnRzPaj-EDteiclbt38noHE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
