import { create } from 'zustand';
import { Order } from '../types';
import { OrderRepository } from '../repositories/OrderRepository';

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    createOrder: (orderData: Omit<Order, 'id' | 'isSynced' | 'createdAt' | 'createdWhileOffline' | 'serverId'>) => Promise<void>;
    syncPending: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
            const orders = await OrderRepository.getOrders();
            set({ orders, loading: false });
        } catch (error) {
            set({ error: (error as Error).message, loading: false });
        }
    },

    createOrder: async (orderData) => {
        // Use standard navigator.onLine check (safe for local mock mode)
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

        // Optimistic Update: Add to state immediately
        const optimisticOrder: Order = {
            ...orderData,
            id: `temp_${Date.now()}`,
            isSynced: false,
            createdWhileOffline: !isOnline,
            createdAt: new Date().toISOString(),
        };

        set((state) => ({ orders: [optimisticOrder, ...state.orders] }));

        try {
            const newOrder = await OrderRepository.createOrder(orderData);

            // CRITICAL FIX: Refresh store state AFTER sync completes (online only)
            if (isOnline) {
                try {
                    console.log('🔄 Online flow: Waiting for sync to complete...');
                    // Wait for sync to finish AND get updated order state
                    await OrderRepository.syncAndGetUpdatedOrder(newOrder.id);

                    // Increased delay to 500ms to guarantee AsyncStorage write is committed
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Update store state IMMEDIATELY with fresh data from AsyncStorage
                    const freshOrders = await OrderRepository.getOrders();
                    console.log('✅ Fresh orders loaded from storage:', freshOrders.length);

                    set({ orders: [...freshOrders] }); // Force new reference
                    return;
                } catch (syncError) {
                    console.warn('⚠️ Sync refresh failed, keeping local state:', syncError);
                    // Fail silently, keep the local version in state
                }
            }

            // Re-fetch fallback to ensure state is clean
            await get().fetchOrders();
        } catch (error) {
            set({ error: (error as Error).message });
            await get().fetchOrders();
        }
    },

    syncPending: async () => {
        set({ loading: true });
        try {
            await OrderRepository.syncPendingOrders();
            await get().fetchOrders();
        } catch (error) {
            set({ error: (error as Error).message });
        } finally {
            set({ loading: false });
        }
    },
}));
