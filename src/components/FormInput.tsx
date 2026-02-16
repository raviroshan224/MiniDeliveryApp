import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Animated,
    TextInputProps,
    Platform
} from 'react-native';
import { Colors, Typography, Layout } from '../constants/theme';

interface FormInputProps extends TextInputProps {
    label: string;
    error?: string;
    touched?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    error,
    touched,
    value,
    onBlur,
    onFocus,
    style,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

    // Animate label position based on focus or value presence
    useEffect(() => {
        Animated.timing(animatedLabel, {
            toValue: (isFocused || value) ? 1 : 0,
            duration: 200,
            useNativeDriver: false, // Color/Font interpolation not supported by native driver
        }).start();
    }, [isFocused, value]);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const labelStyle = {
        top: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [18, 6], // Middle to Top
        }),
        fontSize: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12], // Body to Caption size
        }),
        color: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [Colors.textLight, Colors.primary],
        }),
    };

    const hasError = touched && error;

    return (
        <View style={[styles.container, style]}>
            <View style={[
                styles.inputContainer,
                isFocused && styles.focusedBorder,
                hasError && styles.errorBorder
            ]}>
                <Animated.Text style={[styles.label, labelStyle]}>
                    {label}
                </Animated.Text>
                <TextInput
                    value={value}
                    style={styles.input}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholderTextColor="transparent" // Placeholder handled by floating label
                    selectionColor={Colors.primary}
                    {...props}
                />
            </View>
            {hasError && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Layout.spacing.lg,
    },
    inputContainer: {
        backgroundColor: Colors.inputBg,
        borderRadius: Layout.radius.md,
        height: 56,
        borderWidth: 1,
        borderColor: 'transparent',
        paddingHorizontal: Layout.spacing.md,
        justifyContent: 'center',
    },
    focusedBorder: {
        borderColor: Colors.primary,
        backgroundColor: Colors.card,
    },
    errorBorder: {
        borderColor: Colors.error,
    },
    label: {
        position: 'absolute',
        left: Layout.spacing.md,
        ...Typography.body,
        fontWeight: '500', // Ensure label is legible
    },
    input: {
        ...Typography.body,
        color: Colors.text,
        paddingTop: 16, // Space for floating label
        paddingBottom: 2,
        height: '100%',
        ...Platform.select({
            web: { outlineStyle: 'none' } // Remove web outline
        })
    },
    errorText: {
        ...Typography.caption,
        color: Colors.error,
        marginTop: 4,
        marginLeft: 4,
    }
});

export default FormInput;
