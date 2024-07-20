import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';

interface PaginationProps {
  data: any[];
  x: Animated.SharedValue<number>;
  screenWidth: number;
}

interface PaginationCompProps {
  i: number;
  x: Animated.SharedValue<number>;
  screenWidth: number;
}

const Pagination: React.FC<PaginationProps> = ({ data, x, screenWidth }) => {
  const PaginationComp: React.FC<PaginationCompProps> = ({ i, x, screenWidth }) => {
    const animatedDotStyled = useAnimatedStyle(() => {
      const widthAnimation = interpolate(
        x.value,
        [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
        [10, 20, 10],
        Extrapolate.CLAMP
      );
      const opacityAnimation = interpolate(
        x.value,
        [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
        [0.5, 1, 0.5],
        Extrapolate.CLAMP
      );
      return {
        width: widthAnimation,
        opacity: opacityAnimation,
      };
    });

    return <Animated.View style={[styles.dots, animatedDotStyled]} />;
  };

  return (
    <View style={styles.paginationContainer}>
      {data.map((_, i) => (
        <PaginationComp i={i} key={i} x={x} screenWidth={screenWidth} />
      ))}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dots: {
    width: 10,
    height: 10,
    backgroundColor: '#EE0979',
    marginHorizontal: 10,
    borderRadius: 5,
  },
});
