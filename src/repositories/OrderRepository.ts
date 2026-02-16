import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '../types';

const ORDERS_KEY = '@orders';

/**
 * CRITICAL ARCHITECTURE NOTE:
 * - Pure Local Implementation (Zero External Dependencies)
 * - 100% of order data persists exclusively in AsyncStorage (device storage).
 * - Sync is SIMULATED locally to satisfy assessment requirements (Section 2: Mock Data).
 * - serverId values are generated locally ("mock-timestamp") for UI demonstration.
 */
export class OrderRepository {
    static async getOrders(): Promise<Order[]> {
        try {
            const data = await AsyncStorage.getItem(ORDERS_KEY);
            const orders: Order[] = data ? JSON.parse(data) : [];
            return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }

    static async createOrder(orderData: Omit<Order, 'id' | 'isSynced' | 'createdAt' | 'createdWhileOffline' | 'serverId'>): Promise<Order> {
        // Use standard navigator.onLine check (safe for local mock mode)
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

        const newOrder: Order = {
            ...orderData,
            id: `local_${Date.now()}`,
            isSynced: false,
            createdWhileOffline: !isOnline,
            createdAt: new Date().toISOString(),
        };

        const orders = await this.getOrders();
        await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...orders]));

        return newOrder;
    }

    /**
     * Performs simulated sync and returns the updated order object from local storage.
     * Used for instant UI updates without manual refresh.
     */
    static async syncAndGetUpdatedOrder(orderId: string): Promise<Order> {
        const orders = await this.getOrders();
        const order = orders.find(o => o.id === orderId);

        if (!order || order.isSynced) return order!;

        // Only attempt simulated sync if online
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
        if (isOnline) {
            await this.syncSingleOrder(order);
            const updatedOrders = await this.getOrders();
            return updatedOrders.find(o => o.id === orderId)!;
        }

        return order;
    }

    private static async syncSingleOrder(order: Order): Promise<void> {
        // SIMULATE SUCCESSFUL SYNC (no network call)
        await new Promise(resolve => setTimeout(resolve, 500)); // Latency sim

        console.log(`✅ Simulated Sync SUCCESS: Order ${order.id}`);

        // Update local storage record immediately
        const orders = await this.getOrders();
        const updatedOrders = orders.map(o => {
            if (o.id === order.id) {
                return {
                    ...o,
                    isSynced: true,
                    serverId: `mock-${Date.now()}`, // Local mock ID
                };
            }
            return o;
        });

        await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    }

    static async syncPendingOrders(): Promise<void> {
        const orders = await this.getOrders();
        const unsynced = orders.filter(o => !o.isSynced);

        for (const order of unsynced) {
            await this.syncSingleOrder(order);
        }
    }

    static async fetchRemoteOrders(): Promise<Order[]> {
        return [];
    }
}
