import { Colors } from './colors';

export const Theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: Colors.primary,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: Colors.primary,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: Colors.primary,
    },
    body: {
      fontSize: 14,
      color: Colors.darkGray,
    },
    caption: {
      fontSize: 12,
      color: Colors.gray,
    },
  },
  shadows: {
    sm: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    md: {
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    lg: {
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
  },
};
