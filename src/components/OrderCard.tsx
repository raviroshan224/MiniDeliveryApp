import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Order } from '../types';
import { Colors, Typography, Layout } from '../constants/theme';

interface OrderCardProps {
    order: Order;
    onPress: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return Colors.success;
            case 'In Transit': return Colors.primary;
            default: return Colors.warning;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Delivered': return 'check-circle';
            case 'In Transit': return 'local-shipping';
            default: return 'schedule';
        }
    };

    // Offline indicator logic
    const showOfflineStripe = !order.isSynced && order.createdWhileOffline;

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                style={[
                    styles.card,
                    showOfflineStripe && styles.offlineCard
                ]}
            >
                {/* Offline Stripe */}
                {showOfflineStripe && <View style={styles.offlineStripe} />}

                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.idContainer}>
                            <Text style={styles.idLabel}>ID:</Text>
                            <Text style={styles.idText}>{order.serverId || order.id}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                            <MaterialIcons name={getStatusIcon(order.status)} size={14} color={getStatusColor(order.status)} />
                            <Text style={[styles.badgeText, { color: getStatusColor(order.status) }]}>
                                {order.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.iconBox}>
                            <MaterialIcons name="person" size={20} color={Colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.label}>Recipient</Text>
                            <Text style={styles.value}>{order.recipientName}</Text>
                        </View>
                    </View>

                    <Text style={styles.date}>
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </Text>

                    {/* Offline Badge (Bottom) */}
                    {showOfflineStripe && (
                        <View style={styles.offlineBadge}>
                            <MaterialIcons name="cloud-off" size={12} color={Colors.offline} />
                            <Text style={styles.offlineText}>Saved Offline</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: Layout.radius.lg,
        marginBottom: Layout.spacing.md,
        ...Layout.shadows.small,
        overflow: 'hidden', // Contain stripe
        position: 'relative',
    },
    offlineCard: {
        borderLeftWidth: 0, // Handled by stripe view
    },
    offlineStripe: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: Colors.offline,
        zIndex: 1,
    },
    content: {
        padding: Layout.spacing.md,
        paddingLeft: Layout.spacing.lg, // Make room for potential stripe visual balance
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.sm,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    idLabel: {
        ...Typography.caption,
        marginRight: 4,
    },
    idText: {
        ...Typography.body,
        fontWeight: '600',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Tech feel for IDs
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: Layout.radius.round,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: Layout.spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Layout.spacing.sm,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: Layout.radius.sm,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Layout.spacing.sm,
    },
    label: {
        ...Typography.caption,
    },
    value: {
        ...Typography.body,
        fontWeight: '500',
    },
    date: {
        ...Typography.caption,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    offlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        alignSelf: 'flex-start',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    offlineText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#B45309',
        marginLeft: 4,
    }
});

export default OrderCard;
