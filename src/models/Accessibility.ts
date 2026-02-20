/** Accessibility features that can be tagged on a trail or trail segment. */
export type AccessibilityFeature =
  | 'wheelchair_accessible'
  | 'stroller_friendly'
  | 'paved_surface'
  | 'gentle_slope'
  | 'handrails'
  | 'rest_areas'
  | 'accessible_parking'
  | 'accessible_restrooms'
  | 'tactile_indicators'
  | 'audio_guides'
  | 'wide_path'
  | 'level_terrain'
  | 'shade_available'
  | 'water_fountain';

/** Human-readable labels and icons for each accessibility feature. */
export const accessibilityFeatureInfo: Record<
  AccessibilityFeature,
  { label: string; icon: string; description: string }
> = {
  wheelchair_accessible: {
    label: 'Wheelchair Accessible',
    icon: 'wheelchair',
    description: 'Full wheelchair access with firm, stable surface',
  },
  stroller_friendly: {
    label: 'Stroller Friendly',
    icon: 'baby-carriage',
    description: 'Smooth enough for strollers and pushchairs',
  },
  paved_surface: {
    label: 'Paved Surface',
    icon: 'road',
    description: 'Asphalt, concrete, or brick surface',
  },
  gentle_slope: {
    label: 'Gentle Slope',
    icon: 'trending-up',
    description: 'Grade does not exceed 5% (1:20)',
  },
  handrails: {
    label: 'Handrails',
    icon: 'handrail',
    description: 'Handrails available on slopes and stairs',
  },
  rest_areas: {
    label: 'Rest Areas',
    icon: 'bench',
    description: 'Benches or rest stops along the trail',
  },
  accessible_parking: {
    label: 'Accessible Parking',
    icon: 'parking',
    description: 'Designated accessible parking spaces nearby',
  },
  accessible_restrooms: {
    label: 'Accessible Restrooms',
    icon: 'restroom',
    description: 'ADA-compliant restroom facilities',
  },
  tactile_indicators: {
    label: 'Tactile Indicators',
    icon: 'dots-grid',
    description: 'Tactile ground surface indicators for visually impaired',
  },
  audio_guides: {
    label: 'Audio Guides',
    icon: 'headphones',
    description: 'Audio descriptions or guide available',
  },
  wide_path: {
    label: 'Wide Path',
    icon: 'arrows-horizontal',
    description: 'Path width of at least 1.5 meters (5 feet)',
  },
  level_terrain: {
    label: 'Level Terrain',
    icon: 'minus',
    description: 'Flat terrain with minimal elevation change',
  },
  shade_available: {
    label: 'Shade Available',
    icon: 'tree',
    description: 'Tree cover or structures providing shade',
  },
  water_fountain: {
    label: 'Water Fountain',
    icon: 'water',
    description: 'Accessible drinking water available',
  },
};

/** Surface types for trail segments. */
export type SurfaceType =
  | 'paved'
  | 'gravel'
  | 'packed_dirt'
  | 'boardwalk'
  | 'natural'
  | 'sand'
  | 'grass'
  | 'mulch';

export const surfaceTypeInfo: Record<
  SurfaceType,
  { label: string; icon: string; accessibilityNote: string }
> = {
  paved: {
    label: 'Paved',
    icon: 'road-variant',
    accessibilityNote: 'Excellent for wheelchairs and mobility aids',
  },
  gravel: {
    label: 'Gravel',
    icon: 'dots-hexagon',
    accessibilityNote: 'May be difficult for wheelchairs; firm gravel is passable',
  },
  packed_dirt: {
    label: 'Packed Dirt',
    icon: 'terrain',
    accessibilityNote: 'Firm when dry; may become muddy in wet conditions',
  },
  boardwalk: {
    label: 'Boardwalk',
    icon: 'view-dashboard',
    accessibilityNote: 'Usually accessible; check for gaps between boards',
  },
  natural: {
    label: 'Natural',
    icon: 'forest',
    accessibilityNote: 'Unimproved surface; likely not wheelchair accessible',
  },
  sand: {
    label: 'Sand',
    icon: 'wave',
    accessibilityNote: 'Not accessible for wheelchairs without beach mats',
  },
  grass: {
    label: 'Grass',
    icon: 'grass',
    accessibilityNote: 'Soft surface; difficult for wheelchairs when wet',
  },
  mulch: {
    label: 'Mulch',
    icon: 'leaf',
    accessibilityNote: 'Soft surface; generally not wheelchair accessible',
  },
};

/** Difficulty levels with accessibility context. */
export type DifficultyLevel = 'easy' | 'moderate' | 'difficult' | 'very_difficult';

export const difficultyInfo: Record<
  DifficultyLevel,
  { label: string; color: string; description: string }
> = {
  easy: {
    label: 'Easy',
    color: '#2E7D32',
    description: 'Flat, wide, firm surface. Suitable for all ability levels.',
  },
  moderate: {
    label: 'Moderate',
    color: '#1565C0',
    description: 'Some elevation change or narrow sections. Generally passable with assistance.',
  },
  difficult: {
    label: 'Difficult',
    color: '#E65100',
    description: 'Steep sections, rough surface, or obstacles. Limited accessibility.',
  },
  very_difficult: {
    label: 'Very Difficult',
    color: '#B71C1C',
    description: 'Steep, rough, narrow. Not recommended for mobility aids.',
  },
};
