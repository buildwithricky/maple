import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface DateOfBirthInputProps {
  dateOfBirth: Date;
  setShowDatePicker: (show: boolean) => void;
  showDatePicker: boolean;
  handleDateChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
}

const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({
  dateOfBirth,
  setShowDatePicker,
  showDatePicker,
  handleDateChange
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your Date Of Birth</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.inputContainer}
      >
        <Text style={styles.inputText}>
          {dateOfBirth.toISOString().split('T')[0]}
        </Text>
        <Ionicons name="calendar-outline" size={24} color="#888" />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
});

export default DateOfBirthInput;