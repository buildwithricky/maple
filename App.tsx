import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import SplashScreen from './Components/SplashScreen';
import RootNavigator from './Components/Navigator/RootNavigator';

const fetchFonts = async () => {
  await Font.loadAsync({
    'CustomFont': require('./assets/fonts/Manrope-Regular.ttf'),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await fetchFonts();
        setFontLoaded(true);
      } catch (error) {
        console.warn(error);
      }
    };

    loadFonts();
  }, []);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(splashTimeout);
  }, []);

  if (showSplash || !fontLoaded) {
    return <SplashScreen />;
  }

  return <RootNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
