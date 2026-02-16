import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOrderStore } from '../stores/orderStore';
import { Order } from '../types';
import { Colors, Typography, Layout } from '../constants/theme';
import PrimaryButton from '../components/PrimaryButton';

const OrderDetailsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { orderId } = route.params;
    const { orders } = useOrderStore();
    const [order, setOrder] = useState<Order | undefined>(undefined);

    // Animation for hero section
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const foundOrder = orders.find(o => o.id === orderId);
        setOrder(foundOrder);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [orders, orderId]);

    if (!order) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const isOffline = !order.isSynced && order.createdWhileOffline;

    const StatusHero = () => (
        <View style={styles.hero}>
            <View style={styles.iconCircle}>
                <MaterialIcons
                    name={order.status === 'Delivered' ? 'check-circle' : 'local-shipping'}
                    size={40}
                    color="white"
                />
            </View>
            <Text style={styles.heroStatus}>{order.status}</Text>
            <Text style={styles.heroDate}>
                {new Date(order.createdAt).toLocaleString(undefined, {
                    weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
            </Text>
            {isOffline && (
                <View style={styles.offlineTag}>
                    <MaterialIcons name="cloud-off" size={14} color="#B45309" />
                    <Text style={styles.offlineTagText}>Unsynced</Text>
                </View>
            )}
        </View>
    );

    const DetailItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
        <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
                <MaterialIcons name={icon} size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Background Pattern or Color */}
            <View style={styles.heroBackground} />

            <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                <StatusHero />

                <View style={styles.contentContainer}>
                    {/* Action Card */}
                    {order.status !== 'Delivered' && (
                        <View style={styles.trackingCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>Tracking Active</Text>
                                <Text style={styles.cardSubtitle}>Driver is on the way</Text>
                            </View>
                            <PrimaryButton
                                title="Live Map"
                                onPress={() => navigation.navigate('Tracking', { orderId: order.id })}
                                style={{ height: 40, paddingHorizontal: 16 }}
                            />
                        </View>
                    )}

                    {/* Details Card */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Shipment Details</Text>

                        <DetailItem
                            icon="qr-code"
                            label="Order ID"
                            value={order.serverId || order.id}
                        />
                        <View style={styles.divider} />

                        <DetailItem
                            icon="person"
                            label="Recipient"
                            value={order.recipientName}
                        />
                        <View style={styles.divider} />

                        {order.description && (
                            <DetailItem
                                icon="description"
                                label="Package Content"
                                value={order.description}
                            />
                        )}

                        <View style={styles.divider} />

                        <DetailItem
                            icon="sync"
                            label="Sync Status"
                            value={order.isSynced ? "Synced to Server" : "Stored Locally (Pending Sync)"}
                        />
                    </View>
                </View>
            </Animated.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    hero: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    heroStatus: {
        ...Typography.h1,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroDate: {
        ...Typography.body,
        color: 'rgba(255,255,255,0.8)',
    },
    offlineTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 12,
    },
    offlineTagText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#B45309',
        marginLeft: 4,
    },
    contentContainer: {
        paddingHorizontal: Layout.spacing.lg,
        marginTop: -20, // Overlap hero
    },
    trackingCard: {
        backgroundColor: Colors.card,
        borderRadius: Layout.radius.lg,
        padding: Layout.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Layout.spacing.lg,
        ...Layout.shadows.medium,
        borderLeftWidth: 4,
        borderLeftColor: Colors.success,
    },
    cardTitle: {
        ...Typography.h3,
        fontSize: 18,
    },
    cardSubtitle: {
        ...Typography.caption,
    },
    sectionCard: {
        backgroundColor: Colors.card,
        borderRadius: Layout.radius.lg,
        padding: Layout.spacing.lg,
        ...Layout.shadows.small,
    },
    sectionTitle: {
        ...Typography.h3,
        marginBottom: Layout.spacing.lg,
        color: Colors.text,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    detailIcon: {
        width: 36,
        height: 36,
        borderRadius: Layout.radius.sm,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Layout.spacing.md,
    },
    detailLabel: {
        ...Typography.caption,
        marginBottom: 2,
    },
    detailValue: {
        ...Typography.body,
        color: Colors.secondary,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Layout.spacing.md,
        marginLeft: 52, // Indent to match text start
    }
});

export default OrderDetailsScreen;
