import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CheckboxProps {
  isChecked: boolean;
  onPress: () => void;
  text: string;
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onPress, text, children }) => {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={[styles.checkbox, isChecked ? styles.checked : null]}
        onPress={onPress}
      >
        {isChecked && <FontAwesome name="check" size={15} color="white" />}
      </TouchableOpacity>
      <Text style={styles.checkboxText}>
        {text}
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 15
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 0.5,
    borderColor: '#D2D2D5',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  checked: {
    backgroundColor: 'green',
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: "#1C202B",
    lineHeight: 15
  },
});

export default Checkbox;