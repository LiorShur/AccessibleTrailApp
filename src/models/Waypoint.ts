/** Types of waypoints a user can place along a trail. */
export type WaypointType =
  | 'rest_area'
  | 'scenic_viewpoint'
  | 'water_source'
  | 'restroom'
  | 'parking'
  | 'trailhead'
  | 'obstacle'
  | 'hazard'
  | 'surface_change'
  | 'steep_section'
  | 'intersection'
  | 'information'
  | 'photo_spot'
  | 'custom';

export const waypointTypeInfo: Record<
  WaypointType,
  { label: string; icon: string; color: string; category: 'amenity' | 'caution' | 'navigation' | 'interest' }
> = {
  rest_area: {
    label: 'Rest Area',
    icon: 'bench',
    color: '#2E7D32',
    category: 'amenity',
  },
  scenic_viewpoint: {
    label: 'Scenic Viewpoint',
    icon: 'binoculars',
    color: '#1565C0',
    category: 'interest',
  },
  water_source: {
    label: 'Water Source',
    icon: 'water',
    color: '#0277BD',
    category: 'amenity',
  },
  restroom: {
    label: 'Restroom',
    icon: 'restroom',
    color: '#2E7D32',
    category: 'amenity',
  },
  parking: {
    label: 'Parking',
    icon: 'parking',
    color: '#455A64',
    category: 'amenity',
  },
  trailhead: {
    label: 'Trailhead',
    icon: 'flag',
    color: '#2D6A4F',
    category: 'navigation',
  },
  obstacle: {
    label: 'Obstacle',
    icon: 'alert-circle',
    color: '#E65100',
    category: 'caution',
  },
  hazard: {
    label: 'Hazard',
    icon: 'alert-triangle',
    color: '#C62828',
    category: 'caution',
  },
  surface_change: {
    label: 'Surface Change',
    icon: 'swap-horizontal',
    color: '#F57F17',
    category: 'caution',
  },
  steep_section: {
    label: 'Steep Section',
    icon: 'trending-up',
    color: '#E65100',
    category: 'caution',
  },
  intersection: {
    label: 'Trail Junction',
    icon: 'directions-fork',
    color: '#455A64',
    category: 'navigation',
  },
  information: {
    label: 'Info Sign',
    icon: 'information',
    color: '#1565C0',
    category: 'interest',
  },
  photo_spot: {
    label: 'Photo Spot',
    icon: 'camera',
    color: '#6A1B9A',
    category: 'interest',
  },
  custom: {
    label: 'Custom',
    icon: 'map-marker',
    color: '#455A64',
    category: 'interest',
  },
};

/** A single waypoint placed on a trail. */
export interface Waypoint {
  id: string;
  type: WaypointType;
  latitude: number;
  longitude: number;
  elevation?: number;
  name?: string;
  description?: string;
  photoUri?: string;
  accessibilityNote?: string;
  createdAt: string; // ISO 8601
}
