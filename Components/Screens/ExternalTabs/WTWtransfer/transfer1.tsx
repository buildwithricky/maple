import * as SecureStore from 'expo-secure-store';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../../Assecories/AnimatedInput';
import CustomButton from '../../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../../navigation';
import { API_URl } from '@env';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';

const options = [
  { currency: 'CAD', flag: require('../../../../assets/MappleApp/canada.png') },
  { currency: 'NGN', flag: require('../../../../assets/MappleApp/Nigeria.png') }
];

type CurrencyOption = {
  currency: string;
  flag: any;
};

export default function Transfer1() {
  const navigation = useNavigation<ScreenNavigationProp<'wtwTransfer3'>>();
  const [selectedCurrency, setSelectedCurrency] = useState('CAD');
  const [showOptions, setShowOptions] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [cadAmount, setCadAmount] = useState('');
  const [ngnAmount, setNgnAmount] = useState('');
  const [cadBalance, setCadBalance] = useState('');
  const [ngnBalance, setNgnBalance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setShowOptions(false);
  };

  const handleAmountChange = (amount: string) => {
    if (selectedCurrency === 'CAD') {
      setCadAmount(amount);
      setNgnAmount((Number(amount) * 1082).toString());
    } else {
      setNgnAmount(amount);
      setCadAmount((Number(amount) / 1082).toString());
    }
  };

  const getCurrencySymbol = (currency: string) => {
    return currency === 'CAD' ? '$' : '₦';
  };

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const cad = await SecureStore.getItemAsync('CadBalance');
        const ngn = await SecureStore.getItemAsync('walletBalance');
        if (cad) setCadBalance(cad);
        if (ngn) setNgnBalance(ngn);
      } catch (error) {
        console.error('Error retrieving wallet balances:', error);
      }
    };

    fetchBalances();
    // Set up an interval to fetch balances every 5 seconds
    const intervalId = setInterval(fetchBalances, 5000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Token not found');

      const response = await fetch(`${API_URl}/wallet/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: accountNumber,
          currency: selectedCurrency,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await SecureStore.setItemAsync('description', description);
        await SecureStore.setItemAsync('amount', selectedCurrency === 'CAD' ? cadAmount : ngnAmount);
        await SecureStore.setItemAsync('currency', selectedCurrency);
        await SecureStore.setItemAsync('transactionMail', accountNumber);
        console.log(selectedCurrency === 'CAD' ? cadAmount : ngnAmount)
        navigation.navigate('wtwTransfer3');
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.amountContainer}>
                <Text style={{ fontSize: 16, color: "#A4A6AA" }}>{getCurrencySymbol(selectedCurrency)}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={selectedCurrency === 'CAD' ? cadAmount : ngnAmount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                />
                <TouchableOpacity
                  style={styles.currencySelector}
                  onPress={() => setShowOptions(!showOptions)}
                >
                  <Image
                    source={options.find((option: CurrencyOption) => option.currency === selectedCurrency)?.flag}
                    style={styles.flagImage}
                  />
                  <Text style={styles.currencyText}>{selectedCurrency}</Text>
                  <Ionicons name="caret-down" size={16} color="grey" />
                </TouchableOpacity>
              </View>
              {showOptions && (
                <View style={styles.optionsContainer}>
                  {options.map(option => (
                    <TouchableOpacity
                      key={option.currency}
                      style={styles.option}
                      onPress={() => handleCurrencySelect(option.currency)}
                    >
                      <Image source={option.flag} style={styles.flagImage} />
                      <Text style={styles.optionText}>{option.currency}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.walletContainer}>
              <View style={styles.walletInfo}>
                <Ionicons name="wallet" size={24} color="#0E314C" />
                <Text style={styles.walletText}>Wallet Bal: </Text>
              </View>
              <Text style={styles.walletAmount}>{selectedCurrency === 'CAD' ? `${cadBalance}` : `${ngnBalance}`}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="Wallet Email"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
             <AnimatedInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              width={"100%"}
              gradientColors={['#ee0979', '#ff6a00']}
              title="Continue"
              onPress={handleContinue}
            />
          </View>
          {loading && <SpinnerOverlay />}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    marginTop: '8%',
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  outerContainer: {
    backgroundColor: '#d1d1d157',
    borderRadius: 15,
    paddingBottom: 20,
    paddingTop: 1,
    marginBottom: 13,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountInput: {
    fontSize: 18,
    color: 'black',
    marginRight: 30,
    padding: 5,
    width: "60%"
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1ff',
    borderRadius: 10,
    padding: 10,
    paddingVertical: 5,
  },
  flagImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  currencyText: {
    color: '#0E314C',
    marginRight: 5,
  },
  optionsContainer: {
    position: 'absolute',
    right: 20,
    top: 50,
    backgroundColor: '#f1f1f1ff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  optionText: {
    marginLeft: 10,
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingRight: 20,
    paddingLeft: 20,
    zIndex: -1,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletText: {
    color: '#0E314C',
    marginLeft: 5,
  },
  walletAmount: {
    color: '#0E314C',
    fontSize: 17,
  },
  inputContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 13,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
  },
});
