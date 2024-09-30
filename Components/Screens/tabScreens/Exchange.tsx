import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton'; // Adjust the path as needed
import { ScreenNavigationProp } from '../../../navigation';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';

const options = [
  { currency: 'CAD', flag: require('../../../assets/MappleApp/canada.png') },
  { currency: 'NGN', flag: require('../../../assets/MappleApp/Nigeria.png') }
];

type CurrencyOption = {
  currency: string;
  flag: any;
};

interface Rate {
  _id: string;
  rate: number;
  exchange: string;
  __v: number;
}

export default function Exchange() {
  const navigation = useNavigation<ScreenNavigationProp<'Exchange_2'>>();
  const [selectedCurrency, setSelectedCurrency] = useState('CAD');
  const [showOptions, setShowOptions] = useState(false);
  const [beneficiaryCurrency, setBeneficiaryCurrency] = useState('NGN');
  const [showBeneficiaryOptions, setShowBeneficiaryOptions] = useState(false);
  const [cadAmount, setCadAmount] = useState('');
  const [ngnAmount, setNgnAmount] = useState('');
  const [cadAmouns, setCadAmounts] = useState('');
  const [ngnAmounts, setNgnAmounts] = useState('');
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setShowOptions(false);
    setBeneficiaryCurrency(currency === 'CAD' ? 'NGN' : 'CAD');
  };

  const handleBeneficiaryCurrencySelect = (currency: string) => {
    setBeneficiaryCurrency(currency);
    setShowBeneficiaryOptions(false);
    setSelectedCurrency(currency === 'NGN' ? 'CAD' : 'NGN');
  };

  // Fetch exchange rates
  const fetchRates = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URl}/rate/get-rates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setRates(data.data);
      } else {
        Alert.alert('Error', data.message || 'Unknown error');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRates();
  }, []);

  const handleCurrencyConversion = (amount: string, fromCurrency: string) => {
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(numericAmount)) {
      return;
    }

    if (fromCurrency === 'CAD') {
      const convertedAmount = numericAmount * cadToNgnRate;
      setNgnAmount(convertedAmount.toFixed(2));
      setCadAmount(amount);
    } else {
      const convertedAmount = numericAmount / ngnToCadRate;
      setCadAmount(convertedAmount.toFixed(2));
      setNgnAmount(amount);
    }
  };

  const handleCadInputChange = (value: string) => {
    setCadAmount(value);
    handleCurrencyConversion(value, 'CAD');
  };

  const handleNgnInputChange = (value: string) => {
    setNgnAmount(value);
    handleCurrencyConversion(value, 'NGN');
  };

    useEffect(() => {
    const fetchBalances = async () => {
      try {
        const cad = await SecureStore.getItemAsync('CadBalance');
        const ngn = await SecureStore.getItemAsync('walletBalance');
        if (cad) setCadAmounts(cad);
        if (ngn) setNgnAmounts(ngn);
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

  const storeConversionData = async () => {
    try {
      // Store the amount and currency you're converting from
      await SecureStore.setItemAsync('fromCurrency', selectedCurrency);
      await SecureStore.setItemAsync('fromAmount', cadAmount);
  
      // Store the amount and currency you're converting to
      await SecureStore.setItemAsync('toCurrency', beneficiaryCurrency);
      await SecureStore.setItemAsync('toAmount', ngnAmount);
  
      // Store the conversion rates
      if (selectedCurrency === 'CAD' && beneficiaryCurrency === 'NGN') {
        await SecureStore.setItemAsync('cadToNgnRate', cadToNgnRate.toString());
      } else if (selectedCurrency === 'NGN' && beneficiaryCurrency === 'CAD') {
        await SecureStore.setItemAsync('ngnToCadRate', ngnToCadRate.toString());
      }
  
      console.log(selectedCurrency)
      console.log(cadAmount)
      console.log(ngnAmount)
      console.log(beneficiaryCurrency)
      console.log(cadToNgnRate.toString())
      console.log(ngnToCadRate.toString())
    } catch (error) {
      console.error('Error storing data:', error);
      Alert.alert('Error', 'Failed to store conversion data');
    }
  };  

  // Extract CAD to NGN and NGN to CAD rates from the response
  const cadToNgnRate = rates.find(rate => rate.exchange === 'CAD-TO-NGN')?.rate || 0;
  const ngnToCadRate = rates.find(rate => rate.exchange === 'NGN-TO-CAD')?.rate || 0;
  

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">

          {/* First container */}
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.amountContainer}>
                <Text style={{ fontSize: 16, color: "#A4A6AA" }}>{selectedCurrency === 'CAD' ? '$' : '₦'}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={selectedCurrency === 'CAD' ? cadAmount : ngnAmount}
                  onChangeText={selectedCurrency === 'CAD' ? handleCadInputChange : handleNgnInputChange}
                  keyboardType="numeric"
                  placeholder="5,000"
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
              <Text style={styles.walletAmount}>{selectedCurrency === 'CAD' ? cadAmouns : ngnAmounts}</Text>
            </View>
          </View>

          <View style={styles.convert}>
            <View style={styles.smallContainer}>
              <View style={styles.row}>
                <Image source={require('../../../assets/MappleApp/canada.png')} style={styles.icon}/>
                <Text style={styles.smallContainerText}> CAD --{'>'} </Text>
                <Image source={require('../../../assets/MappleApp/Nigeria.png')} style={styles.icon}/>
                <Text style={styles.smallContainerText}> NGN </Text>
                <Text style={[styles.smallContainerText, { fontWeight: "500", fontSize: 15, paddingLeft: 15 }]}>
                  ₦{cadToNgnRate.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.smallContainer}>
              <View style={styles.row}>
                <Image source={require('../../../assets/MappleApp/Nigeria.png')} style={styles.icon}/>
                <Text style={styles.smallContainerText}> NGN --{'>'} </Text>
                <Image source={require('../../../assets/MappleApp/canada.png')} style={styles.icon}/>
                <Text style={styles.smallContainerText}> CAD </Text>
                <Text style={[styles.smallContainerText, { fontWeight: "500", fontSize: 15, paddingLeft: 15 }]}>
                  ${ngnToCadRate.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Second container */}
          <View style={styles.secondOuterContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.amountContainer}>
                <Text style={{ fontSize: 16, color: "#A4A6AA" }}>{beneficiaryCurrency === 'CAD' ? '$' : '₦'}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={beneficiaryCurrency === 'CAD' ? cadAmount : ngnAmount}
                  editable={false}
                  placeholder="Converted amount"
                />
                <TouchableOpacity
                  style={styles.currencySelector}
                  onPress={() => setShowBeneficiaryOptions(!showBeneficiaryOptions)}
                >
                  <Image
                    source={options.find((option: CurrencyOption) => option.currency === beneficiaryCurrency)?.flag}
                    style={styles.flagImage}
                  />
                  <Text style={styles.currencyText}>{beneficiaryCurrency}</Text>
                  <Ionicons name="caret-down" size={16} color="grey" />
                </TouchableOpacity>
              </View>
              {showBeneficiaryOptions && (
                <View style={styles.optionsContainer}>
                  {options.map(option => (
                    <TouchableOpacity
                      key={option.currency}
                      style={styles.option}
                      onPress={() => handleBeneficiaryCurrencySelect(option.currency)}
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
              <Text style={styles.walletAmount}>{beneficiaryCurrency === 'CAD' ? cadAmouns : ngnAmounts}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              width={"100%"}
              gradientColors={['#ee0979', '#ff6a00']}
              title="Continue"
              onPress={async () => {
                await storeConversionData();
                navigation.navigate('Exchange_2');
              }}
            />
          </View>
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
  line: {
    height: 1,
    backgroundColor: '#00000032',
    marginBottom: 20,
  },
  outerContainer: {
    backgroundColor: '#d1d1d157',
    borderRadius: 15,
    paddingBottom: 20,
    paddingTop: 1,
  },
  secondOuterContainer: {
    backgroundColor: '#d1d1d157',
    borderRadius: 15,
    paddingBottom: 20,
    paddingTop: 1,
    marginBottom: 13,
    position: 'relative',
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
    zIndex: -1
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
  narrationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 13,
  },
  inputContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 3,
  },
  textInput: {
    height: 40,
    color: '#0E314C',
    borderRadius: 10,
    paddingHorizontal: 15,
    flex: 1,
  },
  placeholder: {
    position: 'absolute',
    left: 15,
    color: '#0E314C',
    fontSize: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
  },
  smallContainer: {
    alignItems: 'center',
    alignSelf: 'center',  // Center the small container horizontally
    borderRadius: 20,
    // padding: 10,
    marginVertical: 10
  },
  smallContainerText: {
    color: 'black',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  convert: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 25
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 15,
    height: 15,
  },
});
