/**
 * 디자인 토큰 - 모던하고 심플한 스타일
 */

export const colors = {
  // Foundation Colors - 러블리한 핑크/보라 계열
  foundation: {
    primary: '#EC4899', // Hot Pink - 러블리한 주요 액션
    primaryLight: '#F472B6',
    primaryDark: '#DB2777',
  },

  // Light Theme - 따뜻하고 부드러운 느낌
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#FFF5F7', // 핑크 틴트 배경
      tertiary: '#FFE4E6',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    border: {
      primary: '#E5E7EB',
      secondary: '#F3F4F6',
    },
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  // Dark Theme
  dark: {
    background: {
      primary: '#111827',
      secondary: '#1F2937',
      tertiary: '#374151',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
    },
    border: {
      primary: '#374151',
      secondary: '#4B5563',
    },
    shadow: 'rgba(0, 0, 0, 0.3)',
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',
    successLight: '#34D399',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    error: '#EF4444',
    errorLight: '#F87171',
    info: '#3B82F6',
    infoLight: '#60A5FA',
  },

  // Assignment Colors (할일 담당자별 색상) - 러블리한 색상
  assignment: {
    me: '#EC4899', // Hot Pink
    partner: '#A78BFA', // Lavender
    both: '#C084FC', // Purple
  },
}

export const spacing = {
  size4: 4,
  size8: 8,
  size12: 12,
  size16: 16,
  size20: 20,
  size24: 24,
  size32: 32,
  size40: 40,
  size48: 48,
  size64: 64,
}

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
}

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
}

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
}

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
}
