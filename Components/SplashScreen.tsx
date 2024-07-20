import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import logo from "../assets/MappleApp/logo.png";
import CustomText from './CustomFont/CustomText';

const SplashScreen = () => {
  const spinAnimation = useRef(new Animated.Value(0)).current;
  const zoomAnimation = useRef(new Animated.Value(1)).current;
  const slideAnimation = useRef(new Animated.Value(-800)).current; // Start off-screen

  useEffect(() => {
    // Spin and zoom the logo multiple times
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnimation, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnimation, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 3, // Loop the animation 3 times
      }
    ).start();

    // Slide the text from left to right after the spin/zoom animation completes
    setTimeout(() => {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Stop the spin and zoom animations when the text slides in
      spinAnimation.stopAnimation();
      zoomAnimation.stopAnimation();
    }, 3000);
  }, []);

  const spin = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const zoom = zoomAnimation.interpolate({
    inputRange: [0.8, 1, 1.2],
    outputRange: [0.8, 1, 1.2],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={logo}
        style={[styles.image, { transform: [{ rotate: spin }, { scale: zoom }] }]}
      />
      <Animated.Text style={[styles.text, { transform: [{ translateX: slideAnimation }] }]}>
        <CustomText style={styles.text}>Maple PayExchange</CustomText>
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 43,
  },
  text: {
    fontSize: 24,
    fontWeight: "500",
    marginTop: 20,
  },
});

export default SplashScreen;