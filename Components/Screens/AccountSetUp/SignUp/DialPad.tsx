import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DialPadProps {
  onPress: (value: string) => void;
  fingerprintPress?: () => void; // Optional prop
}

const DialPad: React.FC<DialPadProps> = ({ onPress, fingerprintPress }) => {
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [fingerprintPress ? 'Fingerprint' : '', '0', 'Del'],
  ];

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
                button === 'Fingerprint' && styles.fingerprintButton
              ]}
              onPress={() => button === 'Fingerprint' ? fingerprintPress && fingerprintPress() : onPress(button)}
              disabled={button === ''}
            >
              {button === 'Del' ? (
                <Ionicons name="backspace" size={24} color="black" />
              ) : button === 'Fingerprint' ? (
                <Ionicons name="finger-print" size={32} color="#EE0979" />
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
  fingerprintButton: {
    // marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DialPad;
