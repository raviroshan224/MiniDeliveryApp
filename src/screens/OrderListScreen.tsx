import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity, RefreshControl, Image, StatusBar } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOrderStore } from '../stores/orderStore';
import { Order } from '../types';
import { Colors, Typography, Layout } from '../constants/theme';
import OrderCard from '../components/OrderCard';

const OrderListScreen = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { orders, fetchOrders, loading } = useOrderStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isFocused) {
            fetchOrders();
        }
    }, [isFocused]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    // Organize data for SectionList
    const activeOrders = orders.filter(o => o.status !== 'Delivered');
    const completedOrders = orders.filter(o => o.status === 'Delivered');

    const sections = [
        { title: 'Active Deliveries', data: activeOrders },
        { title: 'History', data: completedOrders },
    ].filter(section => section.data.length > 0);

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Hello there! 👋</Text>
                <Text style={styles.title}>My Deliveries</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn}>
                <MaterialIcons name="person-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            {/* Placeholder for illustration - using icon for now */}
            <View style={styles.emptyIconCircle}>
                <MaterialIcons name="local-shipping" size={48} color={Colors.primaryLight} />
            </View>
            <Text style={styles.emptyTitle}>No Deliveries Yet</Text>
            <Text style={styles.emptySubtitle}>
                Create your first delivery request and track it here.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
                    />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                        tintColor={Colors.primary}
                    />
                }
                stickySectionHeadersEnabled={false}
            />

            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('CreateRequest')}
            >
                <MaterialIcons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        padding: Layout.spacing.md,
        paddingBottom: 100, // Space for FAB
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.lg,
        marginTop: Layout.spacing.sm,
    },
    greeting: {
        ...Typography.caption,
        color: Colors.textLight,
        marginBottom: 4,
    },
    title: {
        ...Typography.h1,
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: Layout.radius.round,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    sectionHeader: {
        ...Typography.h3,
        marginTop: Layout.spacing.md,
        marginBottom: Layout.spacing.md,
        color: Colors.text,
    },
    fab: {
        position: 'absolute',
        bottom: Layout.spacing.lg,
        right: Layout.spacing.lg,
        backgroundColor: Colors.primary,
        width: 64,
        height: 64,
        borderRadius: Layout.radius.round,
        justifyContent: 'center',
        alignItems: 'center',
        ...Layout.shadows.medium,
        elevation: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: Layout.radius.round,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Layout.spacing.md,
        opacity: 0.5,
    },
    emptyTitle: {
        ...Typography.h3,
        color: Colors.text,
        marginBottom: Layout.spacing.sm,
    },
    emptySubtitle: {
        ...Typography.body,
        textAlign: 'center',
        color: Colors.textLight,
        maxWidth: '80%',
    },
});

export default OrderListScreen;
