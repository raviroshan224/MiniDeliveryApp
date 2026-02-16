import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }: any) => {
    if (error) {
        console.error('Background location task error:', error);
        return;
    }
    if (data) {
        const { locations } = data;
        console.log('Background Location Update:', locations[0].coords);
        // In a real app, you might save this locally or send to a server
    }
});

export const startBackgroundLocation = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
        throw new Error('Foreground location permission not granted');
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
        throw new Error('Background location permission not granted');
    }

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 15000,
        distanceInterval: 50,
        foregroundService: {
            notificationTitle: 'Delivery Tracking',
            notificationBody: 'Live tracking is active in the background',
            notificationColor: '#007AFF',
        },
    });
};

export const stopBackgroundLocation = async () => {
    const isStarted = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
    if (isStarted) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        console.log('Background location updates stopped.');
    }
};
