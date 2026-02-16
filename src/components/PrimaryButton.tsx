import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Layout } from '../constants/theme';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: any;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    style
}) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePress = () => {
        if (disabled || loading) return;
        Haptics.selectionAsync();
        onPress();
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                disabled={disabled || loading}
                style={[
                    styles.container,
                    disabled && styles.disabled,
                    loading && styles.loading
                ]}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.text}>{title}</Text>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: Layout.radius.md,
        justifyContent: 'center',
        alignItems: 'center',
        ...Layout.shadows.small,
    },
    disabled: {
        backgroundColor: Colors.textLight, // Slate 500
        opacity: 0.6,
    },
    loading: {
        opacity: 0.8,
    },
    text: {
        ...Typography.button,
    }
});

export default PrimaryButton;
