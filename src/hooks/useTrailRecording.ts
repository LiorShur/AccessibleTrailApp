import { useState, useRef, useCallback } from 'react';
import uuid from 'react-native-uuid';
import {
  Trail,
  TrailCoordinate,
  Waypoint,
  RecordingState,
  RecordingSession,
} from '../models';
import { TrailInfoData } from '../components/trail-info/TrailInfoSheet';

interface UseTrailRecordingResult {
  session: RecordingSession;
  coordinates: TrailCoordinate[];
  waypoints: Waypoint[];
  elapsedSeconds: number;
  distanceMeters: number;
  elevationGainMeters: number;

  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  addCoordinate: (coord: TrailCoordinate) => void;
  addWaypoint: (wp: Omit<Waypoint, 'id' | 'createdAt'>) => void;
  deleteWaypoint: (id: string) => void;
  finalizeTrail: (info: TrailInfoData) => Trail;
  reset: () => void;
}

export function useTrailRecording(): UseTrailRecordingResult {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [coordinates, setCoordinates] = useState<TrailCoordinate[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elevationGainMeters, setElevationGainMeters] = useState(0);

  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);
  const pauseStartRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const total = now - startTimeRef.current - pausedDurationRef.current;
      setElapsedSeconds(Math.floor(total / 1000));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(() => {
    setRecordingState('recording');
    setCoordinates([]);
    setWaypoints([]);
    setDistanceMeters(0);
    setElevationGainMeters(0);
    setElapsedSeconds(0);
    startTimeRef.current = Date.now();
    pausedDurationRef.current = 0;
    startTimer();
  }, [startTimer]);

  const pauseRecording = useCallback(() => {
    setRecordingState('paused');
    pauseStartRef.current = Date.now();
    stopTimer();
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    setRecordingState('recording');
    pausedDurationRef.current += Date.now() - pauseStartRef.current;
    startTimer();
  }, [startTimer]);

  const stopRecording = useCallback(() => {
    setRecordingState('idle');
    stopTimer();
  }, [stopTimer]);

  const addCoordinate = useCallback((coord: TrailCoordinate) => {
    setCoordinates((prev) => {
      const updated = [...prev, coord];

      // Update distance
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        const d = haversineDistance(
          last.latitude,
          last.longitude,
          coord.latitude,
          coord.longitude
        );
        setDistanceMeters((prevDist) => prevDist + d);

        // Update elevation gain
        if (coord.elevation !== undefined && last.elevation !== undefined) {
          const gain = coord.elevation - last.elevation;
          if (gain > 0) {
            setElevationGainMeters((prevElev) => prevElev + gain);
          }
        }
      }

      return updated;
    });
  }, []);

  const addWaypoint = useCallback(
    (wp: Omit<Waypoint, 'id' | 'createdAt'>) => {
      const newWaypoint: Waypoint = {
        ...wp,
        id: uuid.v4() as string,
        createdAt: new Date().toISOString(),
      };
      setWaypoints((prev) => [...prev, newWaypoint]);
    },
    []
  );

  const deleteWaypoint = useCallback((id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  }, []);

  const finalizeTrail = useCallback(
    (info: TrailInfoData): Trail => {
      return {
        id: uuid.v4() as string,
        name: info.name,
        description: info.description,
        difficulty: info.difficulty,
        surfaceType: info.surfaceType,
        accessibilityFeatures: info.accessibilityFeatures,
        coordinates,
        waypoints,
        distanceMeters,
        elevationGainMeters,
        estimatedDurationMinutes: Math.ceil(elapsedSeconds / 60),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: false,
      };
    },
    [coordinates, waypoints, distanceMeters, elevationGainMeters, elapsedSeconds]
  );

  const reset = useCallback(() => {
    setRecordingState('idle');
    setCoordinates([]);
    setWaypoints([]);
    setDistanceMeters(0);
    setElevationGainMeters(0);
    setElapsedSeconds(0);
    stopTimer();
  }, [stopTimer]);

  const session: RecordingSession = {
    state: recordingState,
    trail: {},
    pausedDurationMs: pausedDurationRef.current,
  };

  return {
    session,
    coordinates,
    waypoints,
    elapsedSeconds,
    distanceMeters,
    elevationGainMeters,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    addCoordinate,
    addWaypoint,
    deleteWaypoint,
    finalizeTrail,
    reset,
  };
}

/** Calculate distance between two GPS points in meters (Haversine formula). */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
