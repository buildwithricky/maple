import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, Dimensions, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface CustomButton2Props {
  width: string | number;
  backgroundColor?: string; // Make this optional if using gradient
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  gradientColors?: string[]; // New prop for gradient colors
  textStyle?: TextStyle;
  icon?: string; // Optional prop for the icon
}

const CustomButton2: React.FC<CustomButton2Props> = ({ width, backgroundColor, title, onPress, gradientColors, textStyle, icon }) => {
  const buttonStyle: ViewStyle = {
    width: width as any, // Type-cast width to any
    ...(gradientColors ? {} : { backgroundColor }),
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
    >
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { width: width as any }]} // Type-cast width to any
        >
          <View style={styles.buttonContent}>
            {icon && <Ionicons name={icon} size={20} color="white" style={styles.icon} />}
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.buttonContent}>
          {icon && <Ionicons name={icon} size={20} color="white" style={styles.icon} />}
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    padding: 13,
  },
});

export default CustomButton2;
