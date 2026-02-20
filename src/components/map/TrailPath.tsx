import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { colors } from '../../theme/colors';
import { TrailCoordinate } from '../../models';

interface TrailPathProps {
  coordinates: TrailCoordinate[];
  isRecording: boolean;
}

export const TrailPath: React.FC<TrailPathProps> = ({
  coordinates,
  isRecording,
}) => {
  const geoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates.map((c) => [c.longitude, c.latitude]),
        },
        properties: {},
      },
    ],
  };

  return (
    <MapboxGL.ShapeSource id="trailPath" shape={geoJson}>
      {/* Trail line */}
      <MapboxGL.LineLayer
        id="trailLine"
        style={{
          lineColor: isRecording
            ? colors.map.trailLineRecording
            : colors.map.trailLine,
          lineWidth: 4,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Subtle outline for visibility on varied terrain */}
      <MapboxGL.LineLayer
        id="trailLineOutline"
        belowLayerID="trailLine"
        style={{
          lineColor: isRecording
            ? 'rgba(211, 47, 47, 0.3)'
            : 'rgba(45, 106, 79, 0.3)',
          lineWidth: 8,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
