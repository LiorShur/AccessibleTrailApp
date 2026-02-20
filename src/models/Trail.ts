import { AccessibilityFeature, DifficultyLevel, SurfaceType } from './Accessibility';
import { Waypoint } from './Waypoint';

/** A GPS coordinate with optional elevation. */
export interface TrailCoordinate {
  latitude: number;
  longitude: number;
  elevation?: number;
  timestamp: string; // ISO 8601
}

/** A recorded trail with all metadata. */
export interface Trail {
  id: string;
  name: string;
  description?: string;
  difficulty: DifficultyLevel;
  surfaceType: SurfaceType;
  accessibilityFeatures: AccessibilityFeature[];
  coordinates: TrailCoordinate[];
  waypoints: Waypoint[];

  // Computed stats
  distanceMeters: number;
  elevationGainMeters: number;
  estimatedDurationMinutes: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  authorId?: string;

  // Optional media
  coverPhotoUri?: string;
}

/** States during trail recording. */
export type RecordingState = 'idle' | 'recording' | 'paused';

/** Live recording session data. */
export interface RecordingSession {
  state: RecordingState;
  trail: Partial<Trail>;
  startTime?: string;
  pausedDurationMs: number;
  currentLocation?: TrailCoordinate;
}
