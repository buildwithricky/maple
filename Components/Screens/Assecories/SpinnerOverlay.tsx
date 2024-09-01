import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const CustomSpinner = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1, // Repeat infinitely
      false // Don't reverse the animation
    );
  }, [rotation]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.spinnerContainer, animatedStyles]}>
      <LinearGradient
        colors={['#EE0979', '#fff']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.spinner}
      />
      <View style={styles.innerCircle} />
    </Animated.View>
  );
};

const SpinnerOverlay = () => (
  <View style={styles.overlayContainer}>
    {Platform.OS === 'ios' ? (
      <BlurView intensity={20} style={styles.overlay}>
        <CustomSpinner />
      </BlurView>
    ) : (
      <View style={styles.overlay}>
        <CustomSpinner />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: 'white',
    borderTopColor: 'transparent',
  },
  innerCircle: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'white',
  },
});

export default SpinnerOverlay;
