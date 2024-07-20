import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;  // Added secureTextEntry here
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const animation = useSharedValue(0);
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  useEffect(() => {
    // Check if value is empty to determine if placeholder should show
    setShowPlaceholder(value === '');
  }, [value]);

  const focusInput = () => {
    setIsFocused(true);
    animation.value = withTiming(1, { duration: 200 });
  };

  const blurInput = () => {
    if (value === '') {
      setIsFocused(false);
      animation.value = withTiming(0, { duration: 200 });
    }
    // Always show placeholder on blur
    setShowPlaceholder(true);
  };

  const placeholderStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animation.value,
      [0, 1],
      [0, -25],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      animation.value,
      [0, 1],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH }]}>
      <AnimatedPressable onPress={focusInput} style={StyleSheet.absoluteFill}>
        <Animated.Text style={[styles.placeholder, placeholderStyle, { opacity: showPlaceholder ? 1 : 0 }]}>
          {placeholder}
        </Animated.Text>
      </AnimatedPressable>
      <AnimatedTextInput
        style={[styles.input, { width: SCREEN_WIDTH - 40 }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={focusInput}
        onBlur={blurInput}
        blurOnSubmit
        secureTextEntry={secureTextEntry} // Passed secureTextEntry here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 30,
    top: 15,
    fontSize: 16,
    color: '#aaa',
    opacity: 0, // Initially hidden
  },
});

export default AnimatedInput;