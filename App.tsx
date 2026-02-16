import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { useOrderStore } from './src/stores/orderStore';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export default function App() {
  const { fetchOrders, syncPending } = useOrderStore();

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Online/Offline status listener
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('App is online - triggering background sync');
        syncPending();
      } else {
        console.log('App is offline');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
