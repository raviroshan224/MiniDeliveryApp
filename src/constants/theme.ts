import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Colors = {
    // Brand Colors
    primary: '#2563EB',      // Enterprise Blue (Inter)
    primaryDark: '#1D4ED8',  // Hover/Active state
    primaryLight: '#DBEAFE', // Backgrounds/Accents
    secondary: '#0F172A',    // Deep Navy (Headings)
    accent: '#3B82F6',       // Bright Blue (Actions)

    // Feedback Colors
    success: '#10B981',      // Emerald Green (Delivered)
    warning: '#F59E0B',      // Amber (Pending)
    error: '#EF4444',        // Red (Cancelled/Error)
    offline: '#FBBF24',      // Yellow (Offline Indicator)

    // UI Colors
    background: '#F8FAFC',   // Slate 50 (App BG)
    card: '#FFFFFF',         // White (Card BG)
    text: '#1E293B',         // Slate 800 (Body Text)
    textLight: '#64748B',    // Slate 500 (Subtitles)
    border: '#E2E8F0',       // Slate 200 (Borders)
    inputBg: '#F1F5F9',      // Slate 100 (Input BG)
};

export const Typography = {
    // Font Families (System Fallbacks)
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),

    // Scale
    h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36, color: Colors.secondary },
    h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32, color: Colors.secondary },
    h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28, color: Colors.secondary },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, color: Colors.text },
    caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, color: Colors.textLight },
    button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24, color: '#FFFFFF' },
};

export const Layout = {
    window: { width, height },
    isSmallDevice: width < 375,
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        round: 9999,
    },
    shadows: {
        small: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        medium: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        large: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 10,
        },
    },
};
