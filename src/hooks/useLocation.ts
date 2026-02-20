import { useState, useEffect, useRef, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { TrailCoordinate } from '../models';

interface UseLocationOptions {
  /** Update interval in milliseconds. Default 3000 */
  interval?: number;
  /** Minimum distance change in meters to trigger update. Default 5 */
  distanceFilter?: number;
  /** Whether to actively watch position. Default false */
  tracking?: boolean;
}

interface UseLocationResult {
  currentLocation: TrailCoordinate | null;
  error: string | null;
  requestPermission: () => Promise<boolean>;
}

export function useLocation(options: UseLocationOptions = {}): UseLocationResult {
  const { distanceFilter = 5, tracking = false } = options;
  const [currentLocation, setCurrentLocation] = useState<TrailCoordinate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      Geolocation.requestAuthorization(
        () => resolve(true),
        () => {
          setError('Location permission denied');
          resolve(false);
        }
      );
    });
  }, []);

  useEffect(() => {
    if (!tracking) {
      // Just get a single position
      Geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            elevation: position.coords.altitude ?? undefined,
            timestamp: new Date(position.timestamp).toISOString(),
          });
          setError(null);
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, timeout: 15000 }
      );
      return;
    }

    // Watch position for active tracking
    watchId.current = Geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          elevation: position.coords.altitude ?? undefined,
          timestamp: new Date(position.timestamp).toISOString(),
        });
        setError(null);
      },
      (err) => setError(err.message),
      {
        enableHighAccuracy: true,
        distanceFilter,
        interval: options.interval,
      }
    );

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, [tracking, distanceFilter, options.interval]);

  return { currentLocation, error, requestPermission };
}
