import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';
import { AppNavigator } from './navigation/AppNavigator';
import { config } from './config';

// Initialize Mapbox — set your token in src/config.ts
MapboxGL.setAccessToken(config.mapbox.accessToken);

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
