import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import faceIdIcon from './faceIdIcon.png';

interface DialPadProps {
  onPress: (value: string) => void;
  biometricPress?: () => void;
  biometricType: 'none' | 'fingerprint' | 'faceId';
}

const DialPad: React.FC<DialPadProps> = ({ onPress, biometricPress, biometricType }) => {
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [biometricType !== 'none' ? 'Biometric' : '', '0', 'Del'],
  ];

  const renderBiometricIcon = () => {
    switch (biometricType) {
      case 'fingerprint':
        return <Ionicons name="finger-print" size={32} color="#EE0979" />;
      case 'faceId':
        return <Image source={faceIdIcon} style={{ width: 32, height: 32 }} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((button, buttonIndex) => (
            <TouchableOpacity
              key={buttonIndex}
              style={[
                styles.button,
                button === '' && styles.emptyButton,
                button === 'Biometric' && styles.biometricButton
              ]}
              onPress={() => button === 'Biometric' ? biometricPress && biometricPress() : onPress(button)}
              disabled={button === ''}
            >
              {button === 'Del' ? (
                <Ionicons name="backspace" size={24} color="black" />
              ) : button === 'Biometric' ? (
                renderBiometricIcon()
              ) : (
                button !== '' && <Text style={styles.buttonText}>{button}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 24,
  },
  biometricButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DialPad;