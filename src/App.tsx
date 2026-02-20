import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';
import { AppNavigator } from './navigation/AppNavigator';

// Initialize Mapbox — replace with your access token
MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

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
