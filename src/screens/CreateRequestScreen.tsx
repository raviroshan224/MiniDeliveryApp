import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOrderStore } from '../stores/orderStore';
import { Colors, Typography, Layout } from '../constants/theme';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

const CreateRequestScreen = () => {
    const navigation = useNavigation();
    const { createOrder } = useOrderStore();

    // Form State
    const [recipientName, setRecipientName] = useState('');
    const [description, setDescription] = useState('');
    const [touched, setTouched] = useState({ recipient: false, description: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation
    const errors = {
        recipient: !recipientName.trim() ? 'Recipient name is required' : '',
        description: description.length < 5 ? 'Please provide more details (min 5 chars)' : '',
    };

    const isFormValid = !errors.recipient && !errors.description;

    const handleSubmit = async () => {
        setTouched({ recipient: true, description: true });

        if (!isFormValid) {
            Alert.alert('Incomplete Form', 'Please correct the errors before submitting.');
            return;
        }

        setIsSubmitting(true);

        // CHECK CONNECTIVITY FOR PAYMENT RESTRICTION (Section 3 Requirement)
        const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

        // In a real app with a PaymentSelectionScreen, we would navigate there.
        // For this streamlined flow, we simulate the payment decision here.
        if (!isOnline) {
            console.log('⚠️ Offline: Defaulting to Pay on Delivery');
            // Proceed with creation but mark as offline payment
        }

        // Simulate network delay for "Premium" feel (and to show loading state)
        setTimeout(async () => {
            try {
                await createOrder({
                    recipientName,
                    description,
                    status: 'Pending',
                    // Add payment status if we had a field for it
                });
                navigation.goBack();
            } catch (error) {
                Alert.alert('Error', 'Failed to create order.');
            } finally {
                setIsSubmitting(false);
            }
        }, 800);
    };

    // Offline check logic is handled globally/in store, but we could add a banner here if needed.
    // For now, adhering to the "clean form" design.

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.stepIndicator}>Step 1 of 1</Text>
                <Text style={styles.title}>New Shipment</Text>
                <Text style={styles.subtitle}>Enter the package details below</Text>
            </View>

            {/* Offline Detection Banner */}
            {typeof navigator !== 'undefined' && !navigator.onLine && (
                <View style={styles.offlineBanner}>
                    <MaterialIcons name="wifi-off" size={16} color="#B45309" />
                    <Text style={styles.offlineBannerText}>
                        Offline Mode: Only "Pay on Delivery" available
                    </Text>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <FormInput
                        label="Recipient Name"
                        value={recipientName}
                        onChangeText={setRecipientName}
                        onBlur={() => setTouched({ ...touched, recipient: true })}
                        error={errors.recipient}
                        touched={touched.recipient}
                        autoCapitalize="words"
                    />

                    <FormInput
                        label="Package Description"
                        value={description}
                        onChangeText={setDescription}
                        onBlur={() => setTouched({ ...touched, description: true })}
                        error={errors.description}
                        touched={touched.description}
                        multiline
                        numberOfLines={3}
                        style={{ height: 100 }} // Taller input container
                    />

                    <View style={styles.infoRow}>
                        <MaterialIcons name="info-outline" size={16} color={Colors.primary} />
                        <Text style={styles.infoText}>
                            Standard shipping rates apply based on weight.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    title="Create Delivery"
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    disabled={!isFormValid && (touched.recipient || touched.description)}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: Layout.spacing.lg,
        paddingBottom: Layout.spacing.sm,
    },
    stepIndicator: {
        ...Typography.caption,
        color: Colors.accent,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        ...Typography.h2,
        marginBottom: 4,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textLight,
    },
    offlineBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        marginHorizontal: Layout.spacing.lg,
        padding: Layout.spacing.sm,
        borderRadius: Layout.radius.md,
        marginBottom: Layout.spacing.md,
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    offlineBannerText: {
        ...Typography.caption,
        color: '#B45309',
        marginLeft: 8,
        fontWeight: '600',
    },
    scrollContent: {
        padding: Layout.spacing.lg,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: Layout.radius.lg,
        padding: Layout.spacing.lg,
        ...Layout.shadows.small,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Layout.spacing.md,
        padding: Layout.spacing.md,
        backgroundColor: Colors.primaryLight,
        borderRadius: Layout.radius.md,
    },
    infoText: {
        ...Typography.caption,
        marginLeft: 8,
        color: Colors.primaryDark,
        flex: 1,
    },
    footer: {
        padding: Layout.spacing.lg,
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    }
});

export default CreateRequestScreen;
