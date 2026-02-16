import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Alert, Platform } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';

// Define task outside of component
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        console.error('Background location task error:', error);
        return;
    }
    if (data) {
        const { locations } = data as { locations: Location.LocationObject[] };
        // In a real app, we would upload these to a server. 
        // For this local-only assessment, we just log them to demonstrate the capability.
        console.log('📍 Background Location:', locations[0]?.coords);
    }
});

export const startBackgroundLocation = async () => {
    try {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            Alert.alert('Permission Denied', 'Allow location access to track deliveries.');
            return;
        }

        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            Alert.alert('Background Permission Denied', 'Select "Allow Always" to enable delivery tracking.');
            return;
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 15000, // 15 seconds (Battery optimization)
            distanceInterval: 50, // 50 meters
            foregroundService: {
                notificationTitle: "SwiftDeliver Tracking",
                notificationBody: "Tracking your delivery in background...",
                notificationColor: "#2563EB",
            },
            showsBackgroundLocationIndicator: true, // iOS
        });

        console.log('✅ Background tracking started');
    } catch (error) {
        console.warn('Failed to start background location:', error);
    }
};

export const stopBackgroundLocation = async () => {
    try {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (hasStarted) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            console.log('🛑 Background tracking stopped');
        }
    } catch (error) {
        console.warn('Failed to stop background location:', error);
    }
};
