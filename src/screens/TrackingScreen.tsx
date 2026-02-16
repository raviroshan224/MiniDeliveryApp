import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Layout } from '../constants/theme';
import PrimaryButton from '../components/PrimaryButton';

const TrackingScreen = () => {
    return (
        <View style={styles.container}>
            {/* Simulated Map Background */}
            <View style={styles.mapPlaceholder}>
                <View style={styles.gridLines} />
                <View style={styles.mapCenter}>
                    <View style={styles.pulseRing} />
                    <MaterialIcons name="navigation" size={32} color={Colors.primary} style={{ transform: [{ rotate: '45deg' }] }} />
                </View>
                <Text style={styles.mapLabel}>Map Unavailable (Offline Demo)</Text>
            </View>

            {/* Bottom Sheet - Driver Info */}
            <View style={styles.bottomSheet}>
                <View style={styles.handle} />

                <View style={styles.driverRow}>
                    <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>Michael S.</Text>
                        <Text style={styles.vehicleInfo}>Toyota Prius • 4.8 ★</Text>
                    </View>
                    <View style={styles.driverAvatar}>
                        <MaterialIcons name="person" size={32} color="#FFF" />
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>ETA</Text>
                        <Text style={styles.statValue}>15 min</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Distance</Text>
                        <Text style={styles.statValue}>2.3 mi</Text>
                    </View>
                </View>

                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
                <Text style={styles.statusText}>On the way to pickup</Text>

                <View style={styles.actions}>
                    <PrimaryButton title="Contact Driver" onPress={() => { }} style={{ flex: 1, marginRight: 8 }} />
                    <View style={styles.cancelBtn}>
                        <MaterialIcons name="close" size={24} color={Colors.error} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E7EB',
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A8D8B9', // Map-like green
    },
    gridLines: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F3F4F6', // Street color
        opacity: 0.3,
        // In real app, this would be a MapView
    },
    mapCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(37, 99, 235, 0.4)',
    },
    mapLabel: {
        marginTop: 16,
        ...Typography.caption,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 4,
        borderRadius: 4,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: Layout.spacing.lg,
        ...Layout.shadows.large,
        paddingBottom: 40,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: Layout.spacing.lg,
    },
    driverRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Layout.spacing.lg,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        ...Typography.h2,
    },
    vehicleInfo: {
        ...Typography.caption,
        marginTop: 4,
    },
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: Layout.spacing.lg,
    },
    statItem: {
        alignItems: 'flex-start',
        marginRight: Layout.spacing.xl,
    },
    statLabel: {
        ...Typography.caption,
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        ...Typography.h3,
        color: Colors.primary,
    },
    verticalDivider: {
        width: 1,
        height: '100%',
        backgroundColor: Colors.border,
        marginRight: Layout.spacing.xl,
    },
    progressBar: {
        height: 6,
        backgroundColor: Colors.inputBg,
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.success,
    },
    statusText: {
        ...Typography.caption,
        alignSelf: 'flex-end',
        marginBottom: Layout.spacing.lg,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancelBtn: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#FEE2E2', // Light red
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default TrackingScreen;
