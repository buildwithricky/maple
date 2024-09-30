import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker, { EvtTypes } from '@react-native-community/datetimepicker';
import CustomButton from '../../Assecories/CustomButton';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';

type FilterType = {
  startDate?: string;
  endDate?: string;
  currency?: string;
  type?: string;
};

type TransactionFilterProps = {
  onApplyFilter: (filter: FilterType) => void;
};

// Centralized DateTimePicker Component
const CentralizedDatePicker: React.FC<{
  show: boolean;
  date: Date;
  onChange: (event: { type: EvtTypes; nativeEvent: { timestamp: number; utcOffset: number; }; }, selectedDate: Date | undefined) => void;
}> = ({ show, date, onChange }) => {
  if (!show) return null;

  return (
    <View style={styles.centered}>
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={onChange}
        style={styles.date}
      />
    </View>
  );
};

const TransactionFilter: React.FC<TransactionFilterProps> = ({ onApplyFilter }) => {
  const [currency, setCurrency] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCurrencyPress = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
  };

  const handleTypePress = (selectedType: string) => {
    setType(selectedType);
  };

  const handleDateChange = (event: { type: EvtTypes; nativeEvent: { timestamp: number; utcOffset: number; }; }, selectedDate: Date | undefined, isStartDate: boolean) => {
    if (isStartDate) {
      setShowStartDatePicker(false);
      setStartDate(selectedDate || startDate);
    } else {
      setShowEndDatePicker(false);
      setEndDate(selectedDate || endDate);
    }
  };

  const handleApplyFilter = () => {
    setLoading(true);
    const filter: FilterType = {
      currency,
      type,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
    // Simulate an asynchronous operation
    setTimeout(() => {
      onApplyFilter(filter);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Currency selection */}
        <Text style={styles.sectionTitle}>Filter by</Text>
        <Text style={styles.sectionSubtitle}>Select the currency for transactions</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, currency === 'CAD' && styles.selectedButton]}
            onPress={() => handleCurrencyPress('CAD')}
          >
            <Text style={styles.buttonText}>🇨🇦 Canadian Dollar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, currency === 'NGN' && styles.selectedButton]}
            onPress={() => handleCurrencyPress('NGN')}
          >
            <Text style={styles.buttonText}>🇳🇬 Nigerian Naira</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction type selection */}
        <Text style={styles.sectionTitle}>Sort by</Text>
        <Text style={styles.sectionSubtitle}>Select the type of transactions</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, type === 'Incoming' && styles.selectedButton]}
            onPress={() => handleTypePress('Incoming')}
          >
            <Text style={styles.buttonText}>Incoming Trans.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, type === 'Outgoing' && styles.selectedButton]}
            onPress={() => handleTypePress('Outgoing')}
          >
            <Text style={styles.buttonText}>Outgoing Trans.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, type === 'FundSwap' && styles.selectedButton]}
            onPress={() => handleTypePress('FundSwap')}
          >
            <Text style={styles.buttonText}>FundSwap.</Text>
          </TouchableOpacity>
        </View>

        {/* Date range selection */}
        <Text style={styles.sectionTitle}>Filter by date range</Text>
        <Text style={styles.sectionSubtitle}>Select the date range for transactions</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
            <Text>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
            <Text>{endDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>

        {/* Centralized Date Pickers */}
        <View style={styles.centered}>
            <CentralizedDatePicker
                show={showStartDatePicker}
                date={startDate}
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, true)}
            />
            <CentralizedDatePicker
                show={showEndDatePicker}
                date={endDate}
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, false)}
            />
        </View>

        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Apply Filter"
          onPress={handleApplyFilter}
        />
      </View>
      {loading && <SpinnerOverlay />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#F58D88',
  },
  buttonText: {
    fontSize: 12,
    width: "100%"
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50
    },
    date: {
        width: '100%',
    },
});

export default TransactionFilter;