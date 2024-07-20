import React, { useState, useEffect } from 'react'; // Added useEffect
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton'; // Adjust the path as needed
import { ScreenNavigationProp } from '../../../navigation';

const options = [
  { currency: 'CAD', flag: require('../../../assets/MappleApp/canada.png') },
  { currency: 'NGN', flag: require('../../../assets/MappleApp/Nigeria.png') }
];

type CurrencyOption = {
  currency: string;
  flag: any;
};

export default function Exchange() {
  const navigation = useNavigation<ScreenNavigationProp<'Exchange_2'>>();
  const [selectedCurrency, setSelectedCurrency] = useState('CAD');
  const [showOptions, setShowOptions] = useState(false);
  const [beneficiaryCurrency, setBeneficiaryCurrency] = useState('NGN');
  const [showBeneficiaryOptions, setShowBeneficiaryOptions] = useState(false);
  const [cadAmount, setCadAmount] = useState('');
  const [ngnAmount, setNgnAmount] = useState('');

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

  const handleCadAmountChange = (amount: string) => {
    setCadAmount(amount);
    if (selectedCurrency === 'CAD') {
      setNgnAmount((Number(amount) * 1082).toString()); // Convert CAD to NGN
    } else {
      setCadAmount((Number(amount) / 1127).toString()); // Convert NGN to CAD
    }
  };

  const handleNgnAmountChange = (amount: string) => {
    setNgnAmount(amount);
    if (selectedCurrency === 'NGN') {
      setCadAmount((Number(amount) / 1127).toString()); // Convert NGN to CAD
    } else {
      setNgnAmount((Number(amount) * 1082).toString()); // Convert CAD to NGN
    }
  };

  const getCurrencySymbol = (currency: string) => {
    return currency === 'CAD' ? '$' : 'N';
  };

  // Fetch API and update state
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://maplepay-server.onrender.com/api'); 
        const data = await response.json();

        setCadAmount((prevAmount) => (Number(prevAmount) * data.CAD_TO_NGN).toString());
        setNgnAmount((prevAmount) => (Number(prevAmount) * data.NGN_TO_CAD).toString());
      } catch (error) {
        console.error(error);
      }
    };

    fetchExchangeRate();
  }, [selectedCurrency, beneficiaryCurrency]);

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <ScrollView>
        <KeyboardAvoidingView style={styles.container} behavior="padding">

          {/* First container */}
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.amountContainer}>
                <Text style={{ fontSize: 16, color: "#A4A6AA" }}>{getCurrencySymbol(selectedCurrency)}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={selectedCurrency === 'CAD' ? cadAmount : ngnAmount}
                  onChangeText={selectedCurrency === 'CAD' ? handleCadAmountChange : handleNgnAmountChange}
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
              <Text style={styles.walletAmount}>{selectedCurrency === 'CAD' ? '$30,000.56' : 'N300,000.56'}</Text>
            </View>
          </View>

          <View style={styles.convert}>
            <View style={styles.smallContainer}>
              <View style={styles.row}>
                <Image source={require('../../../assets/MappleApp/canada.png')} style={styles.icon}/>
                <Text style={styles.smallContainerText}> CAD --{'>'} </Text>
                <Image source={require('../../../assets/MappleApp/Nigeria.png')} style={styles.icon}/>
                <Text style={styles.smallContainerText}> NGN </Text>
                <Text style={[styles.smallContainerText, { fontWeight: "500", fontSize: 15, paddingLeft: 15 }]}> N1,082.00 </Text>
              </View>
            </View>
            <View style={styles.smallContainer}>
              <View style={styles.row}>
                <Image source={require('../../../assets/MappleApp/Nigeria.png')} style={styles.icon}/>
                <Text style={styles.smallContainerText}> NGN --{'>'} </Text>
                <Image source={require('../../../assets/MappleApp/canada.png')} style={styles.icon}/>
                <Text style={styles.smallContainerText}> CAD </Text>
                <Text style={[styles.smallContainerText, { fontWeight: "500", fontSize: 15, paddingLeft: 15 }]}> N1,127.00 </Text>
              </View>
            </View>
          </View>

          {/* Second container */}
          <View style={styles.secondOuterContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.amountContainer}>
                <Text style={{ fontSize: 16, color: "#A4A6AA" }}>{getCurrencySymbol(beneficiaryCurrency)}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={beneficiaryCurrency === 'CAD' ? cadAmount : ngnAmount}
                  onChangeText={beneficiaryCurrency === 'CAD' ? handleCadAmountChange : handleNgnAmountChange}
                  keyboardType="numeric"
                  placeholder="4,000,000"
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
              <Text style={styles.walletAmount}>{beneficiaryCurrency === 'CAD' ? '$30,000.56' : 'N300,000.56'}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              width={"100%"}
              gradientColors={['#ee0979', '#ff6a00']}
              title="Continue"
              onPress={() => navigation.navigate('Exchange_2')}
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
    color: 'grey',
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
  }
});
