# CoPlanIt - 개발 컨벤션

이 문서는 CoPlanIt 모바일 애플리케이션 프로젝트의 코드 작성 규칙과 컨벤션을 정의합니다.

**CoPlanIt**은 React Native와 Expo를 기반으로 개발된 크로스 플랫폼 모바일 애플리케이션입니다.

## 목차

- [기술 스택](#가술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [TypeScript 컨벤션](#typescript-컨벤션)
- [React 컨벤션](#react-컨벤션)
- [스타일링](#스타일링)
- [상태 관리](#상태-관리)
- [API 호출](#api-호출)
- [폼 관리](#폼-관리)
- [파일 네이밍](#파일-네이밍)
- [컴포넌트 개발 파이프라인](#컴포넌트-개발-파이프라인)
- [테스트](#테스트)
- [성능 최적화](#성능-최적화)
- [접근성](#접근성-a11y)
- [환경 변수](#환경-변수)
- [Git 컨벤션](#git-컨벤션)
- [주요 라이브러리](#주요-라이브러리)
- [참고 자료](#참고-자료)
- [체크리스트](#체크리스트)

---

## 기술 스택

- **아키텍처**: Feature-Sliced Design (FSD)
- **프레임워크**: React Native 0.74.5 + Expo 51.0.28
- **언어**: TypeScript 5.3.3
- **빌드 도구**: Metro Bundler (Expo)
- **상태 관리**: Zustand 4.5.5 (전역 상태)
- **스타일링**: StyleSheet (React Native 기본)
- **라우팅**: Expo Router 3.5.23
- **백엔드**: Supabase 2.45.1 (DB, Auth, Storage)
- **애니메이션**: React Native Reanimated 3.10.1
- **테스트**: Jest 29.4.0 + React Test Renderer
- **패키지 매니저**: npm

---

## 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

```
/
├── app/              # Expo Router 파일 기반 라우팅
│   ├── (tabs)/       # 탭 네비게이션 그룹
│   │   ├── index.tsx # 홈 화면
│   │   └── profile.tsx
│   ├── _layout.tsx   # 루트 레이아웃
│   ├── +not-found.tsx# 404 화면
│   └── login.tsx     # 로그인 화면
│
├── components/       # 공통 UI 컴포넌트
│   ├── atoms/        # 기본 컴포넌트 (Button, Input 등)
│   ├── molecules/    # 조합 컴포넌트 (Card, Modal 등)
│   └── organisms/    # 복잡한 컴포넌트 (Header, List 등)
│
├── features/         # 기능별 비즈니스 로직
│   ├── auth/         # 사인인/업, 프로필 관리
│   │   ├── ui/       # 기능 전용 UI 컴포넌트
│   │   ├── model/    # 상태, 훅
│   │   └── api/      # API 함수
│   └── ...
│
├── entities/         # 비즈니스 엔티티 및 API
│   ├── user/         # 사용자 API
│   │   ├── api/      # API 함수
│   │   └── model/    # 타입 정의
│   └── ...
│
├── stores/           # Zustand 전역 상태
│   ├── useUserStore.ts
│   └── useAppStore.ts
│
├── hooks/            # 공통 커스텀 훅
├── utils/            # 유틸리티 함수
├── lib/              # 외부 라이브러리 설정 (Supabase 등)
├── constants/        # 상수 및 디자인 토큰
│   └── tokens.ts     # colors, spacing, radius
├── types/            # 공통 타입 정의
└── assets/           # 이미지, 폰트 등 정적 파일
```

### 디렉토리별 역할

- **app**: Expo Router 파일 기반 라우팅 (URL과 1:1 매핑)
- **components**: 재사용 가능한 공통 UI 컴포넌트
- **features**: 사용자 시나리오와 비즈니스 로직 (ui/, model/, api/ 포함)
- **entities**: 비즈니스 도메인 엔티티 (api/, model/ 포함)
- **stores**: Zustand 전역 상태 관리
- **hooks**: 공통 커스텀 훅
- **utils**: 공통 유틸리티 함수
- **lib**: 외부 라이브러리 초기화 및 설정
- **constants**: 디자인 토큰, 상수
- **types**: 공통 타입 정의

---

## TypeScript 컨벤션

### 1. 타입 선언 규칙

**타입 정의는 `type` 키워드 사용**

- `interface`는 라이브러리 확장이나 declaration merging이 필요한 경우에만 사용
- 일반적인 경우 모두 `type` 사용

**이유**:

- declaration merging 방지
- IDE (VSCode)에서 타입에 마우스 오버할 경우 속성 정보를 제공함

### 2. Component Props 타입 정의

```typescript
type ComponentProps = Readonly<{
  count: number
  text: string
  onClose?: () => void
}>

export default function Component({ count, text, onClose }: ComponentProps) {
  // ...
}
```

**이유**:

- 명시적인 `Readonly`로 props 불변성 보장

### 3. 반복문: for...of 사용

```typescript
for (const item of items) {
  console.log(item)
}

for (const [key, value] of map) {
  console.log(key, value)
}
```

**forEach 사용 금지**

```typescript
// ❌ 금지
items.forEach((item) => console.log(item))
```

**이유**:

- `for...of`는 `break`, `continue` 사용 가능
- `forEach`는 비동기 함수와 호환되지 않음

### 4. 문자열 보간: 템플릿 리터럴 필수

**모든 문자열 보간 상황에서 템플릿 리터럴(백틱)을 사용합니다.**

```typescript
// ✅ DO: 템플릿 리터럴 사용
const message = `안녕하세요, ${userName}님`
const url = `/api/users/${userId}`
const className = `button ${isActive ? 'active' : ''}`
const style = `color: ${color}; font-size: ${size}px`
const html = `<div>${content}</div>`

// ❌ DON'T: 문자열 연결 금지
const message = '안녕하세요, ' + userName + '님'
const url = '/api/users/' + userId
const className = 'button ' + (isActive ? 'active' : '')
```

**이유:**

- 표현식 삽입이 직관적
- 일관된 코드 스타일

### 5. 전역 객체 및 플랫폼 API 사용

**전역 변수는 `globalThis` 사용, 네이티브 API는 React Native 모듈 사용**

```typescript
// ✅ 일반적인 전역 변수/함수는 globalThis 사용
const myGlobal = globalThis.myCustomGlobal

// ✅ 디바이스 정보는 React Native API 사용
import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')
const isIOS = Platform.OS === 'ios'
const isAndroid = Platform.OS === 'android'

// ✅ 플랫폼별 분기 처리
const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  android: {
    elevation: 5,
  },
})
```

**이유**:

- `globalThis`는 모든 JavaScript 환경에서 동작
- React Native에는 `window` 객체가 없음
- `Dimensions`, `Platform` API로 네이티브 환경 정보 접근

### 6. Import 순서 (ESLint 규칙으로 설정됨)

```typescript
// 1. React 관련
import { useState, useEffect } from 'react'

// 2. React Native 관련
import { View, Text, StyleSheet } from 'react-native'

// 3. 외부 라이브러리
import { create } from 'zustand'

// 4. 내부 모듈 (alias 사용)
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/atoms'
import { useUserStore } from '@/stores/useUserStore'

// 5. 상대 경로
import { colors, spacing } from '../constants/tokens'
```

**이유**:

- 일관된 import 순서로 가독성 향상

## React 컨벤션

### 1. 함수형 컴포넌트

**함수 선언문 사용 (권장)**

```typescript
import { View, Text } from 'react-native'

export default function Component({ title }: ComponentProps) {
  return <Child title={title} />
}

function Child({ title }: ChildProps) {
  return (
    <View>
      <Text>Child Component: {title}</Text>
    </View>
  )
}
```

**이유**:

- 함수 선언문은 hoisting되어 디버깅 시 stack trace가 명확함
- 상위 컴포넌트를 위에 두고 필요한 서브 컴포넌트를 아래로 정리하는 패턴 가능

### 2. Hooks 사용 규칙

- Custom hook은 `use` prefix 필수
- Hook은 항상 컴포넌트 최상단에서 호출
- 조건부 hook 호출 금지

```typescript
export function useCustomHook() {
  const [state, setState] = useState()
  return { state, setState }
}
```

**이유**:

- React 훅 규칙 준수

### 3. Event Handler 네이밍 (권장)

```typescript
const handlePress = () => {} // Pressable, TouchableOpacity
const handleSubmit = () => {}
const handleChange = () => {} // TextInput
```

**이유**:

- `onPress`, `onSubmit` 등 이벤트 속성과 구분
- 가독성 향상 및 일관된 네이밍 컨벤션
- React Native는 `onClick` 대신 `onPress` 사용

### 4. Boolean Props

```typescript
type Props = Readonly<{
  isOpen: boolean // ✅ is prefix
  hasError: boolean // ✅ has prefix
  canEdit: boolean // ✅ can prefix
  disabled?: boolean // ✅ 예외: HTML 속성과 동일
}>
```

**이유**:

- Boolean props는 `is`, `has`, `can` 접두사로 명확히 표현
- HTML 속성과 동일한 경우(`disabled`, `checked`)는 예외 허용

---

## 스타일링

### StyleSheet 사용

이 프로젝트는 **React Native StyleSheet**를 사용합니다.

```typescript
// Component.tsx
import { StyleSheet, View, Text } from 'react-native'
import { colors, spacing } from '@/constants/tokens'

export default function Component() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.size20,
    backgroundColor: colors.background.base,
  },
  text: {
    color: colors.text.primary,
    fontSize: 16,
  },
})
```

### 디자인 토큰 구조

```typescript
// constants/tokens.ts
export const colors = {
  foundation: {
    primary: '#...',
    secondary: '#...',
  },
  text: {
    primary: '#...',
    secondary: '#...',
  },
  background: {
    base: '#...',
    surface: '#...',
  },
  semantic: {
    success: '#...',
    warning: '#...',
    error: '#...',
  },
}

export const spacing = {
  size4: 4,
  size8: 8,
  size12: 12,
  size16: 16,
  size20: 20,
}

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
}
```

### 스타일 작성 원칙

**StyleSheet.create()를 컴포넌트 외부에서 한 번만 호출합니다.**

```typescript
// ✅ DO: 컴포넌트 외부에서 StyleSheet.create
const styles = StyleSheet.create({
  container: {
    padding: spacing.size16,
    backgroundColor: colors.background.base,
  },
});

export default function Component() {
  return <View style={styles.container} />;
}

// ❌ DON'T: 인라인 스타일 객체 (성능 저하)
export default function Component() {
  return <View style={{ padding: 16, backgroundColor: '#fff' }} />;
}

// ❌ DON'T: 컴포넌트 내부에서 StyleSheet.create (리렌더 시 재생성)
export default function Component() {
  const styles = StyleSheet.create({ ... });
  return <View style={styles.container} />;
}
```

### 동적 스타일

동적 값이 필요한 경우 배열 스타일을 사용합니다.

```typescript
const styles = StyleSheet.create({
  base: {
    padding: spacing.size16,
  },
  active: {
    backgroundColor: colors.primary,
  },
})

export default function Component({ isActive }: Props) {
  return <View style={[styles.base, isActive && styles.active]} />
}
```

**이유:**

- React Native의 네이티브 스타일 최적화
- 컴파일 타임에 스타일 검증
- 성능상 이점 (인라인 스타일보다 빠름)

---

## 상태 관리

### Zustand (전역 상태)

전역 상태 관리는 **Zustand** 사용

```typescript
// stores/useUserStore.ts
import { create } from 'zustand'

type UserStore = {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),
}))
```

### Store 작성 패턴

```typescript
// stores/useAppStore.ts
import { create } from 'zustand'

type AppStore = {
  // State
  theme: 'light' | 'dark'
  isLoading: boolean

  // Actions
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (isLoading: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial State
  theme: 'light',
  isLoading: false,

  // Actions
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
}))
```

### Store 사용

```typescript
// Component.tsx
import { useUserStore } from '@/stores/useUserStore'

export default function Component() {
  // 전체 store 구독
  const { user, setUser } = useUserStore()

  // 특정 값만 구독 (권장 - 리렌더 최소화)
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  return <Text>{user?.name}</Text>
}
```

**이유:**

- 간단한 API (보일러플레이트 최소화)
- Context API보다 성능 우수
- React DevTools 통합
- 미들웨어 지원 (persist, immer 등)

### Local State

- **useState**: 단순한 컴포넌트 로컬 상태
- **useReducer**: 복잡한 상태 로직
- **Zustand**: 전역 상태 및 여러 컴포넌트에서 공유하는 상태

---

## API 호출

### Supabase 클라이언트

이 프로젝트는 **Supabase**를 백엔드로 사용합니다.

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### API 함수 작성 패턴

```typescript
// entities/user/api/user.api.ts
import { supabase } from '@/lib/supabase'
import { User } from '../model/user'

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### 인증 패턴

```typescript
// features/auth/api/auth.api.ts
import { supabase } from '@/lib/supabase'

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

### 실시간 구독 패턴

```typescript
// hooks/useRealtimeSubscription.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeSubscription<T>(table: string, filter?: string) {
  const [data, setData] = useState<T[]>([])

  useEffect(() => {
    let channel: RealtimeChannel

    const setupSubscription = async () => {
      channel = supabase
        .channel(`${table}-changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table, filter }, (payload) => {
          // Handle INSERT, UPDATE, DELETE
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as T])
          }
        })
        .subscribe()
    }

    setupSubscription()

    return () => {
      channel?.unsubscribe()
    }
  }, [table, filter])

  return data
}

// 사용 예시
function Component() {
  const messages = useRealtimeSubscription('messages', 'room_id=eq.123')
  return <FlatList data={messages} />
}
```

**이유:**

- Supabase는 PostgreSQL 기반 실시간 DB 제공
- 인증, 스토리지, 실시간 구독 통합
- Row Level Security로 보안 강화
- TypeScript 지원 및 자동 타입 생성

---

## 폼 관리

### useForm Hook 사용

```typescript
const { values, errors, handleChange, handleBlur } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validation: {
    email: (value) => {
      if (!emailRegex.test(value)) return '올바른 이메일을 입력하세요'
      return null
    },
    password: (value, formState) => {
      // 다른 필드 값 참조 가능
      if (value !== formState.confirmPassword) {
        return '비밀번호가 일치하지 않습니다'
      }
      return null
    },
  },
})
```

### Validation 규칙

- Validation 함수는 두 번째 인자로 전체 form state를 받음
- 에러 메시지는 한글로 작성
- `null` 반환 시 에러 없음

---

## 파일 네이밍

### 기본 케이스 규칙

#### 컴포넌트 (PascalCase)

```typescript
// ✅ 컴포넌트 파일
UserProfile.tsx
Button.tsx
FileTable.tsx

// ✅ 컴포넌트 폴더
UserProfile/
  ├── UserProfile.tsx
  ├── UserProfile.css.ts
  └── UserProfile.test.tsx

// ❌ 잘못된 예
userProfile.tsx    // camelCase 사용 금지
user-profile.tsx   // kebab-case 사용 금지
user_profile.tsx   // snake_case 사용 금지
```

**규칙:**

- React 컴포넌트는 **PascalCase** 필수
- 폴더명도 **PascalCase**로 컴포넌트명과 일치
- 확장자는 JSX 포함 시 `.tsx`, 아니면 `.ts`

---

#### Hooks (camelCase + use prefix)

```typescript
// ✅ 커스텀 훅
useForm.ts
useImageCropper.ts
useFileUpload.ts
useCurrentUser.ts

// ❌ 잘못된 예
UseForm.ts // PascalCase 사용 금지
formHook.ts // use prefix 필수
use - form.ts // kebab-case 사용 금지
```

**규칙:**

- 커스텀 훅은 **camelCase** + `use` prefix 필수
- React 훅 규칙 준수 (use로 시작)
- 확장자는 JSX 사용 시만 `.tsx`, 보통은 `.ts`

---

#### 유틸리티 함수 (kebab-case)

```typescript
// ✅ 유틸리티 파일 (단어 1개)
datetime.ts
validation.ts
string.ts
file.ts
array.ts

// ✅ 유틸리티 파일 (단어 2개 이상)
error - handler.ts
image - cropper.ts
coordinate - converter.ts
tree - node.ts

// ❌ 잘못된 예
DateTime.ts // PascalCase 사용 금지
errorHandler.ts // camelCase 사용 금지
error_handler.ts // snake_case 사용 금지
```

**규칙:**

- 유틸리티 파일은 **kebab-case**
- 단어 1개면 소문자 그대로, 2개 이상이면 하이픈(`-`)으로 연결
- 확장자는 항상 `.ts` (유틸은 JSX 없음)

---

#### 상수 (kebab-case)

```typescript
// ✅ 상수 파일 (단어 1개)
options.ts
routes.ts
config.ts
constants.ts

// ✅ 상수 파일 (단어 2개 이상)
map-config.ts
api-endpoints.ts
default-values.ts

// ❌ 잘못된 예
Options.ts         // PascalCase 사용 금지
CONSTANTS.ts       // SCREAMING_CASE 사용 금지
mapConfig.ts       // camelCase 사용 금지
```

**규칙:**

- 상수 파일은 **kebab-case**
- 파일 내부 상수는 `SCREAMING_SNAKE_CASE` 가능
- 확장자는 항상 `.ts`

---

#### 타입 정의 (kebab-case)

```typescript
// ✅ 타입 파일 (단어 1개)
user.ts // /types/user.ts
job.ts // /types/job.ts
websocket.ts // /types/websocket.ts
common.ts // /types/common.ts

// ✅ 타입 파일 (단어 2개 이상)
file - permission.ts
user - profile.ts
api - response.ts

// ❌ 잘못된 예
User.ts // PascalCase 사용 금지
user.types.ts // types 폴더 내에서 .types 중복
userTypes.ts // Types suffix + camelCase 사용 금지
filePermission.ts // camelCase 사용 금지
```

**규칙:**

- 타입 파일은 **kebab-case**
- `/types/` 폴더 내부에서는 `.types` suffix 제거
- 여러 역할 혼재 시에만 `user.types.ts` 허용
- 확장자는 항상 `.ts`

---

#### API/Model 파일 (kebab-case)

```typescript
// ✅ API 파일 (단어 1개)
user.ts // /api/user.ts
processing.ts // /api/processing.ts
auth.ts // /api/auth.ts

// ✅ API 파일 (단어 2개 이상)
file - metadata.ts
user - permission.ts
error - handler.ts

// 혼합된 경우 dot naming (kebab-case + dot)
file - metadata.api.ts // API 함수
file - metadata.dto.ts // DTO 타입
user - file - permission.mapper.ts // Mapper 함수

// ❌ 잘못된 예
User.ts // PascalCase 사용 금지
fileMetadata.ts // camelCase 사용 금지
file_metadata.ts // snake_case 사용 금지
```

**규칙:**

- API/Model 파일은 **kebab-case**
- `/api/` 폴더 내부에서는 `.api` suffix 제거 (단일 역할)
- 여러 역할 혼재 시에만 dot naming 사용
- 확장자는 항상 `.ts`

---

### 케이스 요약표

| 파일 타입     | 케이스           | Prefix | 예시                                  |
| ------------- | ---------------- | ------ | ------------------------------------- |
| 컴포넌트      | PascalCase       | -      | `UserProfile.tsx`                     |
| 컴포넌트 폴더 | PascalCase       | -      | `UserProfile/`                        |
| 훅            | camelCase        | `use`  | `useForm.ts`, `useFileUpload.ts`      |
| 유틸리티      | kebab-case       | -      | `datetime.ts`, `error-handler.ts`     |
| 상수          | kebab-case       | -      | `routes.ts`, `map-config.ts`          |
| 타입          | kebab-case       | -      | `user.ts`, `file-permission.ts`       |
| API           | kebab-case       | -      | `user.ts`, `file-metadata.ts`         |
| DTO           | kebab-case + dot | -      | `user.dto.ts`, `file-metadata.dto.ts` |
| Mapper        | kebab-case + dot | -      | `user.mapper.ts`                      |

**공통 원칙:**

- **PascalCase**: 컴포넌트와 컴포넌트 폴더만
- **camelCase**: 훅만 (use prefix 필수)
- **kebab-case**: 그 외 모든 TypeScript 파일 (utils, types, api, constants 등)
- **snake_case**: 사용 금지

### Dot Naming 규칙 (Selective Dot Naming)

**원칙: 폴더 구조로 충분하면 dot 제거, 명확성이 필요하면 dot 사용**

#### ✅ 항상 Dot Naming 사용 (업계 표준)

```typescript
// CSS-in-JS (Vanilla Extract)
Component.css.ts

// 테스트 파일
utils.test.ts
Component.test.tsx

// Storybook
Button.stories.tsx

// DTO/Mapper (백엔드 패턴)
user.dto.ts
user.mapper.ts
```

#### ❌ 폴더가 역할을 나타내면 Dot 제거

```typescript
// ❌ 중복된 의미 (폴더명과 파일명이 같은 역할)
;/api/ersu.api.ts / // api 폴더인데 .api.ts 중복
  utils /
  string.utils.ts / // utils 폴더인데 .utils.ts 중복
  types /
  user.types.ts / // types 폴더인데 .types.ts 중복
  // ✅ 깔끔함 (폴더명으로 역할 표현 충분)
  api /
  user.ts / // 폴더명으로 api임을 알 수 있음
  utils /
  string.ts / // 폴더명으로 utils임을 알 수 있음
  types /
  user.ts // 폴더명으로 types임을 알 수 있음
```

#### ✅ 같은 레벨에 여러 역할이 섞이면 Dot 사용

```typescript
// 같은 폴더에 여러 역할 파일이 섞여 있을 때
/entities/processing/api/
  ├── processing.api.ts    // API 함수
  ├── processing.dto.ts    // DTO 타입
  ├── processing.mapper.ts // Mapper 함수
  ├── job.dto.ts
  └── job.mapper.ts

// 컴포넌트 폴더 내부
/Calendar/
  ├── Calendar.tsx           // 메인 컴포넌트
  ├── Calendar.css.ts        // 스타일
  ├── Calendar.test.tsx      // 테스트
  ├── calendar.utils.ts      // 컴포넌트 전용 유틸
  ├── calendar.constants.ts  // 컴포넌트 전용 상수
  └── DateGrid.tsx           // 서브 컴포넌트
```

#### 📋 실전 예시

```typescript
// ✅ 역할별 폴더 내부는 dot 제거
/shared/utils/
  ├── datetime.ts      // ✅ (not datetime.utils.ts)
  ├── file.ts          // ✅ (not file.utils.ts)
  └── string.ts        // ✅ (not string.utils.ts)

/shared/api/
  ├── base.ts          // ✅
  ├── error-handler.ts // ✅ (not utils.ts, 명확한 이름 사용)
  └── error.ts         // ✅ (not types.ts, 명확한 이름 사용)

// ✅ 컴포넌트 전용 파일은 dot 사용
/Calendar/
  ├── calendar.utils.ts     // ✅ Calendar 전용이므로 dot 사용
  ├── calendar.constants.ts // ✅
  └── useDropdownPosition.ts // ✅ hook은 use prefix로 충분

// ✅ 혼합된 파일은 dot으로 구분
/entities/user/api/
  ├── user.api.ts    // ✅ API 함수
  ├── user.dto.ts    // ✅ DTO 타입
  └── user.mapper.ts // ✅ Mapper 함수
```

### 파일명 결정 플로우차트

```
파일 생성 시 질문:

1. 테스트/CSS/Stories/DTO/Mapper인가?
   → YES: dot 사용 (Component.test.tsx)
   → NO: 다음 질문으로

2. 폴더명이 이미 역할을 나타내는가? (utils/, api/, types/)
   → YES: dot 제거 (utils/string.ts)
   → NO: 다음 질문으로

3. 같은 레벨에 여러 역할 파일이 섞여 있는가?
   → YES: dot 사용 (user.api.ts, user.dto.ts)
   → NO: dot 제거

4. 컴포넌트 전용 파일인가?
   → YES: dot 사용 (calendar.utils.ts)
   → NO: dot 제거
```

---

## 컴포넌트 개발 파이프라인

새로운 공통 컴포넌트를 개발하거나 기존 컴포넌트에 주요 기능을 추가할 때는 다음 파이프라인을 따라야 합니다:

### 1. 컴포넌트 구현

- TypeScript로 컴포넌트 작성
- Props는 `Readonly<{}>` 패턴 사용
- StyleSheet로 스타일 작성 (컴포넌트 외부)

```typescript
// components/Button.tsx
import { Text, Pressable, StyleSheet } from 'react-native'
import { colors, spacing } from '@/constants/tokens'

type ButtonProps = Readonly<{
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
}>

export default function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      style={[styles.base, variant === 'primary' ? styles.primary : styles.secondary]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.size12,
    paddingHorizontal: spacing.size20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.foundation.primary,
  },
  secondary: {
    backgroundColor: colors.foundation.secondary,
  },
  text: {
    color: colors.text.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
})
```

### 2. 테스트 작성 (선택적)

- 복잡한 로직이 있는 경우 테스트 작성
- 단순 렌더링 테스트는 생략 가능
- Coverage 목표: 70% 이상

### 3. 문서화

- 주요 변경사항은 이 문서(CLAUDE.md)에 기록
- 새로운 패턴이나 컨벤션은 해당 섹션에 추가

---

## 테스트

### 테스트 파일 네이밍

- 단위 테스트: `*.test.ts`, `*.test.tsx`
- 컴포넌트 테스트: `__tests__/ComponentName.test.tsx`

### 테스트 작성 원칙

1. **Pure Functions 테스트 우선**

   - Utils 함수는 반드시 테스트 작성
   - 단순 getter/setter는 테스트 생략 가능

2. **Hook 테스트**
   - `@testing-library/react-native`의 `renderHook` 사용
   - 복잡한 로직이 있는 hook만 테스트

```typescript
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react-native'

describe('useCounter', () => {
  it('값을 증가시킨다', () => {
    const { result } = renderHook(() => useCounter(0))

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
```

3. **컴포넌트 테스트**
   - `@testing-library/react-native` 사용
   - 사용자 인터랙션 중심 테스트

```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import Button from '../Button'

describe('Button', () => {
  it('클릭 시 onPress가 호출된다', () => {
    const onPress = jest.fn()
    const { getByText } = render(<Button title='Click me' onPress={onPress} />)

    fireEvent.press(getByText('Click me'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
```

4. **자잘한 테스트 지양**
   - 핵심 로직 위주로 테스트
   - 단순 렌더링 테스트는 생략 가능

### Coverage 목표

- Lines: 70% 이상
- Functions: 70% 이상
- Branches: 70% 이상
- Statements: 70% 이상

---

## 성능 최적화

### 1. 리스트 최적화

긴 리스트는 `FlatList` 또는 `FlashList` 사용

```typescript
import { FlatList } from 'react-native'

function ListComponent({ data }: Props) {
  const renderItem = useCallback(({ item }) => <ItemComponent item={item} />, [])

  const keyExtractor = useCallback((item) => item.id, [])

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
    />
  )
}
```

**FlashList (권장):**

```typescript
import { FlashList } from '@shopify/flash-list'
;<FlashList data={data} renderItem={renderItem} estimatedItemSize={100} />
```

### 2. Memoization

- `useMemo`: 비용이 큰 계산
- `useCallback`: 자식 컴포넌트에 전달하는 함수
- `React.memo`: 불필요한 리렌더링 방지

```typescript
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processed = useMemo(() => processData(data), [data])

  const handlePress = useCallback(() => {
    console.log('pressed')
  }, [])

  return <View>{processed}</View>
})
```

### 3. 이미지 최적화

```typescript
import { Image } from 'expo-image'
;<Image
  source={{ uri: imageUrl }}
  placeholder={blurhash}
  contentFit='cover'
  transition={1000}
  cachePolicy='memory-disk'
/>
```

### 4. 네이티브 드라이버 사용

애니메이션은 `useNativeDriver: true` 사용

```typescript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // ✅ 필수
}).start()
```

### 5. Hermes 엔진 활성화

`app.json`에서 Hermes 엔진 사용 (기본 활성화)

```json
{
  "expo": {
    "jsEngine": "hermes"
  }
}
```

---

## 접근성 (a11y)

### 1. Accessibility Props 사용

```typescript
import { Pressable, Text } from 'react-native';

// ✅ DO
<Pressable
  accessible={true}
  accessibilityLabel="닫기 버튼"
  accessibilityRole="button"
  accessibilityHint="팝업을 닫습니다"
  onPress={onClose}
>
  <Text>닫기</Text>
</Pressable>

// ❌ DON'T
<Pressable onPress={onClose}>
  <Text>X</Text>
</Pressable>
```

### 2. 주요 Accessibility Props

```typescript
type AccessibilityProps = {
  accessible?: boolean; // 접근성 요소 여부 (기본: true)
  accessibilityLabel?: string; // 스크린 리더가 읽는 텍스트
  accessibilityRole?: 'button' | 'link' | 'header' | 'text' | 'image' | 'switch' | 'checkbox' | ...;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityHint?: string; // 동작에 대한 설명
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
};
```

### 3. 실전 예시

```typescript
// 토글 버튼
<Pressable
  accessible={true}
  accessibilityRole="switch"
  accessibilityState={{ checked: isEnabled }}
  accessibilityLabel="알림 설정"
  onPress={toggleSwitch}
>
  <Text>{isEnabled ? 'ON' : 'OFF'}</Text>
</Pressable>

// 슬라이더
<Slider
  accessible={true}
  accessibilityRole="adjustable"
  accessibilityValue={{ min: 0, max: 100, now: value }}
  accessibilityLabel="볼륨"
/>
```

### 4. 테스트

iOS VoiceOver 및 Android TalkBack으로 테스트 필수

---

## 환경 변수

### 네이밍

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
```

- `EXPO_PUBLIC_` prefix 필수 (클라이언트에서 접근 가능)
- SCREAMING_SNAKE_CASE 사용
- 민감한 정보는 `EXPO_PUBLIC_` 없이 사용 (빌드 타임에만 접근)

### 사용 방법

```typescript
// app.config.ts
import 'dotenv/config'

export default {
  expo: {
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
}

// 앱에서 사용
import Constants from 'expo-constants'

const apiUrl = Constants.expoConfig?.extra?.apiUrl
```

---

## Git 컨벤션

### Commit Message

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
chore: 빌드 설정, 패키지 업데이트 등
docs: 문서 수정
test: 테스트 코드
style: 코드 포맷팅 (기능 변경 없음)
```

예시:

```
feat: 프로필 이미지 업로드 기능 추가
fix: 로그인 시 토큰 갱신 오류 수정
refactor: forEach를 for...of로 변경
```

---

## 주요 라이브러리

### 핵심 의존성

- **React** 18.2.0 - UI 라이브러리
- **React Native** 0.74.5 - 모바일 프레임워크
- **Expo** 51.0.28 - 개발 플랫폼
- **TypeScript** 5.3.3 - 타입 시스템
- **Expo Router** 3.5.23 - 파일 기반 라우팅
- **Zustand** 4.5.5 - 상태 관리
- **Supabase** 2.45.1 - 백엔드 서비스
- **React Native Reanimated** 3.10.1 - 애니메이션
- **React Native Gesture Handler** 2.16.1 - 제스처
- **Expo Notifications** 0.28.17 - 푸시 알림

### 개발 의존성

- **Jest** 29.4.0 - 테스팅 프레임워크
- **@testing-library/react-native** - 컴포넌트 테스트
- **TypeScript** 5.3.3 - 타입 체크

---

## 참고 자료

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Native 공식 문서](https://reactnative.dev/)
- [Expo 공식 문서](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Supabase](https://supabase.com/docs)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Testing Library React Native](https://callstack.github.io/react-native-testing-library/)

---

## 체크리스트

새 컴포넌트를 작성할 때 확인할 사항:

- [ ] Props는 `type Props = Readonly<{}>` 패턴 사용
- [ ] 반복문은 `for...of` 사용 (forEach 금지)
- [ ] 문자열 보간 시 템플릿 리터럴 사용 (문자열 연결 금지)
- [ ] Event handler는 `handle` prefix
- [ ] Boolean props는 `is/has/can` prefix
- [ ] StyleSheet로 스타일 작성 (컴포넌트 외부)
- [ ] 인라인 스타일 금지
- [ ] 중요한 로직은 테스트 코드 작성
- [ ] TypeScript strict mode 준수
- [ ] 접근성 고려 (accessibilityLabel, accessibilityRole 등)
- [ ] 파일명은 Selective Dot Naming 규칙 준수
- [ ] API 함수는 entities 레이어에 작성
- [ ] 비즈니스 로직은 features 레이어에 작성
- [ ] FlatList 사용 시 최적화 props 설정 (keyExtractor, renderItem 등)
- [ ] 애니메이션 사용 시 useNativeDriver: true 설정
