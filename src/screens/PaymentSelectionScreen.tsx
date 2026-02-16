import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

const PaymentSelectionScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { orderId, paymentMethod } = route.params;
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(!!state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    const handlePayment = () => {
        if (paymentMethod === 'online' && !isOnline) {
            Alert.alert('Offline', 'Online payment is currently unavailable. Switch to COD or wait for internet.');
            return;
        }
        Alert.alert('Success', `Payment processed via ${paymentMethod.toUpperCase()}`);
        navigation.navigate('OrderList' as never);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirm Payment</Text>
            <Text style={styles.subtitle}>Order ID: {orderId}</Text>

            <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Selected Method:</Text>
                <Text style={styles.summaryValue}>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</Text>
            </View>

            {paymentMethod === 'online' && !isOnline && (
                <View style={styles.warningBox}>
                    <Text style={styles.warningText}>Internet connection required for online payment.</Text>
                </View>
            )}

            <TouchableOpacity
                style={[styles.payBtn, (paymentMethod === 'online' && !isOnline) && styles.disabledBtn]}
                onPress={handlePayment}
            >
                <Text style={styles.payText}>Complete Transaction</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    subtitle: { color: '#666', marginBottom: 30 },
    summaryBox: { backgroundColor: '#F9F9F9', padding: 20, borderRadius: 12, marginBottom: 20 },
    summaryLabel: { color: '#888', marginBottom: 5 },
    summaryValue: { fontSize: 18, fontWeight: '600' },
    warningBox: { backgroundColor: '#FFF5F5', padding: 15, borderRadius: 8, marginBottom: 20 },
    warningText: { color: '#E53E3E', textAlign: 'center' },
    payBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
    disabledBtn: { backgroundColor: '#CCC' },
    payText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});

export default PaymentSelectionScreen;
