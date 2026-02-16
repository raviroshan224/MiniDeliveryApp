import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderListScreen from '../screens/OrderListScreen';
import CreateRequestScreen from '../screens/CreateRequestScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import TrackingScreen from '../screens/TrackingScreen';
import PaymentSelectionScreen from '../screens/PaymentSelectionScreen';

export type RootStackParamList = {
    OrderList: undefined;
    CreateRequest: undefined;
    OrderDetails: { orderId: string };
    Tracking: { orderId: string };
    PaymentSelection: { orderId: string; paymentMethod: 'cod' | 'online' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="OrderList">
            <Stack.Screen name="OrderList" component={OrderListScreen} options={{ title: 'My Deliveries' }} />
            <Stack.Screen name="CreateRequest" component={CreateRequestScreen} options={{ title: 'New Delivery' }} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: 'Order Details' }} />
            <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Live Tracking' }} />
            <Stack.Screen name="PaymentSelection" component={PaymentSelectionScreen} options={{ title: 'Select Payment' }} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
