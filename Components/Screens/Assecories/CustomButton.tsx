import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomButtonProps {
  width: string | number;
  backgroundColor?: string;
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  gradientColors?: string[];
  textStyle?: TextStyle;
  disabled?: boolean; // Add disabled prop
}

const CustomButton: React.FC<CustomButtonProps> = ({ width, backgroundColor, title, onPress, gradientColors, textStyle, disabled }) => {
  const buttonStyle: ViewStyle = {
    width: width as any,
    ...(gradientColors ? {} : { backgroundColor }),
    opacity: disabled ? 0.5 : 1, // Apply opacity for disabled state
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled} // Pass the disabled state to TouchableOpacity
    >
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { width: width as any }]}
        >
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </LinearGradient>
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 59,
    alignItems: 'center',
  },
  gradient: {
    borderRadius: 59,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    padding: 13,
  },
});

export default CustomButton;
